import React from 'react';
import { type } from 'os';

interface State {
    windowElem?: React.ReactNode;
}

export default class PixelBoard extends React.Component<{}, State>{
    constructor(props: any){
        super(props);

        this.state = {};
    }

    componentDidMount(){
        this.setState({
            windowElem: (<div>
                {window.screen.width}, {window.screen.height}    
            </div>)
        });
    }

    render(){
        return (<div>
            <h3>This is the pixel board! {this.state.windowElem}</h3>
        </div>)
    }
}