var INF = 1e9;
var EPS = 1e-9;

function vec2(x, y) {
  this.x = x;
  this.y = y;
}

vec2.prototype = {
  translate: function(v) {
    this.x += v.x;
    this.y += v.y;
  },
  rotate: function(a) {
    var tempX = this.x;
    var tempY = this.y;
    this.x = tempX*Math.cos(a) - tempY*Math.sin(a);
    this.y = tempX*Math.sin(a) + tempY*Math.cos(a);
  },
  rotateAroundPoint: function(v, a) {
    var tempX = this.x - v.x;
    var tempY = this.y - v.y;
    this.x = tempX*Math.cos(a) - tempY*Math.sin(a) + v.x;
    this.y = tempX*Math.sin(a) + tempY*Math.cos(a) + v.y;
  },
  scale: function(s) {
    this.x *= s;
    this.y *= s;
  },
  multiply: function(s) {
    return new vec2(s*this.x, s*this.y);
  },
  vecMultiply: function(v) {
    return new vec2(this.x*v.x, this.y*v.y);
  },
  add: function(v) {
    return new vec2(this.x + v.x, this.y + v.y);
  },
  subtract: function (v) {
    return new vec2(this.x - v.x, this.y - v.y);
  },
  length: function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  },
  dist: function(v) {
    return Math.sqrt((v.x - this.x)*(v.x - this.x) + (v.y - this.y)*(v.y - this.y));
  },
  vecTo: function(v) {
    return new vec2(v.x - this.x, v.y - this.y);
  },
  dot: function(v) {
    return this.x*v.x + this.y*v.y;
  },
  wedge: function(v) {
    return this.x*v.y - this.y*v.x;
  },
  normal: function() {
    return new vec2(-this.y, this.x);
  },
  normalize: function() {
    var tempLength = this.length();
    if (tempLength == 0) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x /= tempLength;
      this.y /= tempLength;
    }
  },
  normalized: function() {
    var tempLength = this.length();
    return new vec2(this.x/tempLength, this.y/tempLength);
  },
  equal: function(v) {
    return Math.abs(this.x - v.x) < EPS && Math.abs(this.y - v.y) < EPS;
  },
  copy: function() {
    return new vec2(this.x, this.y);
  },
  inverse: function() {
    return new vec2(-this.x, -this.y);
  }
}
