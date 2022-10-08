import React, { Component } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

import CanvasAPI from "../API/Canvas";
import Path2D from "../API/Path2D";
import Image from "../API/Image";
import ImageData from "../API/ImageData";

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

        if(!this._listeners.hasOwnProperty(data.listener))
            return;

        if(data.message) {
            switch(data.type) {
                case "ImageData":
                    data.message = ImageData.fromMessage(data.message);

                    break;
                
                default: 
                    data.message = JSON.parse(data.message);
                    
                    break;
            }
        }

        this._callListeners(data.listener, data.message);

        this._listeners[data.listener] = this._listeners[data.listener].filter(x => x.type == "permanent");
    };

    _addListener(event, callback) {
        if(!this._listeners.hasOwnProperty(event))
            this._listeners[event] = [];

        this._listeners[event].push({ type: "temporary", callback });

        return this._listeners[event].length == 1;
    };

    _setListener(event, callback) {
        if(!this._listeners.hasOwnProperty(event))
            this._listeners[event] = [];

        this._listeners[event].push({ type: "permanent", callback });

        return this._listeners[event].length == 1;
    };

    _callListeners(event, ...args) {
        if(!this._listeners.hasOwnProperty(event))
            return;

        for(let index = 0; index < this._listeners[event].length; index++)
            this._listeners[event][index].callback(...args);
    };

    _elementCount = 0;

    _createElement() {
        this._elementCount++;

        return `_${this._elementCount}`;
    };

    constructor(...args) {
        super(...args);

        this._webView = React.createRef();
    };

    async requestAnimationFrame(callback) {
        const key = this._createElement();
        if(this._addListener(key, callback)) {
            await this._webView.current.injectJavaScript(`
                window.requestAnimationFrame(() => {
                    postMessage("${key}");
                });
            `);
        }
    };

    async createCanvas() {
        const element = this._createElement();

        await this._webView.current.injectJavaScript(`
            const ${element} = document.createElement("canvas");

            document.body.append(${element});
        `);

        return new CanvasAPI(this, element);
    };

    async createImage() {
        const element = this._createElement();

        await this._webView.current.injectJavaScript(`
            const ${element} = new Image();
        `);

        return new Image(this, element);
    };

    async createPath2D(...args) {
        const element = this._createElement();

        const json = JSON.stringify([...args]);

        await this._webView.current.injectJavaScript(`
            const ${element} = new Path2D(${json.substring(1, json.length - 1)});
        `);

        return new Path2D(this, element);
    };

    async createBackgroundCanvas() {
        const element = `_${this._elementCount}`;

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
                    style={{ backgroundColor: "transparent" }}
                    scrollEnabled={false}
                    overScrollMode={"never"}
                    source={{
                        html: `
                            <html>
                                <head>
                                    <meta charset="UTF-8">

                                    ${(this.props?.enableViewport)?(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`):("")}

                                    <style type="text/css">
                                        html, body {
                                            margin: 0;
                                            padding: 0;
                                        }
                                    </style>

                                    <script type="text/javascript">
                                        function serializeObject(message) {
                                            if(typeof message == "object" && message?.constructor?.name) {
                                                let result = {};

                                                switch(message.constructor.name) {
                                                    case "Object":
                                                        result = JSON.stringify(message);

                                                        break;

                                                    case "Uint8ClampedArray":
                                                        result = '[' + message.toString() + ']';
                                                        break;

                                                    default:
                                                        for(let key in message)
                                                            result[key] = serializeObject(message[key]);

                                                        result = JSON.stringify(result);

                                                        break;
                                                }

                                                return result;
                                            }

                                            return JSON.stringify(message);
                                        };

                                        function postMessage(listener, message) {
                                            let result = serializeObject(message);

                                            window.ReactNativeWebView.postMessage(JSON.stringify({ listener, type: message?.constructor?.name, message: result }));
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
