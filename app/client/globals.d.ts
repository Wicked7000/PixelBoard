import Pixel, { PixelJSON } from "../shared/Pixel";

declare global {
    interface Window { pixels: PixelJSON[] }
}

window.pixels = window.pixels || {};