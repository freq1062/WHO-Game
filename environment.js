//FILE FOR DRAWING ALL THE ENVIRONMENT GRAPHICS
function drawWalls() {//Draws all the walls based on loaded data
  if (WALLS.length <=0) {return;}
  for (var i = 0; i < WALLS.length; i++) {
    push()
    stroke(0)
    rectMode(CORNERS)
    rect(WALLS[i][0], WALLS[i][1], WALLS[i][2], WALLS[i][3])
    pop()
  }
}

function delay(time) {return new Promise(resolve => setTimeout(resolve, time));}//timer

function waitingKeypress() {//waits for the user to press 'z' for text
  return new Promise((resolve) => {
    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
      if (e.keyCode == 90) {
        document.removeEventListener('keydown', onKeyHandler);
        resolve();        
      }

    }
  });
}

function completedGoals(enemy) {//Detects if the player has killed enough enemies for the level
  //[enemy name, [completed, required]]
  for (var i = 0; i < GOALS.length; i++) {
    if (GOALS[i][0] == enemy.name) {
      GOALS[i][1][0]++
      if (GOALS[i][1][0]>=GOALS[i][1][1]){
        delete ENEMIES[GOALS[i][0]]
        return true;
      }
    }
  }
  return false;
}

async function createDialogue() {//Creates dialogue based on loaded data
  if (DIALOGUE.length <=0) {loop();return;}
  drawPlayer()
  draw()
  inText = true;
  let txt = [];
  let prevText = "";
  let counter = 0;
  player.inventoryActivated = false;
  
  push()
  fill(0)
  stroke(255, 0, 0); strokeWeight(5)
  rectMode(CORNERS);
  rect(20, 300, 780, 480)
  pop()
  
  for (var i = 0; i < DIALOGUE.length; i++) {
    if (inText == false) {
      loop();return;
    }
    if (DIALOGUE.length <=0) {loop();return;}
    txt = []
    prevText = ""
    counter = 0;
    if (DIALOGUE[i][1] == undefined) {return;}
    txt = DIALOGUE[i][1].split("");
    for (var j = 0; j < txt.length; j++) {
      if (inText == false) {loop();return;}
      counter++
      if (txt[j] != " ") {await delay(DIALOGUE[i][0])}
      //i know that using "~" is creepy but that's exactly why im using it because i know i wont use this anywhere else
      if (txt[j] != "~") {
        if (counter>=65) {
          if (txt[j] == " ") {
            prevText = prevText + "\n"
            counter = 0
            txt.splice(j, 1)
          }
        }
        prevText = prevText + txt[j]
      } else {
        await delay(500)
      }
      push()
      fill(0)
      stroke(255, 0, 0); strokeWeight(5)
      rectMode(CORNERS);
      rect(20, 300, 780, 480)
      noStroke()
      fill(255)
      textAlign(LEFT)
      textSize(20)
      text(prevText, 50, 330)
      pop()
    }
    push()
    fill(255)
    textAlign(CENTER)
    textSize(10)
    text("Press 'z' to continue...", 410, 465)
    pop()
    await waitingKeypress();
  }
  if (gameOver == false) {LEVEL1[str(level[1])].dialogue = []}
  DIALOGUE = []
  inText = false;loop();
}

function drawLoot() {//Draws all the items on the floor from all loaded loot and despawns loot if there's too much
  if (LOOT.length <=0) {return;}
  if (LOOT.length >= 20) {LOOT.shift()}
  for (var i = 0 ; i < LOOT.length; i++) {
    push()
    stroke(0)
    strokeWeight(2)
    switch(LOOT[i][2]) {
      case "COMMON":
        fill(50)
        break;
      case "UNCOMMON":
        fill(0, 255, 0)
        break;
      case "RARE":
        fill(255, 0, 0)
        break;
      case "EPIC":
        fill(0, 0, 255)
        break;
      case "LEGENDARY":
        fill(255, 0, 255)
        break;
      default:
        fill(0)
    }
    rect(LOOT[i][0][0], LOOT[i][0][1], 25)
    
    pop()
  }
}

function drawDoors() {//Draws all the doors once the goals are done
  if (DOORS.length <=0) {return;}
  if (Object.keys(ENEMIES).length >= 1) {return;}
  for (var i = 0; i < DOORS.length; i++) {
    push()
    stroke(0)
    fill(0, 255, 0)
    rectMode(CORNERS);
    rect(DOORS[i][0], DOORS[i][1], DOORS[i][2], DOORS[i][3])
    pop()
    if (player.pos.x >= DOORS[i][0] && player.pos.x <= DOORS[i][2] && player.pos.y >= DOORS[i][1] && player.pos.y <= DOORS[i][3]) {
      player.pos.y = 450
      switch(level[0]) {
        case 1:
          if (level[1] < Object.keys(LEVEL1).length) {
            level[1]++;
            break;
          } else {
            level[0]++;
            level[1]=1;
            break;
          }
      }
      noLoop();
      load()
    }
  }
}

//x1 0, y1 1, x2 2, y2 3
function getDistances(x, y) {//Controls the collision - draws "imaginary" lines that go to the farthest distance possible in +x, -x, +y, and -y then returns the distances
  let directions = {
    up:[],
    down:[],
    left:[],
    right:[]
  }
  for (let i = 0; i < WALLS.length; i++) {
    if (x >= WALLS[i][0] && x <= WALLS[i][2]) {
      if (WALLS[i][3] <= y) {
        directions.up.push(WALLS[i][3])
      } else if (WALLS[i][1] >= y) {
        directions.down.push(WALLS[i][1])
      }
    }
    if (y >= WALLS[i][1] && y <= WALLS[i][3]) {
      if (x <= WALLS[i][0]) {
        directions.right.push(WALLS[i][0])
      } else if (x >= WALLS[i][2]) {
        directions.left.push(WALLS[i][2])
      }
    }
  }
  if (directions.up.length == 0) {directions.up = 0;}
  else {directions.up = max(directions.up)}
  
  if (directions.down.length == 0) {
    directions.down = 500;
  }
  else {directions.down = min(directions.down)}
  
  if (directions.left.length == 0) {directions.left = 0;}
  else {directions.left = max(directions.left)}
  
  if (directions.right.length == 0) {directions.right = 800;}
  else {directions.right = min(directions.right)}

  if (debugMode == true) {
    push()
    stroke(255, 0, 0)
    line(x, directions.up, x, directions.down)
    stroke(0, 255, 0)
    line(directions.left, y, directions.right, y)
    pop()
  }
  return directions
}

function trophy(x, y) {//Trophy for the end
  push()
  stroke(0)
  strokeWeight(2)
  fill("#FFD700")
  rectMode(CENTER)
  rect(x, y+15, 8, 25)
  rect(x, y+25, 15, 6)
  noStroke()
  fill("rgba(247, 101, 255, 0.35)")
  circle(x, y, 25)
  fill("rgba(234, 10, 255, 0.46)")
  circle(x, y, 20)
  fill("rgba(255, 10, 165, 0.58)")
  circle(x, y, 15)
  fill("rgba(255, 10, 67, 0.67)")
  circle(x, y, 10)
  fill("rgba(255, 10, 10, 0.77)")
  circle(x, y, 5)
  stroke(0)
  strokeWeight(2)
  fill("rgb(229, 145, 0)")
  arc(x, y, 25, 25, 0, PI);
  fill("#FFD700")
  arc(x, y, 25, 25, 0, HALF_PI);
  line(x-12.5, y, x+12.5, y)
  pop()
}
