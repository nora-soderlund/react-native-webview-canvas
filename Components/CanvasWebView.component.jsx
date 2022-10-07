import React, { Component } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

import CanvasAPI from "./../API/Canvas";

export default class CanvasWebView extends Component {
    _listeners = {};

    _onMessage(event) {
        const sections = event.nativeEvent.data.split(',');

        this._callListeners(...sections);
        this._removeListeners(...sections);
    };

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

    _canvasCount = 0;

    constructor(...args) {
        super(...args);

        this._webView = React.createRef();
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

    async createCanvas() {
        const element = `_${this._canvasCount}`;

        await this._webView.current.injectJavaScript(`
            const ${element} = document.createElement("canvas");

            document.body.append(${element});
        `);

        return new CanvasAPI(this, element);
    };

    async createBackgroundCanvas() {
        const element = `_${this._canvasCount}`;

        await this._webView.current.injectJavaScript(`
            const ${element} = document.createElement("canvas");
        `);

        return new CanvasAPI(this, element);
    };

    render() {
        return (
            <View
                width={this.props.width}
                height={this.props.height}
                >
                <WebView
                    ref={this._webView}
                    onLoad={() => this.props?.onLoad && this.props.onLoad(this)}
                    onMessage={(...args) => this._onMessage(...args)}
                    source={{
                        html: `
                            <html>
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">

                                    <style type="text/css">
                                        html, body {
                                            margin: 0;
                                            padding: 0;
                                        }
                                    </style>
                                </head>
                            </html>
                        `
                    }}
                    />
            </View>
        );
    };
};
