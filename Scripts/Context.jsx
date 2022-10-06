export default class ContextAPI {
    constructor(canvas, context) {
        this._canvas = canvas;
        this._context = context;
    };

    async clearRect(x, y, w, h) {
        await this._canvas._webView.injectJavaScript(`
            ${this._context}.clearRect(${x}, ${y}, ${w}, ${h});
        `);
    };

    async fillRect(x, y, w, h) {
        await this._canvas._webView.injectJavaScript(`
            ${this._context}.fillRect(${x}, ${y}, ${w}, ${h});
        `);
    };
};
