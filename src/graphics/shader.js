function Shader(gl, vertexSource, fragmentSource) {
  this.vertexSource = vertexSource;
  this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(this.vertexShader, this.vertexSource);
  gl.compileShader(this.vertexShader);
  console.log(gl.getShaderInfoLog(this.vertexShader));

  this.fragmentSource = fragmentSource;
  this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(this.fragmentShader, this.fragmentSource);
  gl.compileShader(this.fragmentShader);
  console.log(gl.getShaderInfoLog(this.fragmentShader));

  this.shaderProgram = gl.createProgram();
  gl.attachShader(this.shaderProgram, this.vertexShader);
  gl.attachShader(this.shaderProgram, this.fragmentShader);
  gl.linkProgram(this.shaderProgram);
  gl.useProgram(this.shaderProgram);

  this.attributes = [];
  this.attributeNames = [];
  this.attributeSizes = [];
  this.combinedAttributeSize = 0;

  this.uniforms = [];
  this.uniformNames = [];
  this.uniformValues = [];

  this.textureUniform;
}

Shader.prototype = {
  initilizeAttributes: function(gl, names, sizes) {
    this.combinedAttributeSize = 0;
    for (var i = 0; i < sizes.length; i++) {
      this.combinedAttributeSize += sizes[i];
    }
    var shift = 0;
    for (var i = 0; i < names.length; i++) {
      this.attributeNames.push(names[i]);
      this.attributeSizes.push(sizes[i]);
      this.attributes.push(gl.getAttribLocation(this.shaderProgram, this.attributeNames[i]));
      gl.vertexAttribPointer(this.attributes[i], this.attributeSizes[i], gl.FLOAT, false, 4*this.combinedAttributeSize, 4*shift);
      gl.enableVertexAttribArray(this.attributes[i]);
      shift += this.attributeSizes[i];
    }
  },
  updateAttributes: function(gl) {
    var shift = 0;
    for (var i = 0; i < this.attributes.length; i++) {
      gl.vertexAttribPointer(this.attributes[i], this.attributeSizes[i], gl.FLOAT, false, 4*this.combinedAttributeSize, 4*shift);
      shift += this.attributeSizes[i];
    }
  },
  initilizeUniforms: function(gl, names, values) {
    for (var i = 0; i < names.length; i++) {
      this.uniformNames.push(names[i]);
      this.uniformValues.push(values[i]);
      this.uniforms.push(gl.getUniformLocation(this.shaderProgram, this.uniformNames[i]));
      if (this.uniformValues[i].length == 1) {
        gl.uniform1f(this.uniforms[i], this.uniformValues[i][0]);
      } else if (this.uniformValues[i].length == 2) {
        gl.uniform2f(this.uniforms[i], this.uniformValues[i][0], this.uniformValues[i][1]);
      }
    }
  },
  initilizeTextureUniform: function(gl, texture, name) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    this.textureUniform = gl.getUniformLocation(this.shaderProgram, name);
    gl.uniform1i(this.textureUniform, 0);
  },
  updateTextureUniform: function(gl, texture) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(this.textureUniform, 0);
  }
}
