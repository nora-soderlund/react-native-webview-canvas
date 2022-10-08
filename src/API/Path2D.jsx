import API from "./API";
import BundleAPI from "./Bundle";

export default class Path2D extends BundleAPI{
    constructor(canvasWebView, element) {
        super();

        this._canvasWebView = canvasWebView;
        this._element = element;
    };

    toElement() {
        return this._element;
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

    API.defineMethod(Path2D.prototype, method);
}
