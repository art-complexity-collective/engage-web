
export function bounding_box(x,y,w,h,angle){
    
    let xs = [x, x+w*Math.cos(angle), x+h*Math.sin(angle), x + h*Math.sin(angle)+w*Math.cos(angle)];
    let ys = [y, y-w*Math.sin(angle), y+h*Math.cos(angle), y+h*Math.cos(angle)-w*Math.sin(angle)];
    
    let return_dims =  {x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs)-Math.min(...xs), height: Math.max(...ys)-Math.min(...ys)};

    return return_dims;
}