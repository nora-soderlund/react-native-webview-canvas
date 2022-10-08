export default class API {
    static defineProperty(prototype, property) {
        Object.defineProperty(prototype, property, {
            set(value) {
                if(property.startsWith("on")) {
                    const key = this._canvasWebView._createElement();
    
                    if(this._canvasWebView._addListener(key, value)) {
                        const message = `
                            ${this._element}.${property} = () => {
                                postMessage("${key}", null);
                            };

                            true;
                        `;

                        if(this._addToBundleOrInject)
                            this._addToBundleOrInject(message);
                        else
                            this._canvasWebView._webView.current.injectJavaScript(message);
                    }
                }
                else {
                    let json = JSON.stringify([value]);
        
                    const message = `${this._element}.${property} = ${json.substring(1, json.length - 1)};`;
                    
                    console.log(message);

                    if(this._addToBundleOrInject)
                        this._addToBundleOrInject(message);
                    else
                        this._canvasWebView._webView.current.injectJavaScript(message);
                }
            },
    
            get() {
                return new Promise((resolve) => {
                    const key = this._canvasWebView._createElement();
                    
                    if(this._canvasWebView._addListener(key, resolve)) {
                        this._canvasWebView._webView.current.injectJavaScript(`
                            postMessage("${key}", ${this._element}.${property});
                        `);
                    }
                });
            }
        });
    };

    static defineMethod(prototype, method) {
        prototype[method] = function(...args) {
            if(method.startsWith('_'))
                method = method.substring(1);
   
            const safeArguments = [ ...args ];

            for(let index = 0; index < safeArguments.length; index++) {
                if(typeof safeArguments[index] == "object" && safeArguments[index].hasOwnProperty("_element"))
                    safeArguments[index] = safeArguments[index]._element;
                else
                    safeArguments[index] = JSON.stringify(safeArguments[index]);
            }

            const json = safeArguments.toString();

            return new Promise((resolve) => {
                const key = this._canvasWebView._createElement();
                
                if(this._canvasWebView._addListener(key, resolve)) {
                    const message = `postMessage("${key}", ${this._element}.${method}(${json}));`;

                    console.log(message);

                    if(this._addToBundleOrInject)
                        this._addToBundleOrInject(message);
                    else
                        this._canvasWebView._webView.current.injectJavaScript(message);
                }
            });
        };
    };
};
