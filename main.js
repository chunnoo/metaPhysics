var canvas = document.getElementById("canvas");
canvas.width = 512;// window.innerWidth;
canvas.height = 512;//window.innerHeight;

var gl = new WebglContext(canvas.getContext("webgl", { premultipliedAlpha: false }));

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

var vertices = new Mesh(numObjects);
vertices.setColors(0.0, 0.2, 1.0, 1.0);
vertices.genQuads(objSize*drawSize);

var frameVertices = new Mesh(1);
frameVertices.setColors(1.0, 1.0, 1.0, 1.0);
frameVertices.genQuads(1.0);

var renderToTextureBuffer = {};
var objectShader;
var frameShader;
var objectVertexBuffer;
var frameVertexBuffer;


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
    vertices.translateQuad(objects[i].center, i);
  }

  renderToTextureBuffer = gl.renderToTexture(renderSize.width, renderSize.height);

  objectShader = gl.createShader(document.getElementById("objectVsh").contentDocument.firstChild.lastChild.textContent, document.getElementById("objectFsh").contentDocument.firstChild.lastChild.textContent);

  objectVertexBuffer = gl.createVertexBuffer();
  gl.updateVertexBufferData(objectVertexBuffer, vertices.vertices, gl.gl.STREAM_DRAW);

  gl.initilizeAttributes(objectVertexBuffer, objectShader, ["vCoord", "vColor", "vTexCoord"], [2, 4, 2]);
  gl.initilizeUniforms(objectShader, ["vScale", "fDrawSize"], [[canvas.width, canvas.height], [drawSize]]);

  frameShader = gl.createShader(document.getElementById("frameVsh").contentDocument.firstChild.lastChild.textContent, document.getElementById("frameFsh").contentDocument.firstChild.lastChild.textContent);

  frameVertexBuffer = gl.createVertexBuffer();
  gl.updateVertexBufferData(frameVertexBuffer, frameVertices.vertices, gl.gl.STATIC_DRAW);

  gl.initilizeAttributes(frameVertexBuffer, frameShader, ["vCoord", "vColor", "vTexCoord"], [2, 4, 2]);
  gl.initilizeTextureUniform(frameShader, renderToTextureBuffer.texture, "fSampler");

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
    vertices.translateQuad(objarr[i].update(), i);
  }
}

function draw(e) {
  frames++;
  if (frames % 300 == 69) {
    console.log((Date.now() - time)/300);
    time = Date.now();
  }

  gl.bindFrameBuffer(renderToTextureBuffer.frameBuffer);

  gl.setupFrame(0.0, 0.0, 0.0, 0.0, true, renderSize.width, renderSize.height);

  gl.useShader(objectShader);

  gl.updateVertexBufferData(objectVertexBuffer, vertices.vertices, gl.gl.STREAM_DRAW);
  gl.updateAttributes(objectVertexBuffer, objectShader);

  gl.drawArrays(6*numObjects);

  gl.bindFrameBuffer(0);

  gl.setupFrame(0.125, 0.125, 0.125, 1.0, false, canvas.width, canvas.height);

  gl.useShader(frameShader);

  gl.bindVertexBuffer(frameVertexBuffer);
  gl.updateAttributes(frameVertexBuffer, frameShader);
  gl.updateTextureUniform(frameShader, renderToTextureBuffer.texture);

  gl.drawArrays(6);

  updateObjects(objects);

  requestAnimationFrame(draw);

}
