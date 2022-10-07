import BundleAPI from "./BundleAPI";

export default class ContextAPI extends BundleAPI {
    constructor(canvas, context) {
        super();

        this._canvas = canvas;
        this._context = context;

        // for the bundle api
        this._webView = this._canvas._webView;
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
