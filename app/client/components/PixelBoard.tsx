import React from 'react';
import Pixel, { PixelJSON } from '../../shared/Pixel';
import { GRID_SIZE } from '../../shared/settings';

interface Props {
    pixels: PixelJSON[];
}

export default class PixelBoard extends React.Component<Props, {}>{
    constructor(props: Props){
        super(props);

        this.state = {};

        this.generateCells = this.generateCells.bind(this);
    }

    generateCells(){
        const {pixels} = this.props;
        const elements = [];
        const bodyText = "If you'd like to modify the colour of the pixel please change the three values after 'pixel|', otherwise submit!";
        
        for(const pixel of pixels){
            const colour = pixel.colour;            
            const titleText = `pixel|0,0,0|${pixel.x}|${pixel.y}`;
            elements.push(
                <a href={`https://github.com/Wicked7000/PixelBoard/issues/new?title=${encodeURIComponent(titleText)}&body=${encodeURIComponent(bodyText)}`}>
                    <div className="pixel" key={`${pixel.x}::${pixel.y}`} style={{
                        position: "absolute",
                        backgroundColor: `rgb(${colour[0]},${colour[1]},${colour[2]})`,
                        left: `${pixel.x === 0 ? 0 : (pixel.x/GRID_SIZE)*100}%`,
                        top: `${pixel.y === 0 ? 0 : (pixel.y/GRID_SIZE)*100}%`,
                        width: `${100/GRID_SIZE}%`,
                        height: `${100/GRID_SIZE}%`
                    }}>
                    </div>
                </a>
            )
        }
        return elements;
    }

    render(){
        return this.generateCells();
    }
}