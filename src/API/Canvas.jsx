import API from "./API";
import ContextAPI from "./Context";

export default class CanvasAPI {
    constructor(canvasWebView, element) {
        this._canvasWebView = canvasWebView;
        this._element = element;
    };

    async getContext(type) {
        const context = `${this._element}_context_${type}`;

        await this._canvasWebView._webView.current.injectJavaScript(`
            let ${context} = ${this._element}.getContext("${type}");
        `);

        return new ContextAPI(this._canvasWebView, context);
    };
};

const properties = [
    "width",
    "height"
];

for(let index = 0; index < properties.length; index++)
    API.defineProperty(CanvasAPI.prototype, properties[index]);
