import { promises as fs, constants } from 'fs';
import ServerSideRenderer from './ServerSideRenderer';
import PixelHandler from './PixelHandler';
import DatabaseHandler from './DatabaseHandler';
import { exit } from 'process';
import { GRID_SIZE } from '../shared/settings';

const start = async () => {
    const dbHandler = new DatabaseHandler('pixels');
    const pixelHandler = new PixelHandler(dbHandler, GRID_SIZE);

    if(process.argv.length > 2){
        const userCommand = process.argv[2];
        const githubUsername = process.argv[3];
        const regex = /^pixel|\d+,\d+,\d+|\d+|\d+$/g;
        if(regex.test(userCommand)){
            pixelHandler.updatePixelFromUserCommand(userCommand, githubUsername);
        }
    }

    await pixelHandler.createInitialPixelData();
    const pixelData = await pixelHandler.createCombinedPixelJson();

    const SSR = new ServerSideRenderer(pixelData);
    await SSR.run();
    exit();
};

start();
