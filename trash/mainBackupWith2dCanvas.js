var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var frames = 0;
var time = Date.now();

var objects = [];

for (var i = 0; i < 16; i++) {
  objects.push(new PhysicalCircle(new vec2(Math.random()*canvas.width, Math.random()*canvas.height), 5));
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
  }
}

function draw(e) {
  frames++;
  if (frames % 300 == 69) {
    console.log((Date.now() - time)/300);
    time = Date.now();
  }

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#fff";

  for (var i = 0; i < objects.length; i++) {
    ctx.beginPath();
    ctx.arc(objects[i].center.x, objects[i].center.y, objects[i].size, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
  }

  updateObjects(objects);

  requestAnimationFrame(draw);

}

draw();
