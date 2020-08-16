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

    public async updatePixelFromUserCommand(userCommand: string, username: string){
        const regex = /^pixel|(\d+,\d+,\d+)|(\d+)|(\d+)$/g;
        const matchObj = userCommand.match(regex)
        if(matchObj?.length === 4){
            const [_, colours, x, y] = matchObj;
            const xInt = parseInt(x, 10);
            const yInt = parseInt(y, 10);
            const coloursArray = colours.split(',').map(item => parseInt(item, 10)) as any;
            const filterObj: Record<string, any>[] = { 'x': xInt, 'y': yInt } as any;
            const res = await this.dbHandler.replace('pixels', filterObj, new Pixel(xInt, yInt, username, coloursArray).getJSON() as any);
            if(res){
                console.log("Successfully updated user pixel!");
            }else{
                console.log("Failed to update user pixel!");
            }
        }
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