import React from 'react';
import { PixelJSON } from '../../shared/Pixel';
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
        const bodyText = "If you'd like to modify the colour of the pixel please change the three values after 'pixel|' these values corispond to RGB values (in that order), otherwise submit!";
        
        const cellWidth = 100/GRID_SIZE;

        for(const pixel of pixels){
            const colour = pixel.colour;
            const titleText = `pixel|0,0,0|${pixel.x}|${pixel.y}`;
            const elem = <td className={`pixel`} key={`${pixel.x}::${pixel.y}`} style={{ width: `${cellWidth}%`, backgroundColor: `rgb(${colour[0]},${colour[1]},${colour[2]})` }}>
                <a 
                    style={{ position: 'absolute', display: 'block', width: '100%', height: '100%' }} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    href={`https://github.com/Wicked7000/PixelBoard/issues/new?title=${encodeURIComponent(titleText)}&body=${encodeURIComponent(bodyText)}`}
                />
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
        return <table id="pixelboard" cellSpacing={0} cellPadding={0}><tbody>{rowElems}</tbody></table>;
    }

    render(){
        return this.generateCells();
    }
}