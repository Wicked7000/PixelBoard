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
        const rows: any = {};        
        const bodyText = "If you'd like to modify the colour of the pixel please change the three values after 'pixel|', otherwise submit!";
        
        for(const pixel of pixels){
            const colour = pixel.colour;
            const titleText = `pixel|0,0,0|${pixel.x}|${pixel.y}`;
            const elem = <td key={`${pixel.x}::${pixel.y}`} style={{ backgroundColor: `rgb(${colour[0]},${colour[1]},${colour[2]})` }}>
                <a style={{ display: 'block', width: '100%', height: '100%' }} target="_blank" rel="noopener noreferrer" href={`https://github.com/Wicked7000/PixelBoard/issues/new?title=${encodeURIComponent(titleText)}&body=${encodeURIComponent(bodyText)}`}/>
            </td>

            if(rows[pixel.y]){
                rows[pixel.y].push(elem)
            }else{
                rows[pixel.y] = [elem];
            }            
        }

        const rowElems = [];
        for(let y = 0; y < GRID_SIZE; y++){
            const cells = rows[y]
            rowElems.push(<tr key={`tr-${y}`}>{cells}</tr>);
        }
        return <table cellSpacing={0} cellPadding={0} style={{ width: '100%', height: '100%' }}>{rowElems}</table>;
    }

    render(){
        return this.generateCells();
    }
}