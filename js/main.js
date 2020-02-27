function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    stroke(255);
    fill(0);
    textSize(40);
    textAlign(CENTER, CENTER);
}

function draw() {
    text("click and drag the mouse to draw!", width/2, height/2);
    if(mouseIsPressed){
        point(mouseX, mouseY);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}
