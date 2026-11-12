/**
 * <{{slug}}> {{title}}
 *
 * 支持属性 (Attributes):
 * - example: 示例参数 (默认 "")
 *
 * 用法：
 *   <script src="./{{slug}}.js"></script>
 *   <{{slug}} example="value"></{{slug}}>
 */
(() => {
  const TAG = '{{slug}}';
  if (customElements.get(TAG)) return;

  class {{Name}}Element extends HTMLElement {
    static get observedAttributes() {
      return ['example'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    }

    get example() {
      return this.getAttribute('example') ?? '';
    }

    connectedCallback() {
      this.render();
      // TODO: 绑定事件 / 启动动画
    }

    disconnectedCallback() {
      // TODO: 清理 rAF / 事件监听 / Observer
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          @media (prefers-reduced-motion: reduce) {
            /* 关闭或弱化动画 */
          }
        </style>
        <div part="root">
          <slot>{{title}}</slot>
        </div>
      `;
    }
  }

  customElements.define(TAG, {{Name}}Element);
})();
