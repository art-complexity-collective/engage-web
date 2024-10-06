import { ScalarField } from "../../modules/fields.js"
import { Slider, Button } from "../../modules/ui.js"
import { Agent, AgentArena } from "../../modules/agents.js"

const canvas_props = {width: 900, height: 700};

const arena_props = {
    x: 50,
    y: 5,
    width: 800,
    height: 600};


const add_bac_button1_props = {
    x: 150,
    y: 620,
    height: 60,
    width: 200,
    label: "Add Naive Bacteria"
}

const add_bac_button2_props = {
    x: 550,
    y: 620,
    height: 60,
    width: 200,
    label: "Add Smart Bacteria"
}

const particle_props_naive = {
    x: arena_props.width/2,
    y: arena_props.height/2,
    height: 10,
    width: 20,
    angle: 45,
    radius: 5,
    color: "#b8515f"
};  

const particle_props_smart = {
    x: arena_props.width/2,
    y: arena_props.height/2,
    height: 10,
    width: 20,
    angle: 45,
    radius: 5,
    color: "#a4dad7"
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
    
    let food_field, arena, agentid_naive, bacteria_naive, agentid_smart, bacteria_smart;
    let agentid_list_naive, agentid_list_smart, bacteria_list_naive, bacteria_list_smart;
    let add_naive_button, add_smart_button;

    let old_food_conc = 0.0;

    function draw_source_at_mouse(){
        food_field.add_gaussian_source(p.mouseX-arena_props.x, p.mouseY-arena_props.y, 100, 30,5.0);
    }

    function addbac_naive_clicked(){
        let agentid_new_naive = arena.add_agent(particle_props_naive);
        let bacteria_new_naive = new SimpleBac(Math.floor(Math.random()*800),Math.floor(Math.random()*600), 45, 5);

        agentid_list_naive.push(agentid_new_naive);
        bacteria_list_naive.push(bacteria_new_naive);
    }

    function addbac_smart_clicked(){
        let agentid_new_smart = arena.add_agent(particle_props_smart);
        let bacteria_new_smart = new SimpleBac(Math.floor(Math.random()*800),Math.floor(Math.random()*600), 45, 5);
        bacteria_new_smart.last_conc = 0.0;

        agentid_list_smart.push(agentid_new_smart);
        bacteria_list_smart.push(bacteria_new_smart);
    }

    p.setup = () => {
        let canvas = p.createCanvas(canvas_props.width, canvas_props.height);

        food_field = new ScalarField(p, arena_props);
        canvas.mouseClicked(draw_source_at_mouse);

        arena = new AgentArena(p, arena_props);

        let agentid_naive = arena.add_agent(particle_props_naive);
        let bacteria_naive = new SimpleBac(300, 300, 45, 5);

        let agentid_smart = arena.add_agent(particle_props_smart);
        let bacteria_smart = new SimpleBac(400, 300, 45, 5);
        bacteria_smart.last_conc = 0.0;

        agentid_list_naive = [agentid_naive];
        agentid_list_smart = [agentid_smart];

        bacteria_list_naive = [bacteria_naive];
        bacteria_list_smart = [bacteria_smart];


        add_naive_button = new Button(p, add_bac_button1_props);
        add_naive_button.mouseClicked(addbac_naive_clicked);

        add_smart_button = new Button(p, add_bac_button2_props);
        add_smart_button.mouseClicked(addbac_smart_clicked);

        p.pixelDensity(3);
    }
    
    p.draw = () => {
        p.background(255);

        // Handle naive bacteria
        for (const [index, agent_id] of agentid_list_naive.entries()){
            if(Math.random()>1.0-0.6){
                bacteria_list_naive[index].turn_random();
            }
            bacteria_list_naive[index].move(arena_props);

            arena.get_agent(agent_id).set_xy(bacteria_list_naive[index].x, bacteria_list_naive[index].y);
            arena.get_agent(agent_id).set_angle(bacteria_list_naive[index].angle);
        }

        // Handle smart bacteria
        for (const [index, agent_id] of agentid_list_smart.entries()){
            
            let new_conc = food_field.get_value(Math.floor(bacteria_list_smart[index].x),Math.floor(bacteria_list_smart[index].y));
            let old_conc = bacteria_list_smart[index].last_conc;
            let trate_smart = 0.0;
            if(new_conc>old_conc){
                trate_smart = Math.exp(-100.0*(new_conc-old_conc));
            } else{
                trate_smart = 1.0;
            }

            bacteria_list_smart[index].last_conc = new_conc;

            if(Math.random()>1.0-0.6*trate_smart){
                bacteria_list_smart[index].turn_random();
            }
            bacteria_list_smart[index].move(arena_props);

            arena.get_agent(agent_id).set_xy(bacteria_list_smart[index].x, bacteria_list_smart[index].y);
            arena.get_agent(agent_id).set_angle(bacteria_list_smart[index].angle);
        }

        // Drawing
        food_field.draw(p);
        arena.draw(p);
        p.text(p.frameRate(),0,10); //framerate
    }
};

let simulation = new p5(sketch, 'simulation');
