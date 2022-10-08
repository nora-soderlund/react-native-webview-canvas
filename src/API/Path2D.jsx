import BundleAPI from "./Bundle";

export default class Path2D extends BundleAPI{
    constructor(canvasWebView, path2d) {
        super();

        this._canvasWebView = canvasWebView;
        this._path2d = path2d;
    };

    toElement() {
        return this._path2d;
    };
};

const methods = [
    "addPath",
    "closePath",
    "moveTo",
    "lineTo",
    "bezierCurveTo",
    "quadraticCurveTo",
    "arc",
    "ellipse",
    "rect"
];

for(let index = 0; index < methods.length; index++) {
    const method = methods[index];

    if(Path2D.prototype[method] != undefined)
        continue;

    Path2D.prototype[method] = function(...args) {
        let json = JSON.stringify([...args]);

        return new Promise((resolve) => {
            const key = `${this._path2d}_${method}_${this._canvasWebView._getElementCount()}`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._addToBundleOrInject(`
                    postMessage("${key}", ${this._path2d}.${method}(${json.substring(1, json.length - 1)}));
                `);
            }
        });
    };
}
