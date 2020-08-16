import { promises as fs, constants } from 'fs';
import reactDomServer from 'react-dom/server';
import PixelBoard from '../client/components/PixelBoard';
import React from 'react';
import Pixel, { PixelJSON } from '../shared/Pixel';

export default class ServerSideRenderer{
    private pixelData: {pixels: PixelJSON[], str: string};

    constructor(pixelData: any){
        this.pixelData = pixelData;
    }

    getContentsOfIndexFile = async () => {
        const fileBuffer = await fs.readFile('./app/index.html', {});
        return fileBuffer.toString("utf-8");
    }

    writeIndexFile = async (indexPage: string) => {
        await fs.writeFile('./target/index.html', indexPage, {}).then(() => {
            console.log("Index file correctly written!");
        }).catch((error) => {
            console.error("Failed to write html file!");
            console.error(error.message);
        });
    };

    writeCombinedPixelsFile = async (combinedPixelsFile: any) => {
        await fs.writeFile('./target/pixels.js', combinedPixelsFile, {}).then(() => {
            console.log("Combined js pixels file correctly written!");
        }).catch((error) => {
            console.error("Failed to write combined js pixels file!");
            console.error(error.message);
        });
    }

    async run(){
        const serverRenderedData: string = reactDomServer.renderToString(React.createElement(PixelBoard, {pixels: this.pixelData.pixels}));
        const indexFileStr = await this.getContentsOfIndexFile();
        const updatedData = indexFileStr.replace(`<div id="root"></div>`, `<div id="root">${serverRenderedData}</div>`);
        await this.writeCombinedPixelsFile(this.pixelData.str);
        await this.writeIndexFile(updatedData);
    }
}