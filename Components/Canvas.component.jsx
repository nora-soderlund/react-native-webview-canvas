import React, { Component } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

import WebViewFunctions from "./../WebView";

import Document from "./../Scripts/Document";
import CanvasAPI from "./../Scripts/Canvas";

export default class Canvas extends Component {
    constructor(...args) {
        super(...args);

        this.webView = React.createRef();
    };

    async onLoadEnd() {
        if(!this.webView.current)
            return;

        const webView = this.webView.current;

        const canvas = new CanvasAPI(webView);
        await canvas.createElement();

        const context = await canvas.getContext("2d");

        await context.fillRect(0, 0, 50, 50);

        let left = 0;

        setInterval(async () => {
            await context.clearRect(left, 0, 50, 50);

            left++;

            if(left == 100)
                left = 0;

            await context.fillRect(left, 0, 50, 50);
        }, 10);
    };

    render() {
        console.log("render");
        
        return (
            <View width={this.props.width} height={this.props.height}>
                <WebView ref={this.webView} onLoadEnd={() => this.onLoadEnd()}/>
            </View>
        );
    };
};
