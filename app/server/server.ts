import ServerSideRenderer from './ServerSideRenderer';
import PixelHandler from './PixelHandler';
import DatabaseHandler from './DatabaseHandler';
import { exit } from 'process';
import { GRID_SIZE } from '../shared/settings';
import GithubHandler from './GithubHandler';

const runUserCommandIfPresent = async (pixelHandler: PixelHandler) => {
    if(process.env.GITHUB_USER && 
        process.env.ISSUE_TITLE && 
        process.env.ISSUE_ID && 
        process.env.REPOSITORY_ID &&
        process.env.ACCESS_TOKEN){
        const githubHandler = new GithubHandler(process.env.ACCESS_TOKEN, process.env.REPOSITORY_ID);
        await githubHandler.closeIssue(parseInt(process.env.ISSUE_ID, 10));

        const userCommand = process.env.ISSUE_TITLE;
        const githubUsername = process.env.GITHUB_USER;
        const regex = /^pixel|\d+,\d+,\d+|\d+|\d+$/g;
        if(regex.test(userCommand)){
            await pixelHandler.updatePixelFromUserCommand(userCommand, githubUsername);
        }
    }
}

const updatePixelsBasedOnImageIfPresent = async (pixelHandler: PixelHandler) => {
    if(process.env.IMAGE_PATH){
        console.log("Attempting to update based on image!");
        await pixelHandler.updateBasedOnImage(process.env.IMAGE_PATH);
    }
}

const start = async () => {
    
    const dbHandler = new DatabaseHandler('pixels');
    const pixelHandler = new PixelHandler(dbHandler, GRID_SIZE);
    
    await pixelHandler.createInitialPixelData();
    await runUserCommandIfPresent(pixelHandler);
    await updatePixelsBasedOnImageIfPresent(pixelHandler);
    const pixelData = await pixelHandler.createCombinedPixelJson();

    const SSR = new ServerSideRenderer(pixelData);
    await SSR.run();
    exit();
};

start();
