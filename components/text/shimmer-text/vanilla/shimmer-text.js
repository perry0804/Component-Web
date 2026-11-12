/**
 * <shimmer-text> 流光文字 Web Component
 * 支持鼠标移入定位、跟随移动、移出原地续播
 *
 * 支持属性 (Attributes):
 * - mode: "loop" | "bounce" (默认 "loop")
 * - base-color: 文字底色 (默认 "#6b6661")
 * - highlight-color: 高亮流光色 (默认 "#58a6ff")
 * - spread: 高亮光斑半径百分比 (默认 14)
 * - speed: 自动扫光速度，每秒移动百分比 (默认 loop:58 / bounce:52)
 * - interactive: 是否开启鼠标移入锁定与跟随，"true" | "false" (默认 "true")
 *
 * 用法：
 *   <script src="./shimmer-text.js"></script>
 *   <shimmer-text mode="bounce">Hello World</shimmer-text>
 */
(() => {
  const TAG = 'shimmer-text';
  if (customElements.get(TAG)) return;

  class ShimmerTextElement extends HTMLElement {
    static get observedAttributes() {
      return ['mode', 'base-color', 'highlight-color', 'spread', 'speed', 'interactive'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this.currentX = 0;
      this.direction = 1;
      this.isHovering = false;
      this.lastTime = 0;
      this.rafId = null;
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.tick = this.tick.bind(this);
    }

    get mode() {
      return this.getAttribute('mode') || 'loop';
    }

    get baseColor() {
      return this.getAttribute('base-color') || '#6b6661';
    }

    get highlightColor() {
      return this.getAttribute('highlight-color') || '#58a6ff';
    }

    get spread() {
      return Number(this.getAttribute('spread')) || 14;
    }

    get speed() {
      return Number(this.getAttribute('speed')) || (this.mode === 'loop' ? 58 : 52);
    }

    get interactive() {
      return this.getAttribute('interactive') !== 'false';
    }

    connectedCallback() {
      this.renderTemplate();
      this.updateStyles();
      this.bindEvents();
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame(this.tick);
    }

    disconnectedCallback() {
      this.unbindEvents();
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    attributeChangedCallback() {
      if (this.isConnected) {
        this.updateStyles();
      }
    }

    renderTemplate() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            --shimmer-x: 50%;
            --base-color: #6b6661;
            --highlight-color: #58a6ff;
            --spread: 14%;
          }
          .shimmer-container {
            font-size: inherit;
            line-height: 1.5;
            padding: 4px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            user-select: none;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            background-image: linear-gradient(
              90deg,
              var(--base-color) 0%,
              var(--base-color) calc(var(--shimmer-x) - var(--spread)),
              var(--highlight-color) var(--shimmer-x),
              var(--base-color) calc(var(--shimmer-x) + var(--spread)),
              var(--base-color) 100%
            );
            background-size: 100% 100%;
          }
        </style>
        <div class="shimmer-container" part="text">
          <slot></slot>
        </div>
      `;
      this.containerEl = this.shadowRoot.querySelector('.shimmer-container');
    }

    updateStyles() {
      this.style.setProperty('--base-color', this.baseColor);
      this.style.setProperty('--highlight-color', this.highlightColor);
      this.style.setProperty('--spread', `${this.spread}%`);
      if (this.containerEl) {
        this.containerEl.style.cursor = this.interactive ? 'pointer' : 'default';
      }
    }

    setShimmerX(x) {
      this.style.setProperty('--shimmer-x', `${x.toFixed(2)}%`);
    }

    getMousePercent(e) {
      const rect = this.containerEl.getBoundingClientRect();
      if (!rect.width) return 50;
      const ratio = (e.clientX - rect.left) / rect.width;
      return Math.max(0, Math.min(1, ratio)) * 100;
    }

    handleMouseEnter(e) {
      if (!this.interactive) return;
      this.isHovering = true;
      this.currentX = this.getMousePercent(e);
      this.setShimmerX(this.currentX);
    }

    handleMouseMove(e) {
      if (!this.interactive || !this.isHovering) return;
      const nextX = this.getMousePercent(e);
      const delta = nextX - this.currentX;
      if (Math.abs(delta) > 0.2) {
        this.direction = delta > 0 ? 1 : -1;
      }
      this.currentX = nextX;
      this.setShimmerX(this.currentX);
    }

    handleMouseLeave() {
      if (!this.interactive) return;
      this.isHovering = false;
      this.lastTime = performance.now();
      if (this.mode === 'loop') {
        this.direction = 1;
      }
    }

    bindEvents() {
      this.containerEl.addEventListener('mouseenter', this.handleMouseEnter);
      this.containerEl.addEventListener('mousemove', this.handleMouseMove);
      this.containerEl.addEventListener('mouseleave', this.handleMouseLeave);
    }

    unbindEvents() {
      if (!this.containerEl) return;
      this.containerEl.removeEventListener('mouseenter', this.handleMouseEnter);
      this.containerEl.removeEventListener('mousemove', this.handleMouseMove);
      this.containerEl.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    tick(now) {
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;

      // 减少动态效果时：停止自动扫光，仅保留鼠标跟随
      if (!this.isHovering && !this.reduceMotion.matches) {
        const minX = -this.spread;
        const maxX = 100 + this.spread;
        const range = maxX - minX;

        this.currentX += this.direction * this.speed * dt;

        if (this.mode === 'loop') {
          if (this.currentX > maxX) {
            this.currentX = minX + ((this.currentX - maxX) % range);
          }
        } else {
          if (this.currentX >= maxX) {
            this.currentX = maxX;
            this.direction = -1;
          } else if (this.currentX <= minX) {
            this.currentX = minX;
            this.direction = 1;
          }
        }

        this.setShimmerX(this.currentX);
      }

      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  customElements.define(TAG, ShimmerTextElement);
})();
