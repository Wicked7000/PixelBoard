import reactDomServer from 'react-dom/server';
import React from 'react';
import { promises as fs, constants } from 'fs';
import PixelBoard from './components/PixelBoard';

const writeIndexFile = (indexPage: string) => {
    fs.writeFile('./target/index.html', indexPage, {}).then(() => {
        console.log("Index file correctly written!");
    }).catch((error) => {
        console.error("Failed to write html file!");
        console.error(error.message);
    });
};

const getContentsOfIndexFile = async () => {
    const fileBuffer = await fs.readFile('./app/index.html', {});
    return fileBuffer.toString("utf-8");
}

const start = async () => {
    const serverRenderedData: string = reactDomServer.renderToString(React.createElement(PixelBoard));
    const indexFileStr = await getContentsOfIndexFile();
    const updatedData = indexFileStr.replace(`<div id="root"></div>`, `<div id="root">${serverRenderedData}</div>`);

    console.log(updatedData);

    fs.access('./target', constants.W_OK | constants.R_OK).then(() => {       
        writeIndexFile(updatedData);                
    }).catch(() => {
        fs.mkdir('./target').then(() => {
            writeIndexFile(updatedData);
        }).catch((error) => {
            console.error("Could not create out directory!");
            console.error(`Msg: ${error.message}`);
        });
    })
};

start();
