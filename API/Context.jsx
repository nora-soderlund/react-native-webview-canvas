import BundleAPI from "./Bundle";

export default class ContextAPI extends BundleAPI {
    constructor(canvasWebView, context) {
        super();

        this._canvasWebView = canvasWebView;
        this._context = context;
    };

    drawImage(image, ...args) {
        let json = JSON.stringify([...args]);

        this._canvasWebView._webView.current.injectJavaScript(`
            ${this._context}.drawImage(${image._image}, ${json.substring(1, json.length - 1)});
        `);
    };

    putImageData(imageData, ...args) {
        let json = JSON.stringify([...args]);
        let jsonImageData = JSON.stringify([imageData.toObject()]);

        return new Promise((resolve) => {
            const key = `${this._context}.putImageData`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._canvasWebView._webView.current.injectJavaScript(`
                    {
                        const imageData = ${jsonImageData.substring(1, jsonImageData.length - 1)};

                        const newImageData = ${this._context}.createImageData(imageData.width, imageData.height);
                        newImageData.data.set(imageData.data);

                        const result = ${this._context}.putImageData(newImageData, ${json.substring(1, json.length - 1)});

                        postMessage("${key}", result);
                    }
                `);
            }
        });
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
                
                if(this._canvasWebView._addListener(key, resolve)) {
                    this._canvasWebView._webView.current.injectJavaScript(`
                        postMessage("${key}", ${key});
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

    if(ContextAPI.prototype[method] != undefined)
        continue;

    ContextAPI.prototype[method] = function(...args) {
        let json = JSON.stringify([...args]);

        return new Promise((resolve) => {
            const key = `${this._context}.${method}`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._canvasWebView._webView.current.injectJavaScript(`
                    postMessage("${key}", ${this._context}.${method}(${json.substring(1, json.length - 1)}));
                `);
            }
        });
    };
}
