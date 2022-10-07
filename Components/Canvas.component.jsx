import React, { Component } from "react";
import { PixelRatio, View } from "react-native";
import WebView from "react-native-webview";

import Document from "../API/Document";
import CanvasAPI from "../API/Canvas";


export default class Canvas extends CanvasAPI {
    constructor(...args) {
        super(...args);

        this._webView = React.createRef();
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
