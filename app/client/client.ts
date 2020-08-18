import React from 'react';
import { render } from 'react-dom';
import PixelBoardAdvanced from './components/PixelBoardAdvanced';

const newElem = document.createElement('div')
newElem.id = 'rootAdvanced';
newElem.setAttribute("style", "display:flex;align-items:center;justify-content:center;");
document.body.appendChild(newElem);


const oldElem = document.getElementById('root');
if(oldElem){
    document.body.removeChild(oldElem);
}

render(
    React.createElement(PixelBoardAdvanced, {pixels: window.pixels}),
    document.getElementById('rootAdvanced')
)
