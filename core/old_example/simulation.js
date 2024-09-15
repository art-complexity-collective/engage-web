import { Heatmap } from "./modules/heatmap.js";
import { Barplot } from "./modules/barplot.js";
import { Network } from "./modules/network.js";

let n_host_types = 30;
let n_para_types = 30;

const canvas_props = {width: 800, height: 600};
const hmap_props = {x: 150, 
    y: 150, 
    width: 300, 
    height:300, 
    nx: n_host_types, 
    ny: n_para_types,
    cscale: chroma.scale()};

const hplot_props = {
    x:150,
    y: 30,
    width: 300,
    height: 100,
    domain: Array(n_host_types).keys(),
    range: [0, 1.0],
    angle: 0,
    color: 'rgb(184, 81, 95)'
}

const pplot_props = {
    x:30,
    y: 450,
    width: 300,
    height: 100,
    domain: Array(n_para_types).keys(),
    range: [0, 1.0],
    angle: 90,
    color: 'rgb(164, 218, 215)'
}

const network_props = {
    x: 500,
    y: 50,
    width: 200,
    height: 500,
    layout: {type: "bipartite", n_left: n_host_types, n_right: n_para_types}
}

function normalized(pop_vec,nx,ny){
    // TODO: WRITE CORRECT MARGINAL DENSITY FUNCTION!
    let xvec = pop_vec.slice(0,0+nx);
    let yvec = pop_vec.slice(0,0+ny);
    return [xvec, yvec];
}

const sketch = (p) => {
    
    let hmap, hplot, pplot, intnet;
    let pop = new Array(n_host_types*n_para_types);


    p.setup = () => {
        let canvas = p.createCanvas(canvas_props.width, canvas_props.height);
        hmap = new Heatmap(p, hmap_props);
        
        hplot = new Barplot(p, hplot_props);
        pplot = new Barplot(p, pplot_props);

        intnet = new Network(p, network_props);

        p.pixelDensity(2);

    }
    
    p.draw = () => {
        p.background(255);

        // Draw outline
        p.push();
        p.fill(0,0,0,0);
        p.stroke(1);
        p.strokeWeight(2);
        p.rect(0,0,canvas_props.width,canvas_props.height);
        p.pop();
        
        // Update the population based on simulation
        pop =  pop.fill(0).map(() => Math.random()/2);
        // Calculate normalized/marginal population sizes
        let [host_gpops, para_gpops] = normalized(pop, n_host_types, n_para_types);

        // Update heatmap and redraw
        hmap.update_data(pop);
        hmap.draw(p);

        // Update host and parasite barplots and redraw
        hplot.update_data(host_gpops);
        pplot.update_data(para_gpops);
        hplot.draw(p);
        pplot.draw(p);

        // Draw interaction network
        intnet.draw(p);

        // Draw the framerate
        p.text(p.frameRate(),0,10);
    }
};

let simulation = new p5(sketch, 'simulation');