import BundleAPI from "./BundleAPI";

export default class ContextAPI extends BundleAPI {
    constructor(canvas, context) {
        super();

        this._canvas = canvas;
        this._context = context;

        // for the bundle api
        this._webView = this._canvas._webView;
    };
};

const properties = [
    "direction",
    "fillStyle",
    "filter",
    "font",
    "fontKerning",
    "fontStretch",
    "fontVariantCaps",
    "globalAlpha",
    "globalCompositeOperation",
    "imageSmoothingEnabled",
    "imageSmoothingQuality",
    "letterSpacing",
    "lineCap",
    "lineDashOffset",
    "lineJoin",
    "lineWidth",
    "miterLimit",
    "shadowBlur",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY",
    "strokeStyle",
    "textAlign",
    "textBaseline",
    "textRendering",
    "wordSpacing"    
];

for(let index = 0; index < properties.length; index++) {
    const property = properties[index];

    Object.defineProperty(ContextAPI.prototype, property, {
        set(...args) {
            let json = JSON.stringify([...args]);

            this._addToBundleOrInject(`
                ${this._context}.${property} = ${json.substring(1, json.length - 1)};
            `);
        },

        get() {
            return new Promise((resolve) => {
                const key = `${this._context}.${property}`;
                
                if(this._canvas._addListener(key, resolve)) {
                    this._webView.current.injectJavaScript(`
                        window.ReactNativeWebView.postMessage([ "${key}", ${key} ]);
                    `);
                }
            });
        }
    });
}

const methods = [
    "arc",
    "arcTo",
    "beginPath",
    "bezierCurveTo",
    "clearRect",
    "clip",
    "closePath",
    "createConicGradient",
    "createImageData",
    "createLinearGradient",
    "createPattern",
    "createRadialGradient",
    "drawFocusIfNeeded",
    "drawImage",
    "ellipse",
    "fill",
    "fillRect",
    "fillText",
    "getContextAttributes",
    "getImageData",
    "getLineDash",
    "getTransform",
    "isContextLost",
    "isPointInPath",
    "isPointInStroke",
    "lineTo",
    "measureText",
    "moveTo",
    "putImageData",
    "quadraticCurveTo",
    "rect",
    "reset",
    "resetTransform",
    "restore",
    "rotate",
    "roundRect",
    "save",
    "scale",
    "scrollPathIntoView",
    "setLineDash",
    "setTransform",
    "stroke",
    "strokeRect",
    "strokeText",
    "transform",
    "translate"  
];

for(let index = 0; index < methods.length; index++) {
    const method = methods[index];

    ContextAPI.prototype[method] = function(...args) {
        let json = JSON.stringify([...args]);

        this._addToBundleOrInject(`
            ${this._context}.${method}(${json.substring(1, json.length - 1)});
        `);
    };
}
