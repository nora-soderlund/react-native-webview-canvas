import API from "./API";
import BundleAPI from "./Bundle";

export default class ContextAPI extends BundleAPI {
    constructor(canvasWebView, element) {
        super();

        this._canvasWebView = canvasWebView;
        this._element = element;
    };

    putImageData(imageData, ...args) {
        let json = JSON.stringify([...args]);
        let jsonImageData = JSON.stringify([imageData.toObject()]);

        return new Promise((resolve) => {
            const key = `${this._element}.putImageData`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._addToBundleOrInject(`
                    {
                        const imageData = ${jsonImageData.substring(1, jsonImageData.length - 1)};

                        const newImageData = ${this._element}.createImageData(imageData.width, imageData.height);
                        newImageData.data.set(imageData.data);

                        const result = ${this._element}.putImageData(newImageData, ${json.substring(1, json.length - 1)});

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

for(let index = 0; index < properties.length; index++)
    API.defineProperty(ContextAPI.prototype, properties[index]);

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
    let method = methods[index];

    if(ContextAPI.prototype[method] != undefined)
        continue;

    API.defineMethod(ContextAPI.prototype, method);
}
