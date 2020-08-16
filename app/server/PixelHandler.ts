import DatabaseHandler from "./DatabaseHandler";
import Pixel from "../shared/Pixel";
import { isBoolean } from "util";

export default class PixelHandler{
    private dbHandler: DatabaseHandler;
    private gridSize: number;

    constructor(dbHandler: DatabaseHandler, gridSize: number){
        this.dbHandler = dbHandler;
        this.gridSize = gridSize;
    }

    public async createInitialPixelData(){        
        const pixelCount = await this.dbHandler.countInCollection('pixels');
        console.log(`Current amount of pixels: ${pixelCount}`);
        if(pixelCount !== this.gridSize * this.gridSize){
            console.log('Building Initial Pixel data!')
            console.log('Purging pixels data! -- does not match grid setting');
            await this.dbHandler.purge('pixels');
            let batch = [];
            for(let x = 0; x < this.gridSize; x++){
                for(let y = 0; y < this.gridSize; y++){
                    const pixel = new Pixel(x, y, null, [255, 255, 255]);
                    batch.push(pixel.getJSON());
                    if(batch.length === 1000){
                        await this.dbHandler.createMany('pixels', batch);
                        batch = [];
                    }
                }
            }
            if(batch.length > 0){
                await this.dbHandler.createMany('pixels', batch);
            }
            console.log("Built all pixel data!");
        }else{
            console.log("Pixel data correct, no need to build data!");
        }        
    }

    public async createCombinedPixelJson(){
        const pixels = await this.dbHandler.all('pixels');
        if(isBoolean(pixels)){
            console.error("Combined pixels js file could not be generated!!");
            return null;
        }
        return {pixels, str:`window.pixels = ${JSON.stringify(pixels)}`};
    }
}