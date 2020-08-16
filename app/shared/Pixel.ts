export interface PixelJSON {
    x: number,
    y: number,
    owner: null | string,
    colour: [number, number, number],
}

export default class Pixel{
    private x: number;
    private y: number;
    private owner: null | string;
    private colour: [number, number, number];

    constructor(x: number, y: number, owner: null | string, colour: [number, number, number]){
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.colour = colour;
    }

    public getY(){
        return this.y;
    }

    public getX(){
        return this.x;
    }

    public getColour(){
        return this.colour;
    }

    public getJSON(){
        return {
            x: this.x,
            y: this.y,
            owner: this.owner,
            colour: this.colour,
        };
    }
}