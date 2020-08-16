import React from 'react';
import { hydrate } from 'react-dom';
import PixelBoard from './components/PixelBoard';

hydrate(
    React.createElement(PixelBoard),
    document.getElementById('root')
)