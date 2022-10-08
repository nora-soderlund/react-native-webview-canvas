import API from "./API";

export default class Image {
    constructor(canvasWebView, element) {
        this._canvasWebView = canvasWebView;
        this._element = element;
    };
};

const properties = [
    "complete",
    "crossOrigin",
    "decoding",
    "fetchPriority",
    "height",
    "loading",
    "naturalHeight",
    "naturalWidth",
    "referrerPolicy",
    "sizes",
    "src",
    "srcset",
    "width",

    "onload",
    "onerror"
];

for(let index = 0; index < properties.length; index++) {
    const property = properties[index];

    API.defineProperty(Image.prototype, property);
}

const methods = [
    "decode"
];

for(let index = 0; index < methods.length; index++) {
    const method = methods[index];

    if(Image.prototype[method] != undefined)
        continue;

    API.defineMethod(Image.prototype, method);
}
