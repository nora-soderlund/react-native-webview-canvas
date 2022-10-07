export default class ImageData {
    static fromMessage(message) {
        const data = JSON.parse(message);

        return new ImageData(new Uint8ClampedArray(JSON.parse(data.data)), parseInt(data.width), parseInt(data.height), { colorSpace: data.colorSpace });
    };

    constructor(dataArray, width, height, settings) {
        if(typeof dataArray == "number") {
            settings = height;
            
            height = width;
            width = dataArray;

            dataArray = undefined;
        }
        
        this.width = width;
        this.height = height;

        this.data = dataArray;

        this.colorSpace = settings?.colorSpace;
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
