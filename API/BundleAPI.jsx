export default class BundleAPI {
    _bundle = [];
    _useBundle = false;

    startBundle() {
        this._useBundle = true;
    };

    async executeBundle() {
        await this._webView.current.injectJavaScript(`
            {
                ${this._bundle.join("")}
            }
        `);

        this.stopBundle();
        this.clearBundle();
    };

    async clearBundle() {
        this._bundle = [];
    };

    async stopBundle() {
        this._useBundle = false;
    };

    async _addToBundleOrInject(message) {
        if(this._useBundle)
            this._bundle.push(message);
        else
            await this._webView.current.injectJavaScript(message);
    };
};
