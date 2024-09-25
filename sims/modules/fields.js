import { cartesian_dist, gaussian } from "./geometry.js";
import { gradient } from "./colorscales.js"

export class ScalarField{
    constructor(p, props){
        this._props = props;
        this._layer = p.createImage(this._props.width, this._props.height); // Add two pixels to make a boundary
    }

    add_gaussian_source(x,y, threshold, std){

        let xmin = x-threshold;
        let xmax = x+threshold;
        let ymin = y-threshold;
        let ymax = y+threshold;

        this._layer.loadPixels();
        for(let xt = xmin; xt < xmax; xt += 1){
            for(let yt = ymin; yt < ymax; yt += 1 ){
                let dist = cartesian_dist(x,y,xt,yt);
                if(dist<threshold){
                    let pixidx = 4*(yt*this._props.width + xt);
                    let val = gaussian(dist,std);
                    let [r,g,b,a] = gradient(0,1,"#ffffff","#000000",val);

                    // Red.
                    this._layer.pixels[pixidx] = r
                    // Green.
                    this._layer.pixels[pixidx+1] = g;
                    // Blue.
                    this._layer.pixels[pixidx+2] = b;
                    // Alpha.
                    this._layer.pixels[pixidx+3] = a;
                }
            }
        }
        // for (let i = start; i < start+200; i += 4) {
        //     // Red.
        //     this._layer.pixels[i] = 255;
        //     // Green.
        //     this._layer.pixels[i+1] = 0;
        //     // Blue.
        //     this._layer.pixels[i+2] = 0;
        //     // Alpha.
        //     this._layer.pixels[i+3] = 255;
        // }
        this._layer.updatePixels();
    }

    draw(p){
        p.image(this._layer,this._props.x,this._props.y);
    }



}