import ContextAPI from "./Context";

export default class CanvasAPI {
    static _elementCount = 0;

    static _createElement() {
        this._elementCount++;

        return `_${this._elementCount}`;
    };

    constructor(webView) {
        this._webView = webView;
        this._element = CanvasAPI._createElement();
    };

    async createElement() {
        await this._webView.injectJavaScript(`
            const ${this._element} = document.createElement("canvas");

            document.body.append(${this._element});
        `);
    };

    async getContext(type) {
        const context = `${this._element}_context_${type}`;

        await this._webView.injectJavaScript(`
            const ${context} = ${this._element}.getContext("${type}");
        `);

        return new ContextAPI(this, context);
    };
};
