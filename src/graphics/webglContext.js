function WebglContext(webglContext) {

  this.gl = webglContext;

  this.vertexBuffers = [];
  this.frameBuffers = [null];

  this.textures = [null];

  this.shaders = [];

}

WebglContext.prototype = {
  renderToTexture: function(width, height) {
    var frameBufferIndex = this.frameBuffers.length;
    this.frameBuffers.push(this.gl.createFramebuffer());
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers[frameBufferIndex]);
    this.frameBuffers[frameBufferIndex].width = width;
    this.frameBuffers[frameBufferIndex].height = height;

    var textureIndex = this.textures.length;
    this.textures.push(this.gl.createTexture());
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[textureIndex]);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffers[frameBufferIndex].width, this.frameBuffers[frameBufferIndex].height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures[textureIndex], 0);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    return {frameBuffer: frameBufferIndex, texture: textureIndex};
  },
  createShader: function(vertexSource, fragmentSource) {
    var index = this.shaders.length;
    this.shaders.push(new Shader(this.gl, vertexSource, fragmentSource));
    return index;
  },
  createVertexBuffer: function() {
    var index = this.vertexBuffers.length;
    this.vertexBuffers.push(this.gl.createBuffer());
    return index;
  },
  bindVertexBuffer: function(vertexBufferIndex) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffers[vertexBufferIndex]);
  },
  updateVertexBufferData: function(vertexBufferIndex, vertices, type) {
    this.bindVertexBuffer(vertexBufferIndex);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, type);
  },
  initilizeAttributes: function(vertexBufferIndex, shaderIndex, names, sizes) {
    this.useShader(shaderIndex);
    this.bindVertexBuffer(vertexBufferIndex);
    this.shaders[shaderIndex].initilizeAttributes(this.gl, names, sizes);
  },
  updateAttributes: function(vertexBufferIndex, shaderIndex) {
    this.useShader(shaderIndex);
    this.bindVertexBuffer(vertexBufferIndex);
    this.shaders[shaderIndex].updateAttributes(this.gl);
  },
  initilizeUniforms: function(shaderIndex, names, values) {
    this.useShader(shaderIndex);
    this.shaders[shaderIndex].initilizeUniforms(this.gl, names, values);
  },
  initilizeTextureUniform: function(shaderIndex, textureIndex, name) {
    this.useShader(shaderIndex)
    this.shaders[shaderIndex].initilizeTextureUniform(this.gl, this.textures[textureIndex], name);
  },
  updateTextureUniform: function(shaderIndex, textureIndex) {
    this.shaders[shaderIndex].updateTextureUniform(this.gl, this.textures[textureIndex]);
  },
  bindFrameBuffer: function(frameBufferIndex) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers[frameBufferIndex]);
  },
  setupFrame: function(red, green, blue, alpha, blendColor, width, height) {
    this.gl.clearColor(red, green, blue, alpha);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    if (blendColor) {
      this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ONE);
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.viewport(0, 0, width, height);
  },
  useShader: function(shaderIndex) {
    this.gl.useProgram(this.shaders[shaderIndex].shaderProgram);
  },
  drawArrays: function(numVertices) {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, numVertices);
  }
}
