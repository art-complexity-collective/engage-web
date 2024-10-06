import { ScalarField } from "../../modules/fields.js"
import { Slider, Button } from "../../modules/ui.js"
import { Agent, AgentArena } from "../../modules/agents.js"

const canvas_props = {width: 900, height: 700};

const arena_props = {
    x: 50,
    y: 5,
    width: 800,
    height: 600};


// const add_bac_button_props = {
//     x: 300,
//     y: 620,
//     height: 60,
//     width: 100,
//     label: "Add Naive Bacteria"
// }

const trate_slider_props = {
    x: 300,
    y: 620,
    height: 60,
    width:200,
    log: false,
    min: 0.00,
    max: 1.0,
    def: 0.05,
    step: 0.05,
    label: "Tumble Rate"
};

const particle_props = {
    x: arena_props.width/2,
    y: arena_props.height/2,
    height: 10,
    width: 20,
    angle: 45,
    radius: 5,
    color: "#b8515f"
};  

class SimpleBac{
    constructor(x=100,y=100,angle=0,v=1){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.v = v;
    }
    
    move(arena_dims){
        this.x += this.v*Math.cos(this.angle*(Math.PI/180.0));
        this.y += this.v*Math.sin(this.angle*(Math.PI/180.0));

        if(this.x < arena_dims.x){
            this.x = arena_dims.width+this.x;
        } else if (this.x > arena_dims.x+arena_dims.width) {
            this.x = this.x-arena_dims.width;
        }

        if(this.y < arena_dims.y){
            this.y = arena_dims.height+this.y;
        } else if (this.y > arena_dims.y+arena_dims.height) {
            this.y = this.y - arena_dims.height;
        }
    }

    turn_random(){
        this.angle = Math.random() * 360;
    }

    set_velocity(value){
        this.v = value;
    }

}

const sketch = (p) => {
    
    let food_field, arena, trate_slider, agentid_naive, bacteria_naive;

    function draw_source_at_mouse(){
        food_field.add_gaussian_source(p.mouseX-arena_props.x, p.mouseY-arena_props.y, 100, 30, 5.0);
    }

    p.setup = () => {
        let canvas = p.createCanvas(canvas_props.width, canvas_props.height);

        food_field = new ScalarField(p, arena_props);

        canvas.mouseClicked(draw_source_at_mouse);

        arena = new AgentArena(p, arena_props);
        trate_slider = new Slider(p, trate_slider_props);

        agentid_naive = arena.add_agent(particle_props);
        bacteria_naive = new SimpleBac(300, 300, 45, 3);

        // agentid_smart = arena.add_agent(particle_props);
        // arena.get_agent(agentid_smart).set_color("#a4dad7");
        // bacteria_smart = new SimpleBac(400, 300, 45, 1);

        p.pixelDensity(3);
    }
    
    p.draw = () => {
        p.background(255);

        //let trate_smart = Math.exp(-10.0*food_field.get_value(Math.floor(bacteria_smart.x),Math.floor(bacteria_smart.y)));

        // Simulation logic
        if(Math.random()>1.0-trate_slider.get_value()){
            bacteria_naive.turn_random();
        }
        bacteria_naive.move(arena_props);

        // if(Math.random()>1-trate_smart){//1.0-trate_slider.get_value()){
        //     bacteria_smart.turn_random();
        // }
        // bacteria_smart.move(arena_props);

        // Drawing
        food_field.draw(p);

        arena.get_agent(agentid_naive).set_xy(bacteria_naive.x, bacteria_naive.y);
        arena.get_agent(agentid_naive).set_angle(bacteria_naive.angle);

        // arena.get_agent(agentid_smart).set_xy(bacteria_smart.x, bacteria_smart.y);
        // arena.get_agent(agentid_smart).set_angle(bacteria_smart.angle);

        arena.draw(p);
        
        // addbac_button.draw(p);
        trate_slider.draw(p);

        // Draw the framerate
        p.text(p.frameRate(),0,10);
    }
};

let simulation = new p5(sketch, 'simulation');
