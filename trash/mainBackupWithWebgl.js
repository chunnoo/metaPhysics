var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext("webgl");

var frames = 0;
var time = Date.now();

var numObjects = 16;
var objSize = 10;
var objects = [];

var drawSize = 16.0;

var vertices = new Float32Array(48*numObjects);
var vertexBuffer;
var texture;
var vertexShaderSource;
var vertexShader;
var fragmentShaderSource;
var fragmentShader;
var shaderProgram;
var vCoord;
var cColor;
var vTexCoord;
var textureUniform;
var textureImage;
var scaleUniform;
var drawSizeUniform;

var loadedItems = 0;
var loadFunction = function() {
  loadedItems++;
  if (loadedItems == 2) {
    setup();
  }
}

document.getElementById("vsh").onload = loadFunction;
document.getElementById("fsh").onload = loadFunction;

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

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);

  //texture = gl.createTexture();
  //HandleLoadedTexture(textureImage, texture);

  vertexShaderSource = document.getElementById("vsh").contentDocument.firstChild.lastChild.textContent;
  //console.log(vertexShaderSource);
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  console.log(gl.getShaderInfoLog(vertexShader));

  fragmentShaderSource = document.getElementById("fsh").contentDocument.firstChild.lastChild.textContent;
  //console.log(fragmentShaderSource);
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  console.log(gl.getShaderInfoLog(fragmentShader));

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  vCoord = gl.getAttribLocation(shaderProgram, "vCoord");
  gl.vertexAttribPointer(vCoord, 2, gl.FLOAT, false, 4*8, 0);
  gl.enableVertexAttribArray(vCoord);

  vColor = gl.getAttribLocation(shaderProgram, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 4*8, 4*2);
  gl.enableVertexAttribArray(vColor);

  vTexCoord = gl.getAttribLocation(shaderProgram, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 4*8, 4*6);
  gl.enableVertexAttribArray(vTexCoord);

  scaleUniform = gl.getUniformLocation(shaderProgram, "vScale");
  gl.uniform2f(scaleUniform, canvas.width, canvas.height);

  drawSizeUniform = gl.getUniformLocation(shaderProgram, "fDrawSize");
  gl.uniform1f(drawSizeUniform, drawSize);

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
  for (var i = 0; i < 10; i++) {
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
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
}

function draw(e) {
  frames++;
  if (frames % 300 == 69) {
    console.log((Date.now() - time)/300);
    time = Date.now();
  }

  /*ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#fff";

  for (var i = 0; i < objects.length; i++) {
    ctx.beginPath();
    ctx.arc(objects[i].center.x, objects[i].center.y, objects[i].size, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
  }*/

  gl.clearColor(0.125, 0.125, 0.125, 1);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  //gl.enable(gl.DEPTH_TEST);
  //gl.colorMask(true, true, true, true);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.drawArrays(gl.TRIANGLES, 0, 6*numObjects);

  updateObjects(objects);

  requestAnimationFrame(draw);

}
