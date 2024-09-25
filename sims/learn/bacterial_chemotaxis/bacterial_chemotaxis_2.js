import { ScalarField } from "../../modules/fields.js"
import { Slider } from "../../modules/ui.js"

const canvas_props = {width: 900, height: 700};

const arena_props = {
    x: 50,
    y: 5,
    width: 800,
    height: 600};

// const trate_slider_props = {
//     x: 300,
//     y: 620,
//     height: 60,
//     width:200,
//     log: false,
//     min: 0.00,
//     max: 1.0,
//     def: 0.05,
//     step: 0.05,
//     label: "Tumble Rate"
// };

// const particle_props = {
//     x: arena_props.width/2,
//     y: arena_props.height/2,
//     height: 10,
//     width: 20,
//     angle: 45,
//     radius: 5,
//     shape: 'pointed circ',
//     color: "#000000"
// };  


// class SimpleBac{
//     constructor(x=100,y=100,angle=0,v=1){
//         this.x = x;
//         this.y = y;
//         this.angle = angle;
//         this.v = v;
//     }
    
//     move(arena_dims){
//         this.x += this.v*Math.cos(this.angle*(Math.PI/180.0));
//         this.y += this.v*Math.sin(this.angle*(Math.PI/180.0));

//         if(this.x < arena_dims.x){
//             this.x = arena_dims.width+this.x;
//         } else if (this.x > arena_dims.x+arena_dims.width) {
//             this.x = this.x-arena_dims.width;
//         }

//         if(this.y < arena_dims.y){
//             this.y = arena_dims.height+this.y;
//         } else if (this.y > arena_dims.y+arena_dims.height) {
//             this.y = this.y - arena_dims.height;
//         }
//     }

//     turn_random(){
//         this.angle = Math.random() * 360;
//     }

//     set_velocity(value){
//         this.v = value;
//     }

// }

const sketch = (p) => {
    
    let food_field; //arena, trate_slider, agentid, bacteria, 

    function draw_source_at_mouse(){
        food_field.add_gaussian_source(p.mouseX-arena_props.x, p.mouseY-arena_props.y, 100, 30);
    }

    p.setup = () => {
        let canvas = p.createCanvas(canvas_props.width, canvas_props.height);

        food_field = new ScalarField(p, arena_props);
        food_field.add_gaussian_source(400,300,100,30);

        canvas.mouseClicked(draw_source_at_mouse);
        // arena = new AgentArena(p, arena_props);
        // trate_slider = new Slider(p, trate_slider_props);

        // agentid = arena.add_agent(particle_props);

        // bacteria = new SimpleBac(400, 300, 45, 5);

        p.pixelDensity(3);
    }
    
    p.draw = () => {
        p.background(255);

        // Simulation logic
        // if(Math.random()>1.0-trate_slider.get_value()){
        //     bacteria.turn_random();
        // }
        // bacteria.move(arena_props);


        // Drawing
        food_field.draw(p);

        // arena.get_agent(agentid).set_x(bacteria.x);
        // arena.get_agent(agentid).set_y(bacteria.y);
        // arena.get_agent(agentid).set_angle(bacteria.angle);

        // arena.draw(p);
        // trate_slider.draw(p);

        // Draw the framerate
        p.text(p.frameRate(),0,10);
    }
};

let simulation = new p5(sketch, 'simulation');
