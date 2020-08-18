import { PixelJSON } from "../../shared/Pixel";
import * as React from "react";
import { GRID_SIZE } from "../../shared/settings";
import { select, selectAll, rgb } from 'd3';

interface Props {
    pixels: PixelJSON[];
}

type PixelJSOND3 = {
    size: number
} & PixelJSON;

export default class PixelBoardAdvanced extends React.Component<Props, {}>{
    private node: SVGElement | null = null;
    
    constructor(props: any){
        super(props);

        this.createPixelGrid = this.createPixelGrid.bind(this);
        this.alterSVG = this.alterSVG.bind(this);
        this.updatePixelData = this.updatePixelData.bind(this);

        window.onresize = () => {
            const sizePerPixel = this.alterSVG();
            if(sizePerPixel){
                this.updatePixelData(sizePerPixel);
            }
        }
    }

    openGithubInNewTab(x: number, y: number){
        const titleText = `pixel|0,0,0|${x}|${y}`;
        const bodyText = "If you'd like to modify the colour of the pixel please change the three values after 'pixel|' these values corispond to RGB values (in that order), otherwise submit!";
        window.open(`https://github.com/Wicked7000/PixelBoard/issues/new?title=${encodeURIComponent(titleText)}&body=${encodeURIComponent(bodyText)}`, "_blank");
    }
    
    updatePixelData(sizePerPixel: number){
        const pixelData: PixelJSOND3[] = this.props.pixels.slice(0).map(
            (item) => {
                (item as any).size = sizePerPixel;
                return item as PixelJSOND3;
            }
        );
        select(this.node)
            .selectAll("rect")
            .data(pixelData)
            .attr('x', d => d.x * d.size)
            .attr('y', d => d.y * d.size)
            .attr('width', d => d.size)
            .attr('height', d => d.size);
    }

    createPixelGrid(sizeOfPixel: number){
        const pixelData: PixelJSOND3[] = this.props.pixels.slice(0).map(
            (item) => {
                (item as any).size = sizeOfPixel;
                return item as PixelJSOND3;
            }
        );
        const rects = select(this.node)
            .selectAll("rect")
            .data(pixelData)
            .enter()
            .append('rect');

        rects.attr('x', d => d.x * d.size)
             .attr('y', d => d.y * d.size)
             .attr('width', d => d.size)
             .attr('height', d => d.size)
             .style('stroke', d => `rgb(${d.colour.join(",")})`)
             .style('fill', d => `rgb(${d.colour.join(",")})`)
             .on("mouseover", function(d){
                const darkerColour = rgb(d.colour[0], d.colour[1], d.colour[2]).darker(0.7);
                select(this)
                    .style("fill", darkerColour.toString())
                    .style("cursor", "pointer");                
             })
             .on("mouseout", function(d){
                select(this)
                    .style("fill", `rgb(${d.colour.join(",")})`)
                    .style("cursor", "unset");
             })
             .on("click", (d) => {
                this.openGithubInNewTab(d.x, d.y);
             });
    }

    alterSVG(){
        if(this.node){
            let canvasSize = 0;
            if(window.innerHeight > window.innerWidth){
                canvasSize = window.innerWidth;
                this.node.setAttribute("width", `${window.innerWidth}`);
                this.node.setAttribute("height", `${window.innerWidth}`);
            }else{
                canvasSize = window.innerHeight;
                this.node.setAttribute("width", `${window.innerHeight}`);
                this.node.setAttribute("height", `${window.innerHeight}`);
            }
            return canvasSize / GRID_SIZE;
        }
    }

    componentDidMount(){
        const sizePerPixel = this.alterSVG();
        if(sizePerPixel){
            this.createPixelGrid(sizePerPixel);
        }
    }

    render(){
        return(
            <svg ref={node => this.node = node} width={500} height={500}></svg>
        )
    }
}