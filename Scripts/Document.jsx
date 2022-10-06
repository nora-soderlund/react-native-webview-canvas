export default class Document {
    static async createCanvas(webView, variable) {
        return webView.injectJavaScript(`
            const ${variable} = document.createElement("canvas");



            document.body.append(${variable});
        `);
    };
};
