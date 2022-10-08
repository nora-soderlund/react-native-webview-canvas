import React, { Component } from "react";
import { View } from "react-native";

import CanvasWebView, { Image, ImageData } from "react-native-webview-canvas";

export default class App extends Component {
	async onLoad(canvasWebView) {
		const canvas = await canvasWebView.createCanvas();
		
		canvas.width = 300;
		canvas.height = 300;

		const context = await canvas.getContext("2d");

		context.fillStyle = "green";
		context.fillRect(0, 0, 300, 300);

		context.font = "40px sans-serif";
		context.textAlign = "center";
		context.textBaseline = "middle";
		
		context.fillStyle = "red";
		context.fillText("Hello World", 150, 150);

		{
			//const imageData = await context.getImageData(125, 125, 50, 50);

			const dataArray = new Uint8ClampedArray(4 * 50 * 50);

			for(let pixel = 0; pixel < dataArray.length; pixel += 4) {
				dataArray[pixel] = 255;
				dataArray[pixel + 3] = 255;
			}

			const imageData = new ImageData(dataArray, 50, 50);

			context.putImageData(imageData, 0, 200);
		}

		{
			const image = await canvasWebView.createImage();

			image.onload = async () => {
				const padding = Math.floor((300 - (await image.width)) / 2);

				context.drawImage(image, padding, padding);
			};

			image.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
		}
	};

	render() {
		return (
			<View
				style={{
					flex: 1,

					alignItems: "center",
					justifyContent: "center",
					
					backgroundColor: "blue"
				}}
				>

				<CanvasWebView
					onLoad={this.onLoad}
					width={300}
					height={300}
					/>
			</View>
		);
	};
};
