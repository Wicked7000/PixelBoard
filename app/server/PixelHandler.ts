import DatabaseHandler from "./DatabaseHandler";
import Pixel from "../shared/Pixel";
import { isBoolean } from "util";
import fs from 'fs';
import { PNG } from 'pngjs';
import { GRID_SIZE } from "../shared/settings";

export default class PixelHandler{
    private dbHandler: DatabaseHandler;
    private gridSize: number;

    constructor(dbHandler: DatabaseHandler, gridSize: number){
        this.dbHandler = dbHandler;
        this.gridSize = gridSize;
    }

    public async updateBasedOnImage(filePath: string){
        const databaseHandler = this.dbHandler;
        await new Promise((resolve) => {
            fs.createReadStream(filePath).pipe(new PNG({
                filterType: 4,
            })).on('parsed', async function () {
                let replaceOperations = [];
    
                const sampleEveryY = Math.ceil(this.height / GRID_SIZE);
                const sampleEveryX = Math.ceil(this.width / GRID_SIZE);
    
                console.log(sampleEveryX, sampleEveryY);
                
                for(let x = 0; x < GRID_SIZE; x++){
                    for(let y = 0; y < GRID_SIZE; y++){
                        const filterObj: Record<string, any> = {x: x, y: y};
                        const dataIdx = (this.width * y + x) << 2;
                        const colourData: any = [this.data[dataIdx], this.data[dataIdx+1], this.data[dataIdx+2]];

                        console.log(x, y, colourData);
                        replaceOperations.push({
                            replaceOne: {
                                filter: filterObj,
                                replacement: new Pixel(x, y, 'system', colourData).getJSON(),
                            }
                        });
                    }
                }
                console.log("Finished generating commands!");
                const response = await databaseHandler.bulkReplace('pixels', replaceOperations);
                if(!isBoolean(response)){
                    console.log(`${response} pixels updated via image!`)
                }
                console.log("Finished updating via image!");
                resolve();
            }).on('error', function(error){
                console.error(error);
                resolve();
            });
        });        
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
                    const pixel = new Pixel(x, y, null, [0, 0, 0]);
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