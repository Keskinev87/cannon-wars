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
  