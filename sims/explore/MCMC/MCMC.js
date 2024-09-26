import { AgentArena, Agent } from "../../modules/agents.js"
import { Network } from "../../modules/network.js"
import { Slider } from "../../modules/ui.js"

const canvas_props = {width: 900, height: 700};

const arena_props = {
    x: 50,
    y: 5,
    width: 600,
    height: 400};

const max_num_frogs = 100;

const num_frogs_slider_props = {
    x: 300,
    y: 420,
    height: 60,
    width:200,
    log: false,
    min: 1,
    max: max_num_frogs,
    def: 1,
    step: 1,
    label: "# of Frogs"
};

const particle_props = {
    x: arena_props.width/2,
    y: arena_props.height/2,
    height: 10,
    width: 20,
    angle: 45,
    radius: 5,
    shape: 'pointed circ',
    color: "#000000"
};  

// Animation constants
const pad_values = {
    num_pads: 3,
    x_vals: [100, 300, 500],
    y_vals: [300, 100, 300],
    radius: 100,
    num_flies: [20, 30, 50]
}

const animation_values = {
    frames_per_hop: 30 // Number of frames that the hop animation should take
}

// TODO: develop the network library and have the frog animations tied to a network object
const network_props = {
    x: 500,
    y: 50,
    width: 200,
    height: 500,
    layout: {type: "bipartite", n_left: 30, n_right: 20}
};  

class Frog{
    constructor(current_pad_num=1,alive=true){
        this.current_pad_num = current_pad_num; // The pad number that the frog is currently on
        this.x = pad_values.x_vals[this.current_pad_num];
        this.y = pad_values.y_vals[this.current_pad_num];
        this.proposed_pad_num = current_pad_num; // The pad number that the frog is currently on
        this.hopping = false; // Whether the frog is currently hopping
        this.animation_frame = 0; // Where in the hop animation the frog is
        this.accepted_hop = true; // Whether the frog has accepted the hop
        this.update(); // Update the position 
        this.alive = alive; // Whether the frog is alive (rendered and acting)
        // Randomly give the frog a shift within the radius of the lilypad so that they don't overlap
        let angle = Math.random()*2*Math.PI;
        let radius = Math.random()*pad_values.radius/3;
        this.x_shift = radius*Math.cos(angle); // Cosntant shift of the x position of the frog
        this.y_shift = radius*Math.sin(angle); // Cosntant shift of the y position of the frog
        // Randomly color the frog (use max saturation and brightness)
        this.color = [Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256)];
    }

    // Update the animation of the frog
    update(){
        if(this.hopping){
            let x_diff = pad_values.x_vals[this.proposed_pad_num] - pad_values.x_vals[this.current_pad_num];
            let y_diff = pad_values.y_vals[this.proposed_pad_num] - pad_values.y_vals[this.current_pad_num];
            let equiv_animation_frame = 0;
            if(this.accepted_hop){
                equiv_animation_frame = this.animation_frame;
            }else{ // Animate a rejected hop as half the time going a third of the way and then come back
                if(this.animation_frame <= animation_values.frames_per_hop/2){
                    equiv_animation_frame = this.animation_frame*2/3;
                }else{
                    equiv_animation_frame = 2*animation_values.frames_per_hop/3 - this.animation_frame*2/3;
                }
            }
            this.animation_frame;
            this.x = pad_values.x_vals[this.current_pad_num] + (x_diff/animation_values.frames_per_hop)*equiv_animation_frame + this.x_shift;
            this.y = pad_values.y_vals[this.current_pad_num] + (y_diff/animation_values.frames_per_hop)*equiv_animation_frame + this.y_shift;
            this.animation_frame++;
            if(this.animation_frame >= animation_values.frames_per_hop){ // End the hop animation, implement the hop
                this.animation_frame = 0;
                this.hopping = false;
                if(this.accepted_hop){
                    this.current_pad_num = this.proposed_pad_num;
                }
            }
        }
    }

    // Start an animation of the frog 
    propose_hop(proposed_pad_num, accept_hop=true){
        this.accepted_hop = accept_hop;
        this.proposed_pad_num = proposed_pad_num;
        this.hopping = true;
    }
}

let arena, num_frogs_slider, agentids, frogs, network;

const simulation_sketch = (p) => {

    p.setup = () => {
        let canvas = p.createCanvas(canvas_props.width, canvas_props.height);

        arena = new AgentArena(p, arena_props);

        
        
        agentids = [];
        frogs = [];
        for(let i=0; i<max_num_frogs; i++){
            if(i==0){ // Initialize the first frog as alive
                frogs.push(new Frog(1,true));
            }else{ // Initialize the rest as dead
                frogs.push(new Frog(1,false));
            }
            // agentids.push(arena.add_agent(particle_props)); // Agents to be rendered, tied to the frog information
        }

        network = new Network(p, network_props);

        
        p.pixelDensity(3);
    }
    
    p.draw = () => {
        // Draw the background
        p.background(255);
        
        // Draw the lily pads, labeled by the number of flies in large text (centered)
        for(let i=0; i<pad_values.num_pads; i++){
            p.fill(0,255,0);
            p.ellipse(pad_values.x_vals[i], pad_values.y_vals[i], pad_values.radius, pad_values.radius);
            p.fill(0);
            p.textSize(20);
            p.text(pad_values.num_flies[i], pad_values.x_vals[i], pad_values.y_vals[i]);
        }

        // Given the slider value, set those frogs to be alive
        for(let i=0; i<num_frogs_slider.get_value(); i++){
            frogs[i].alive = true;
        }
        for(let i=num_frogs_slider.get_value(); i<max_num_frogs; i++){
            frogs[i].alive = false;
        }

        // Simulation logic
        for(let i=0; i<frogs.length; i++){
            if(frogs[i].alive){
                // console.log(i+" "+frogs[i].current_pad_num);
                if(Math.random()>0.99 && !frogs[i].hopping){
                    // Randomly propose a hop
                    let proposed_pad_num = Math.floor(Math.random()*pad_values.num_pads); 
                    if(proposed_pad_num != frogs[i].current_pad_num){
                        let accepted_hop_probability = Math.min(1,pad_values.num_flies[proposed_pad_num]/pad_values.num_flies[frogs[i].current_pad_num]);
                        frogs[i].propose_hop(proposed_pad_num, Math.random()<accepted_hop_probability); // Accept reject
                    }
                }
                frogs[i].update();
                // Drawing
                p.fill(frogs[i].color[0],frogs[i].color[1],frogs[i].color[2]);
                p.ellipse(frogs[i].x, frogs[i].y, 10, 10);
                // TODO: do this with the agents
                // arena.get_agent(agentids[i]).set_x(frogs[i].x);
                // arena.get_agent(agentids[i]).set_y(frogs[i].y);
                // console.log(frogs[i].x+" "+frogs[i].y);
                // console.log(arena.get_agent(agentids[i])._props.x+" "+arena.get_agent(agentids[i])._props.y);
                // arena.get_agent(agentid).set_angle(bacteria.angle); // TODO: add angles to the frogs

            }
        }


        
        arena.draw(p);
        num_frogs_slider.draw(p);
        // network.draw(p);

        // Draw the framerate
        p.fill(0);
        // Render frame rate as an integer
        p.text("FPS: "+Math.floor(p.frameRate()),0,10);

    }
};

const controls_sketch = (p) => {

    p.setup = () => {
        num_frogs_slider = new Slider(p, num_frogs_slider_props);
    }
}

let simulation = new p5(simulation_sketch, 'simulation');
let controls = new p5(controls_sketch, 'controls');
