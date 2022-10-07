export default class ContextAPI {
    constructor(canvas, context) {
        this._canvas = canvas;
        this._context = context;
    };

    async clearRect(x, y, w, h) {
        await this._canvas._webView.current.injectJavaScript(`
            ${this._context}.clearRect(${x}, ${y}, ${w}, ${h});
        `);
    };

    set fillStyle(value) {
        this._canvas._webView.current.injectJavaScript(`
            ${this._context}.fillStyle = "${value}";
        `);
    };
    
    async fillRect(x, y, w, h) {
        await this._canvas._webView.current.injectJavaScript(`
            ${this._context}.fillRect(${x}, ${y}, ${w}, ${h});
        `);
    };
    
    async clearRect(x, y, w, h) {
        await this._canvas._webView.current.injectJavaScript(`
            ${this._context}.clearRect(${x}, ${y}, ${w}, ${h});
        `);
    };

    set globalAlpha(value) {
        this._canvas._webView.current.injectJavaScript(`
            ${this._context}.globalAlpha = ${value};
        `);
    };
};
