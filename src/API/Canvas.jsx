import ContextAPI from "./Context";

export default class CanvasAPI {
    constructor(canvasWebView, canvas) {
        this._canvasWebView = canvasWebView;
        this._canvas = canvas;
    };

    async getContext(type) {
        const context = `${this._canvas}_context_${type}`;

        await this._canvasWebView._webView.current.injectJavaScript(`
            let ${context} = ${this._canvas}.getContext("${type}");
        `);

        return new ContextAPI(this._canvasWebView, context);
    };

    set width(value) {
        this._canvasWebView._webView.current.injectJavaScript(`
            ${this._canvas}.width = ${value};
        `);
    };

    get width() {
        return new Promise((resolve) => {
            const key = `${this._canvas}.width`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._canvasWebView._webView.current.injectJavaScript(`
                    postMessage("${key}", ${key});
                `);
            }
        });
    };

    set height(value) {
        this._canvasWebView._webView.current.injectJavaScript(`
            ${this._canvas}.height = ${value};
        `);
    };

    get height() {
        return new Promise((resolve) => {
            const key = `${this._canvas}.height`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._canvasWebView._webView.current.injectJavaScript(`
                    postMessage("${key}", ${key});
                `);
            }
        });
    };
};
