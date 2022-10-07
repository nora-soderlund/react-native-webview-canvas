import { Component } from "react";

import ContextAPI from "./Context";

export default class CanvasAPI extends Component {
    static _elementCount = 0;

    static _createElement() {
        this._elementCount++;

        return `_${this._elementCount}`;
    };
    
    _element = CanvasAPI._createElement();

    _listeners = {};

    _addListener(event, callback) {
        if(!this._listeners.hasOwnProperty(event))
            this._listeners[event] = [];

        this._listeners[event].push(callback);

        return this._listeners[event].length == 1;
    };

    _callListeners(event, ...args) {
        if(!this._listeners.hasOwnProperty(event))
            return;

        for(let index = 0; index < this._listeners[event].length; index++)
            this._listeners[event][index](...args);
    };

    _removeListeners(event) {
        delete this._listeners[event];
    };

    _onMessage(event) {
        const sections = event.nativeEvent.data.split(',');

        this._callListeners(...sections);
        this._removeListeners(...sections);
    };

    async requestAnimationFrame(callback) {
        if(this._addListener("requestAnimationFrame", callback)) {
            await this._webView.current.injectJavaScript(`
                window.requestAnimationFrame(() => {
                    window.ReactNativeWebView.postMessage([ "requestAnimationFrame" ]);
                });
            `);
        }
    };

    async createElement() {
        await this._webView.current.injectJavaScript(`
            const ${this._element} = document.createElement("canvas");

            document.body.append(${this._element});
        `);
    };

    async getContext(type) {
        const context = `${this._element}_context_${type}`;

        await this._webView.current.injectJavaScript(`
            const ${context} = ${this._element}.getContext("${type}");
        `);

        return new ContextAPI(this, context);
    };

    set width(value) {
        this._webView.current.injectJavaScript(`
            ${this._element}.width = ${value};
        `);
    };

    set height(value) {
        this._webView.current.injectJavaScript(`
            ${this._element}.height = ${value};
        `);
    };
};
