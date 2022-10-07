import React, { Component } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

import CanvasAPI from "./../API/Canvas";

export default class CanvasWebView extends Component {
    _listeners = {};

    _serializeMessage(message) {
        const result = {};

        for(let key in message)
            result[key] = JSON.stringify(message[key]);

        return JSON.stringify(result);
    }

    _onMessage(event) {
        const data = JSON.parse(event.nativeEvent.data);

        if(data.message) {
            try {
                data.message = JSON.parse(data.message);

                if(typeof data.message == "object") {
                    for(let key in data.message) {
                        try {
                            data.message[key] = JSON.parse(data.message[key]);
                        }
                        catch {
                            console.error(`Failed to parse ${key} in ${data.listener}, passing as a ${typeof data.message[key]}`);
                        }
                    }
                }
            }
            catch {
                console.error(`Failed to parse message in ${data.listener}, passing as a ${typeof data.message}`);
            }
        }

        this._callListeners(data.listener, data.message);
        this._removeListeners(data.listener);
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
                    postMessage("requestAnimationFrame");
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

                                    <script type="text/javascript">
                                        function postMessage(listener, message) {
                                            let result = message;

                                            if(typeof message == "object") {
                                                result = {};

                                                for(let key in message) {
                                                    if(typeof message[key] == "object" && message[key].constructor.name == "Uint8ClampedArray") {
                                                        result[key] = "[" + message[key].toString() + "]";

                                                        continue;
                                                    }

                                                    result[key] = JSON.stringify(message[key]);
                                                }

                                                result = JSON.stringify(result);
                                            }

                                            window.ReactNativeWebView.postMessage(JSON.stringify({ listener, message: result }));
                                        };
                                    </script>
                                </head>
                            </html>
                        `
                    }}
                    />
            </View>
        );
    };
};
