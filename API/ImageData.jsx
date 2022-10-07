export default class ImageData {
    constructor(message) {
        const data = JSON.parse(message);

        this.data = JSON.parse(data.data);
        
        this.width = parseInt(data.width);
        this.height = parseInt(data.height);

        this.colorSpace = data.colorSpace;
    };
};
