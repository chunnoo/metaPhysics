var canvas = document.getElementById("canvas");
canvas.width = 512;// window.innerWidth;
canvas.height = 512;//window.innerHeight;

var gl = canvas.getContext("webgl", { premultipliedAlpha: false });

var frames = 0;
var time = Date.now();

var numObjects = 16;
var objSize = 15;
var objects = [];

var renderSize = {
  width: 512,
  height: 512
}

var drawSize = 8.0;

var vertices = new Float32Array(48*numObjects);
var objectVertexBuffer;

var frameVetices = new Float32Array([
  -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
   1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
  -1.0,  1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
  -1.0,  1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
   1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
   1.0,  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
]);
var frameVertexBuffer;

var renderToFrameBuffer;
var renderToTexture;

//var renderBuffer;

var objectVertexShaderSource;
var objectVertexShader;
var objectFragmentShaderSource;
var objectFragmentShader;
var objectShaderProgram;

var frameVertexShaderSource;
var frameVertexShader;
var frameFragmentShaderSource;
var frameFragmentShader;
var frameShaderProgram;

var objectVCoord;
var objectVColor;
var objectVTexCoord;
var frameVCoord;
var frameVColor;
var frameVTexCoord;

var textureUniform;
var textureImage;
var scaleUniform;
var drawSizeUniform;

var loadedItems = 0;
var loadFunction = function() {
  loadedItems++;
  if (loadedItems == 4) {
    setup();
  }
}

document.getElementById("objectVsh").onload = loadFunction;
document.getElementById("objectFsh").onload = loadFunction;
document.getElementById("frameVsh").onload = loadFunction;
document.getElementById("frameFsh").onload = loadFunction;

function setup() {
  for (var i = 0; i < numObjects; i++) {
    objects.push(new PhysicalCircle(new vec2(Math.random()*canvas.width, Math.random()*canvas.height), objSize));
  }

  for (var i = 0; i < objects.length; i++) {
    vertices[48*i + 0] = objects[i].center.x - objects[i].size*drawSize;
    vertices[48*i + 1] = objects[i].center.y + objects[i].size*drawSize;

    vertices[48*i + 2] = 1.0;
    vertices[48*i + 3] = 1.0;
    vertices[48*i + 4] = 1.0;
    vertices[48*i + 5] = 1.0;

    vertices[48*i + 6] = 0.0;
    vertices[48*i + 7] = 1.0;

    vertices[48*i + 8] = objects[i].center.x + objects[i].size*drawSize;
    vertices[48*i + 9] = objects[i].center.y + objects[i].size*drawSize;

    vertices[48*i + 10] = 1.0;
    vertices[48*i + 11] = 1.0;
    vertices[48*i + 12] = 1.0;
    vertices[48*i + 13] = 1.0;

    vertices[48*i + 14] = 1.0;
    vertices[48*i + 15] = 1.0;

    vertices[48*i + 16] = objects[i].center.x - objects[i].size*drawSize;
    vertices[48*i + 17] = objects[i].center.y - objects[i].size*drawSize;

    vertices[48*i + 18] = 1.0;
    vertices[48*i + 19] = 1.0;
    vertices[48*i + 20] = 1.0;
    vertices[48*i + 21] = 1.0;

    vertices[48*i + 22] = 0.0;
    vertices[48*i + 23] = 0.0;

    vertices[48*i + 24] = objects[i].center.x - objects[i].size*drawSize;
    vertices[48*i + 25] = objects[i].center.y - objects[i].size*drawSize;

    vertices[48*i + 26] = 1.0;
    vertices[48*i + 27] = 1.0;
    vertices[48*i + 28] = 1.0;
    vertices[48*i + 29] = 1.0;

    vertices[48*i + 30] = 0.0;
    vertices[48*i + 31] = 0.0;

    vertices[48*i + 32] = objects[i].center.x + objects[i].size*drawSize;
    vertices[48*i + 33] = objects[i].center.y + objects[i].size*drawSize;

    vertices[48*i + 34] = 1.0;
    vertices[48*i + 35] = 1.0;
    vertices[48*i + 36] = 1.0;
    vertices[48*i + 37] = 1.0;

    vertices[48*i + 38] = 1.0;
    vertices[48*i + 39] = 1.0;

    vertices[48*i + 40] = objects[i].center.x + objects[i].size*drawSize;
    vertices[48*i + 41] = objects[i].center.y - objects[i].size*drawSize;

    vertices[48*i + 42] = 1.0;
    vertices[48*i + 43] = 1.0;
    vertices[48*i + 44] = 1.0;
    vertices[48*i + 45] = 1.0;

    vertices[48*i + 46] = 1.0;
    vertices[48*i + 47] = 0.0;
  }

  //console.log(vertices);
  //debugger;

  /*var tempVertices = [
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
    1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0
  ];*/

  //start renderBuffer setup

  renderToFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderToFrameBuffer);
  renderToFrameBuffer.width = renderSize.width;
  renderToFrameBuffer.height = renderSize.height;

  renderToTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, renderToTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, renderToFrameBuffer.width, renderToFrameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.generateMipmap(gl.TEXTURE_2D);

  //renderBuffer = gl.createRenderbuffer();
  //gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderToFrameBuffer.width, renderToFrameBuffer.height);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderToTexture, 0);
  //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  //end renderBuffer setup

  /*objectVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, objectVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);*/
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);

  //texture = gl.createTexture();
  //HandleLoadedTexture(textureImage, texture);

  objectVertexShaderSource = document.getElementById("objectVsh").contentDocument.firstChild.lastChild.textContent;
  //objectVertexShaderSource = "attribute vec2 vCoord; attribute vec4 vColor; attribute vec2 vTexCoord; varying vec4 fColor; varying vec2 fTexCoord; uniform vec2 vScale; void main(void) { fColor = vColor; fTexCoord = vTexCoord; gl_Position = vec4(vec2(vCoord.x*2.0/vScale.x - 1.0, vCoord.y*2.0/vScale.y - 1.0), 0.0, 1.0); }";

  //console.log(vertexShaderSource);
  objectVertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(objectVertexShader, objectVertexShaderSource);
  gl.compileShader(objectVertexShader);
  console.log(gl.getShaderInfoLog(objectVertexShader));

  objectFragmentShaderSource = document.getElementById("objectFsh").contentDocument.firstChild.lastChild.textContent;
  //objectFragmentShaderSource = "precision mediump float; varying vec4 fColor; varying vec2 fTexCoord; uniform float fDrawSize; void main(void) { vec2 fromCenter = vec2(fTexCoord.x*2.0 - 1.0, fTexCoord.y*2.0 - 1.0); float distFromCenter = length(fromCenter) * fDrawSize; gl_FragColor = vec4(fColor.r, 0.0, 0.0, 1.0/pow(distFromCenter, 2.0)); }";
  //console.log(fragmentShaderSource);
  objectFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(objectFragmentShader, objectFragmentShaderSource);
  gl.compileShader(objectFragmentShader);
  console.log(gl.getShaderInfoLog(objectFragmentShader));

  objectShaderProgram = gl.createProgram();
  gl.attachShader(objectShaderProgram, objectVertexShader);
  gl.attachShader(objectShaderProgram, objectFragmentShader);
  gl.linkProgram(objectShaderProgram);
  gl.useProgram(objectShaderProgram);

  objectVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, objectVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, objectVertexBuffer);

  objectVCoord = gl.getAttribLocation(objectShaderProgram, "vCoord");
  gl.vertexAttribPointer(objectVCoord, 2, gl.FLOAT, false, 4*8, 0);
  gl.enableVertexAttribArray(objectVCoord);

  objectVColor = gl.getAttribLocation(objectShaderProgram, "vColor");
  gl.vertexAttribPointer(objectVColor, 4, gl.FLOAT, false, 4*8, 4*2);
  gl.enableVertexAttribArray(objectVColor);

  objectVTexCoord = gl.getAttribLocation(objectShaderProgram, "vTexCoord");
  gl.vertexAttribPointer(objectVTexCoord, 2, gl.FLOAT, false, 4*8, 4*6);
  gl.enableVertexAttribArray(objectVTexCoord);

  scaleUniform = gl.getUniformLocation(objectShaderProgram, "vScale");
  gl.uniform2f(scaleUniform, canvas.width, canvas.height); //Hmm

  drawSizeUniform = gl.getUniformLocation(objectShaderProgram, "fDrawSize");
  gl.uniform1f(drawSizeUniform, drawSize);


  frameVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, frameVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, frameVetices, gl.STATIC_DRAW);

  frameVertexShaderSource = document.getElementById("frameVsh").contentDocument.firstChild.lastChild.textContent;
  //frameVertexShaderSource = "attribute vec2 vCoord; attribute vec4 vColor; attribute vec2 vTexCoord; varying vec4 fColor; varying vec2 fTexCoord; void main(void) { fColor = vColor; fTexCoord = vTexCoord; gl_Position = vec4(vCoord, 0.0, 0.0); } ";
  frameVertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(frameVertexShader, frameVertexShaderSource);
  gl.compileShader(frameVertexShader);
  console.log(gl.getShaderInfoLog(frameVertexShader));

  frameFragmentShaderSource = document.getElementById("frameFsh").contentDocument.firstChild.lastChild.textContent;
  //frameFragmentShaderSource = "precision mediump float; varying vec4 fColor; varying vec2 fTexCoord; uniform sampler2D fSampler; void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }";
  frameFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(frameFragmentShader, frameFragmentShaderSource);
  gl.compileShader(frameFragmentShader);
  console.log(gl.getShaderInfoLog(frameFragmentShader));

  frameShaderProgram = gl.createProgram();
  gl.attachShader(frameShaderProgram, frameVertexShader);
  gl.attachShader(frameShaderProgram, frameFragmentShader);
  gl.linkProgram(frameShaderProgram);
  gl.useProgram(frameShaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, frameVertexBuffer);

  frameVCoord = gl.getAttribLocation(frameShaderProgram, "vCoord");
  gl.vertexAttribPointer(frameVCoord, 2, gl.FLOAT, false, 4*8, 0);
  gl.enableVertexAttribArray(frameVCoord);

  frameVColor = gl.getAttribLocation(frameShaderProgram, "vColor");
  gl.vertexAttribPointer(frameVColor, 4, gl.FLOAT, false, 4*8, 4*2);
  gl.enableVertexAttribArray(frameVColor);

  frameVTexCoord = gl.getAttribLocation(frameShaderProgram, "vTexCoord");
  gl.vertexAttribPointer(frameVTexCoord, 2, gl.FLOAT, false, 4*8, 4*6);
  gl.enableVertexAttribArray(frameVTexCoord);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, renderToTexture);
  textureUniform = gl.getUniformLocation(frameShaderProgram, "fSampler");
  gl.uniform1i(textureUniform, 0);

  //gl.activeTexture(gl.TEXTURE0);
  //gl.bindTexture(gl.TEXTURE_2D, texture);
  //var textureUniform = gl.getUniformLocation(shaderProgram, "fSampler");
  //gl.uniform1i(textureUniform, 0);

  draw();

}

function updateObjects(objarr) {
  for (var i = 0; i < objarr.length; i++) {
    for (var j = 0; j < objarr.length; j++) {
      if (i != j) {
        objarr[i].staticAttraction(objarr[j].center);
      }
    }
  }
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < objarr.length; j++) {
      for (var k = j + 1; k < objarr.length; k++) {
        objarr[j].collision(objarr[k]);
      }
    }
  }
  for (var i = 0; i < objarr.length; i++) {
    objarr[i].update();

    vertices[48*i + 0] = objarr[i].center.x - objarr[i].size*drawSize;
    vertices[48*i + 1] = objarr[i].center.y + objarr[i].size*drawSize;

    vertices[48*i + 8] = objarr[i].center.x + objarr[i].size*drawSize;
    vertices[48*i + 9] = objarr[i].center.y + objarr[i].size*drawSize;

    vertices[48*i + 16] = objarr[i].center.x - objarr[i].size*drawSize;
    vertices[48*i + 17] = objarr[i].center.y - objarr[i].size*drawSize;

    vertices[48*i + 24] = objarr[i].center.x - objarr[i].size*drawSize;
    vertices[48*i + 25] = objarr[i].center.y - objarr[i].size*drawSize;

    vertices[48*i + 32] = objarr[i].center.x + objarr[i].size*drawSize;
    vertices[48*i + 33] = objarr[i].center.y + objarr[i].size*drawSize;

    vertices[48*i + 40] = objarr[i].center.x + objarr[i].size*drawSize;
    vertices[48*i + 41] = objarr[i].center.y - objarr[i].size*drawSize;
  }
}

function draw(e) {
  frames++;
  if (frames % 300 == 69) {
    console.log((Date.now() - time)/300);
    time = Date.now();
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, renderToFrameBuffer);

  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.blendFunc(gl.SRC_COLOR, gl.ONE);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, renderSize.width, renderSize.height);

  //gl.enable(gl.DEPTH_TEST);
  //gl.colorMask(true, true, true, true);

  gl.useProgram(objectShaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, objectVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);

  gl.vertexAttribPointer(objectVCoord, 2, gl.FLOAT, false, 4*8, 0);
  gl.vertexAttribPointer(objectVColor, 4, gl.FLOAT, false, 4*8, 4*2);
  gl.vertexAttribPointer(objectVTexCoord, 2, gl.FLOAT, false, 4*8, 4*6);

  //gl.activeTexture(gl.TEXTURE0);
  //gl.bindTexture(gl.TEXTURE_2D, null);

  gl.drawArrays(gl.TRIANGLES, 0, 6*numObjects);

  //gl.bindTexture(gl.TEXTURE_2D, renderToTexture);
  //gl.generateMipmap(gl.TEXTURE_2D);
  //gl.bindTexture(gl.TEXTURE_2D, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.clearColor(0.125, 0.125, 0.125, 1.0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.useProgram(frameShaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, frameVertexBuffer);

  gl.vertexAttribPointer(frameVCoord, 2, gl.FLOAT, false, 4*8, 0);
  gl.vertexAttribPointer(frameVColor, 4, gl.FLOAT, false, 4*8, 4*2);
  gl.vertexAttribPointer(frameVTexCoord, 2, gl.FLOAT, false, 4*8, 4*6);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, renderToTexture);
  gl.uniform1i(textureUniform, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  updateObjects(objects);

  requestAnimationFrame(draw);

}
