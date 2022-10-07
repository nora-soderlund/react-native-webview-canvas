import { TouchableHighlightBase } from "react-native";

export default class ContextAPI {
    constructor(canvas, context) {
        this._canvas = canvas;
        this._context = context;
    };

    _bundle = null;

    startBundle() {
        this._bundle = [];
    };

    async executeBundle() {
        await this._canvas._webView.current.injectJavaScript(`
            {
                ${this._bundle.join("")}
            }
        `);

        this.stopBundle();
    };

    async stopBundle() {
        this._bundle = null;
    };

    async _addToBundleOrInject(message) {
        if(this._bundle)
            this._bundle.push(message);
        else
            await this._canvas._webView.current.injectJavaScript(message);
    };

    async clearRect(x, y, w, h) {
        await this._addToBundleOrInject(`
            ${this._context}.clearRect(${x}, ${y}, ${w}, ${h});
        `);
    };

    set fillStyle(value) {
        this._addToBundleOrInject(`
            ${this._context}.fillStyle = "${value}";
        `);
    };
    
    async fillRect(x, y, w, h) {
        await this._addToBundleOrInject(`
            ${this._context}.fillRect(${x}, ${y}, ${w}, ${h});
        `);
    };
    
    async clearRect(x, y, w, h) {
        await this._addToBundleOrInject(`
            ${this._context}.clearRect(${x}, ${y}, ${w}, ${h});
        `);
    };

    set globalAlpha(value) {
        this._addToBundleOrInject(`
            ${this._context}.globalAlpha = ${value};
        `);
    };
};
