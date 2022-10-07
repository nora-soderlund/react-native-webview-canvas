export default class ImageData {
    constructor(message) {
        const data = JSON.parse(message);
        
        this.width = parseInt(data.width);
        this.height = parseInt(data.height);

        this.data = new Uint8ClampedArray(JSON.parse(data.data));

        this.colorSpace = data.colorSpace;
    };

    toObject() {
        return {
            width: this.width,
            height: this.height,
            colorSpace: this.colorSpace,
            data: Array.from(this.data)
        };
    };
};
