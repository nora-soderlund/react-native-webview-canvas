import BundleAPI from "./Bundle";

export default class Image {
    constructor(canvasWebView, image) {
        this._canvasWebView = canvasWebView;
        this._image = image;
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

    Object.defineProperty(Image.prototype, property, {
        set(value) {
            if(property.startsWith("on")) {
                const key = `${this._image}.${property}`;

                if(this._canvasWebView._addListener(key, value)) {
                    this._canvasWebView._webView.current.injectJavaScript(`
                        ${key} = () => {
                            postMessage("${key}", null);
                        };
                    `);
                }
            }
            else {
                let json = JSON.stringify([value]);

                this._canvasWebView._webView.current.injectJavaScript(`
                    ${this._image}.${property} = ${json.substring(1, json.length - 1)};
                `);
            }
        },

        get() {
            return new Promise((resolve) => {
                const key = `${this._image}.${property}`;
                
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
    "decode"
];

for(let index = 0; index < methods.length; index++) {
    const method = methods[index];

    if(Image.prototype[method] != undefined)
        continue;

    Image.prototype[method] = function(...args) {
        let json = JSON.stringify([...args]);

        return new Promise((resolve) => {
            const key = `${this._image}.${method}`;
            
            if(this._canvasWebView._addListener(key, resolve)) {
                this._canvasWebView._webView.current.injectJavaScript(`
                    postMessage("${key}", ${this._image}.${method}(${json.substring(1, json.length - 1)}));
                `);
            }
        });
    };
}
