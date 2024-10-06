
export class AgentArena{
    constructor(p, props){
        this._props = {...props};
        this._layer = p.createGraphics(this._props.width, this._props.height); // Add two pixels to make a boundary
        this._agents = [];
    }

    update_layer_agent(idx){
        this._layer.push();
        this._layer.strokeWeight(2);
        this._layer.translate(this._agents[idx]._props.x,this._agents[idx]._props.y);
        this._layer.rotate(this._agents[idx]._props.angle * (Math.PI/180.0))
        this._layer.fill(this._agents[idx]._props.color);
        this._layer.rect(-(this._agents[idx]._props.width/2), -((this._agents[idx]._props.height/2)), this._agents[idx]._props.width, this._agents[idx]._props.height, this._agents[idx]._props.radius);
        this._layer.pop();
    }

    update_layer_agents(){
        this._layer.clear();
        // this._layer.push();
        // this._layer.strokeWeight(4);
        // this._layer.rect(0, 0, this._props.width, this._props.height); // Outline box
        // this._layer.pop();
        for(let idx=0;idx<this._agents.length;idx++){
            this.update_layer_agent(idx);
        }
    }

    draw(p){
        this.update_layer_agents();
        p.image(this._layer, this._props.x, this._props.y);
    }

    add_agent(props){
        this._agents.push(new Agent(props));
        return(this._agents.length-1);
    }

    get_agent(idx){
        //console.log(this._agents[idx]);
        return this._agents[idx];
    }

}

export class Agent{
    constructor(props){
        this._props = {...props};
    }

    get_x(){
        return this._props.x;
    }

    get_y(){
        return this._props.y;
    }

    // inc_x(value){
    //     this._props.x += value;
    // }

    // inc_y(value){
    //     this._props.y += value;
    // }

    set_color(value){
        this._props.color=value;
    }

    set_x(value){
        this._props.x = value;

    }

    set_y(value){
        this._props.y = value;

    }

    set_xy(valx,valy){
        this._props.x = valx;
        this._props.y = valy;
    }

    set_angle(value){
        this._props.angle = value;
    }

}
