function contain(sprite, width, height) {
    let out = false;
    //Left
    if (sprite.x - sprite.radius < 0 ) {
      out = true;
    }
    //Top
    if (sprite.y < 0) {
      out = false; //if the projectile comes out through the top, it is not out. the game should continue the curve
    }
    //Right
    if (sprite.x - sprite.radius > width) {
      out = true;
    }
    //Bottom
    if (sprite.y - sprite.radius > height) {
      out = true;
    }
    //Return the `out` value
    return out;
}
  

function angle(sx, sy, ex, ey) {
    let dy = ey - sy;
    let dx = ex - sx;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    theta = Math.PI - theta;
    return theta;
}

function calculatePower(sx, sy, ex, ey ) {
    let dx = Math.abs(ex - sx);
    let dy = Math.abs(ey - sy);
    let controlLineLength = Math.sqrt(dx * dx + dy * dy);
    let powerPercent = 0.1;
    
    controlLineLength >= 200 ? powerPercent = 1 : powerPercent = controlLineLength / 200;

    return powerPercent;
}

function checkForColisions(projectile, player){

}