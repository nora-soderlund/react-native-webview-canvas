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
                this._addToBundleOrInject(`
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

    fill(...args) {
        const argsArray = [...args];

        if(typeof argsArray[0] == "object" && argsArray[0].toElement) {
            let json = JSON.stringify(argsArray.slice(1));

            return new Promise((resolve) => {
                const key = `${this._context}_fill_${this._canvasWebView._getElementCount()}`;
                
                if(this._canvasWebView._addListener(key, resolve)) {
                    this._addToBundleOrInject(`
                        postMessage("${key}", ${this._context}.fill(${argsArray[0].toElement()}, ${json.substring(1, json.length - 1)}));
                    `);
                }
            });
        }
        else
            return this._fill(...args);
    };

    stroke(...args) {
        const argsArray = [...args];

        if(typeof argsArray[0] == "object" && argsArray[0].toElement) {
            let json = JSON.stringify(argsArray.slice(1));

            return new Promise((resolve) => {
                const key = `${this._context}_stroke_${this._canvasWebView._getElementCount()}`;
                
                if(this._canvasWebView._addListener(key, resolve)) {
                    this._addToBundleOrInject(`
                        postMessage("${key}", ${this._context}.stroke(${argsArray[0].toElement()}, ${json.substring(1, json.length - 1)}));
                    `);
                }
            });
        }
        else
            return this._stroke(...args);
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
        set(value) {
            let json = JSON.stringify([value]);

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
    "_fill",
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
    "_stroke",
    "strokeRect",
    "strokeText",
    "transform",
    "translate"  
];

for(let index = 0; index < methods.length; index++) {
    let method = methods[index];

    if(ContextAPI.prototype[method] != undefined)
        continue;

    ContextAPI.prototype[method] = function(...args) {
        if(method.startsWith('_'))
            method = method.substring(1);

        let json = JSON.stringify([...args]);

        return new Promise((resolve) => {
            const key = `${this._context}_${method}_${this._canvasWebView._getElementCount()}`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._addToBundleOrInject(`
                    postMessage("${key}", ${this._context}.${method}(${json.substring(1, json.length - 1)}));
                `);
            }
        });
    };
}
