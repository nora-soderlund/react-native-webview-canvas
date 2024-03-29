# Deprecated warning
I am no longer maintaining this package and I recommend you to switch to [expo-2d-context](https://github.com/expo/expo-2d-context) or similar.

# react-native-webview-canvas
A component and function mapper between the Canvas API and your React Native application.

## About The Project
React Native WebView Canvas is a component and function mapper between your React Native application and canvas' inside of a WebView component. It allows you to use the Canvas API without having to port the communication with a WebView yourself or use a second route to manage the WebView scripts.

[View the package on NPM.](https://www.npmjs.com/package/react-native-webview-canvas)

## Installation
```
npm install react-native-webview-canvas
```

## Usage
With the Bundle API (prefered):
```jsx
import React, { Component } from "react";
import { PixelRatio } from "react-native";

import CanvasWebView, { Path2D, Image, ImageData } from "react-native-webview-canvas";

class MyCanvasComponent extends Component {
  async onLoad(canvasWebView) {
    const canvas = await canvasWebView.createCanvas();

    const pixelRatio = PixelRatio.get();
    
    canvas.width = 300 * pixelRatio;
    canvas.height = 300 * pixelRatio;

    const context = await canvas.getContext("2d");
    
    context.startBundle();

    context.fillStyle = "green";
    context.fillRect(0, 0, 300 * pixelRatio, 300 * pixelRatio);

    context.font = `${14 * pixelRatio}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    context.fillStyle = "red";
    context.fillText("Hello World", 150 * pixelRatio, 150 * pixelRatio);

    await context.executeBundle();
  };
  
  render() {
    return (
      <CanvasWebView
        width={300}
        height={300}
        onLoad={this.onLoad}
        />
    );
  };
}
```

Without the Bundle API:
```jsx
import React, { Component } from "react";
import CanvasWebView, { Path2D, Image, ImageData } from "react-native-webview-canvas";

class MyCanvasComponent extends Component {
  async onLoad(canvasWebView) {
    const canvas = await canvasWebView.createCanvas();
    
    canvas.width = 300 * pixelRatio;
    canvas.height = 300 * pixelRatio;

    const context = await canvas.getContext("2d");

    context.fillStyle = "green";
    await context.fillRect(0, 0, 300 * pixelRatio, 300 * pixelRatio);

    context.font = `${14 * pixelRatio}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    context.fillStyle = "red";
    await context.fillText("Hello World", 150 * pixelRatio, 150 * pixelRatio);
  };
  
  render() {
    return (
      <CanvasWebView
        width={300}
        height={300}
        onLoad={this.onLoad}
        />
    );
  };
}
```

# References
## CanvasWebView
### Props
- width

Sets the width of the WebView (workspace) instance and NOT the Canvas API element.
- height

Sets the height of the WebView (workspace) instance and NOT the Canvas API element.
- enableViewport

If true, adds a viewport meta tag to set the pixel ratio to the device-width. By setting this to true, you won't need to use PixelRatio.get() but you will also be presented with a more blury natural outcome from the canvas on devices with large pixel ratios, such as iOS devices.
- onLoad

Dispatches when the workspace is ready to be used. This is where you should initialize your render functions.

### Methods
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- `async createCanvas()`

Creates an instance of the Canvas API.
- `async createBackgroundCanvas()`

Creates an instance of the Canvas API that is not rendered.
- `async createImage()`

Creates an instance of the Image API.

## Canvas API
### Properties
- [width](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/width)
- [height](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/height)

### Methods
- [getContext](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)

## Context API (extends Bundle API)
This has no methods or properties.

## Path2D API (extends Bundle API)
This has no methods or properties and follows the CanvasRenderingContext2D interface like the Path2D API except for the constructor and can be used as such:

```jsx
import { Path2D } from "react-native-webview-canvas";

// ...

const path = await canvasWebView.createPath2D();

path.startBundle();

path.moveTo(0, 0);

path.lineTo(100, 0);
path.lineTo(100, 100);

await path.executeBundle();

context.fillStyle = "orange";
context.fill(path);
```

## Image API
This has no methods or properties and follows the HTMLImageElement like the Image API except for the constructor and can be used as such:

```jsx
import { Image } from "react-native-webview-canvas";

// ...

const image = await canvasWebView.createImage();

image.onload = () => {
    context.drawImage(image, 0, 0);
};

image.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
```

## ImageData API
This package implements a clone of the ImageData API that is both constructed automatically by getImageData, but can also be constructed manually and be used together with Uint8ClampedArray like so:
```jsx
import { ImageData } from "react-native-webview-canvas";

// ...

const dataArray = new Uint8ClampedArray(4 * 50 * 50);

for(let pixel = 0; pixel < dataArray.length; pixel += 4) {
    dataArray[pixel] = 255;

    dataArray[pixel + 3] = 255;
}

const imageData = new ImageData(dataArray, 50, 50);

context.putImageData(imageData, 0, 0);
```

### Methods
- [ImageData()](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData)

### Properties
- [data](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data)
- [height](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/height)
- [width](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/width)

## Bundle API
The Bundle API is used to prevent issues when performing several operations synchronously, such as drawing an animation throughout each frame. Enabling this stops the instance from dispatching your property change or method call right away and instead records it for later for when you've finished your bundle and then dispatches everything in one single message.
- `startBundle()`

Starts recording all method calls and property changes and does not actually dispatch anything until `executeBundle` is called.

- `async executeBundle()`

Dispatches the collected bundle to the WebView frame, in the same order that they were recorded. This also clears the bundle list AND it stops recording, use `startBundle` again to keep recording changes.

- `clearBundle()`

Empties the current bundle list but DOES NOT execute it. This does NOT stop recording the bundle.

- `stopBundle()`

Stops recording the bundle but DOES NOT empty it.

# Extended Reference
### Methods
All methods in here accepts `await` but may not require it. To return a value, you must use `await`. And when not using the Bundle API, you may want to await for the method to complete before performing another operation to avoid issues. In these cases, you should instead use the Bundle API.

### Properties
Each and every property here returns a Promise in the getter, this means you must await it or catch it in a callback. Keep in mind if you're using the Bundle API, anything that's not been executed will not show up.

## Context API
### Properties
- [fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle)
- [filter](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter)
- [font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font)
- [fontKerning](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontKerning)
- [fontStretch](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontStretch)
- [fontVariantCaps](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontVariantCaps)
- [globalAlpha](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha)
- [globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)
- [imageSmoothingEnabled](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled)
- [imageSmoothingQuality](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality)
- [letterSpacing](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing)
- [lineCap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap)
- [lineDashOffset](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset)
- [lineJoin](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin)
- [lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth)
- [miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit)
- [shadowBlur](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur)
- [shadowColor](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowColor)
- [shadowOffsetX](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX)
- [shadowOffsetY](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY)
- [strokeStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)
- [textAlign](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign)
- [textBaseline](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline)
- [textRendering](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textRendering)
- [wordSpacing](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/wordSpacing)

### Methods
- [arc](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc)
- [arcTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arcTo)
- [beginPath](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath)
- [bezierCurveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo)
- [clearRect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect)
- [clip](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip)
- [closePath](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath)
- [createConicGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createConicGradient)
- [createImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData)
- [createLinearGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient)
- [createPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern)
- [createRadialGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient)
- [drawFocusIfNeeded](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded)
- [drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [ellipse](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse)
- [fill](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill)
- [fillRect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect)
- [fillText](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText)
- [getContextAttributes](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getContextAttributes)
- [getImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData)
- [getLineDash](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getLineDash)
- [getTransform](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getTransform)
- [isContextLost](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isContextLost)
- [isPointInPath](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath)
- [isPointInStroke](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInStroke)
- [lineTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo)
- [measureText](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText)
- [moveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo)
- [putImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData)
- [quadraticCurveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo)
- [rect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect)
- [reset](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/reset)
- [resetTransform](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/resetTransform)
- [restore](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore)
- [rotate](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate)
- [roundRect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect)
- [save](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save)
- [scale](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale)
- [scrollPathIntoView](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scrollPathIntoView)
- [setLineDash](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)
- [setTransform](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform)
- [stroke](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke)
- [strokeRect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect)
- [strokeText](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeText)
- [transform](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform)
- [translate](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate)

## Path2D API
### Methods
- [addPath](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/addPath)
- [closePath](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/closePath)
- [moveTo](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/moveTo)
- [lineTo](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/lineTo)
- [bezierCurveTo](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/bezierCurveTo)
- [quadraticCurveTo](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/quadraticCurveTo)
- [arc](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/arc)
- [ellipse](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/ellipse)
- [rect](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/rect)

## Image API
### Properties
- [complete](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/complete)
- [crossOrigin](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin)
- [decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)
- [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority)
- [height](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/height)
- [loading](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading)
- [naturalHeight](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight)
- [naturalWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth)
- [referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy)
- [sizes](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes)
- [src](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/src)
- [srcset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)
- [width](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/width)
- [onload](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)
- [onerror](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event)

### Methods
- [decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)
