function PhysicalCircle(center, size) {
  this.center = center;
  this.size = size;
  this.elasticity = 0.0;

  this.velocity = new vec2(0, 0);
  this.acceleration = new vec2(0, 0);
}

PhysicalCircle.prototype = {
  debug: function() {
    if (isNaN(this.center.x) || isNaN(this.center.y) || isNaN(this.velocity.x) || isNaN(this.velocity.y) || isNaN(this.acceleration.x) || isNaN(this.acceleration.y)) {
      console.log(this);
      debugger;
    }
  },
  force: function(f) {
    this.acceleration.translate(f);
  },
  staticAttraction: function(p) {
    if (!this.center.equal(p)) {
      var attractionConstant = 0.5
      var attractionForce = attractionConstant/Math.pow(this.center.dist(p), 2);
      var attractionForceVector = this.center.vecTo(p).normalized().multiply(attractionForce);
      this.force(attractionForceVector);
    }
  },
  collision: function(obj) {
    if (this.center.dist(obj.center) <= this.size + obj.size) {
      console.log("fuuck");
      var distVec = this.center.vecTo(obj.center);
      var overlapVec = distVec.normalized().multiply(Math.abs(distVec.length() - (this.size + obj.size)));
      obj.center.translate(overlapVec.multiply(0.5 + EPS)); //Look into this
      this.center.translate(overlapVec.inverse().multiply(0.5 + EPS));
    } else {
      var x = this.center.x - obj.center.x;
      var dx = (this.velocity.x + this.acceleration.x) - (obj.velocity.x + obj.acceleration.x);
      var y = this.center.y - obj.center.y;
      var dy = (this.velocity.y + this.acceleration.y) - (obj.velocity.y + obj.acceleration.y);
      var s = this.size + obj.size;

      var t = INF;

      var d = 4*Math.pow(x*dx + y*dy, 2) - 4*(dx*dx + dy*dy)*(x*x + y*y - s*s);

      if (x*dx + y*dy < 0 && d >= 0 && dx*dx + dy*dy != 0) {
        var t1 = (-2*(x*dx + y*dy) + Math.sqrt(d))/(2*(dx*dx + dy*dy));
        var t2 = (-2*(x*dx + y*dy) - Math.sqrt(d))/(2*(dx*dx + dy*dy));

        if (t1 <= 1 && t1 >= 0) {
          t = t1;
        }
        if (t2 <= 1 && t2 >= 0 && t2 < t) {
          t = t2;
        }

        if (t <= 1 && t >= 0 && !(dx*t + x == 0 && dy*t + y == 0)) {
          var collisionVec = new vec2(dx*t + x, dy*t + y);
          var collisionVecNorm = collisionVec.normalized();
          var aVel = new vec2(this.velocity.x + this.acceleration.x, this.velocity.y + this.acceleration.y);
          var bVel = new vec2(obj.velocity.x + obj.acceleration.x, obj.velocity.y + obj.acceleration.y);
          var bSubA = bVel.subtract(aVel);
          var aSubB = aVel.subtract(bVel);
          var aForceVec = collisionVecNorm.multiply(bSubA.dot(collisionVecNorm)*(1.0 + this.elasticity));
          var bForceVec = collisionVecNorm.multiply(aSubB.dot(collisionVecNorm)*(1.0 + obj.elasticity));
          this.force(aForceVec);
          obj.force(bForceVec);
          this.debug();
        }
      }
    }
  },
  drag: function() {
    var dragConstant = 0.001;
    var dragForce = Math.pow(this.velocity.length(), 2) * dragConstant;
    var dragForceVector = this.velocity.inverse().normalized().multiply(dragForce);
    this.force(dragForceVector);
    this.debug();
  },
  update: function() {
    var prev = this.center.copy();
    this.velocity.translate(this.acceleration);
    this.center.translate(this.velocity);
    this.acceleration = new vec2(0, 0);
    this.drag();
    return this.center.subtract(prev);
  }
}
