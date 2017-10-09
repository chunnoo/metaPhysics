function Mesh(size) {
  this.vertices = new Float32Array(size*48);
}

Mesh.prototype = {
  setColors: function(red, green, blue, alpha) {
    for (var i = 0; i < this.vertices.length / 8; i++) {
      this.vertices[i*8 + 2] = red;
      this.vertices[i*8 + 3] = green;
      this.vertices[i*8 + 4] = blue;
      this.vertices[i*8 + 5] = alpha;
    }
  },
  genQuads: function(size) {
    for (var i = 0; i < this.vertices.length / 48; i++) {
      this.vertices[i*48 + 0] = -size;
      this.vertices[i*48 + 1] = -size;
      this.vertices[i*48 + 6] = 0.0;
      this.vertices[i*48 + 7] = 0.0;

      this.vertices[i*48 + 8] = size;
      this.vertices[i*48 + 9] = -size;
      this.vertices[i*48 + 14] = 1.0;
      this.vertices[i*48 + 15] = 0.0;

      this.vertices[i*48 + 16] = -size;
      this.vertices[i*48 + 17] = size;
      this.vertices[i*48 + 22] = 0.0;
      this.vertices[i*48 + 23] = 1.0;

      this.vertices[i*48 + 24] = -size;
      this.vertices[i*48 + 25] = size;
      this.vertices[i*48 + 30] = 0.0;
      this.vertices[i*48 + 31] = 1.0;

      this.vertices[i*48 + 32] = size;
      this.vertices[i*48 + 33] = -size;
      this.vertices[i*48 + 38] = 1.0;
      this.vertices[i*48 + 39] = 0.0;

      this.vertices[i*48 + 40] = size;
      this.vertices[i*48 + 41] = size;
      this.vertices[i*48 + 46] = 1.0;
      this.vertices[i*48 + 47] = 1.0;
    }
  },
  translateQuad: function(translation, index) {
    for (var i = 0; i < 6; i++) {
      this.vertices[index*48 + i*8 + 0] += translation.x;
      this.vertices[index*48 + i*8 + 1] += translation.y;
    }
  },
  translateQuads: function(translations) {
    for (var i = 0; i < this.vertices.length / 6; i++) {
      this.vertices[i*6 + 0] += translations[i].x;
      this.vertices[i*6 + 1] += translations[i].y;
    }
  }
}
