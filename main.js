//FILE FOR MAIN CONTROL
"esversion: 8";
let WALLS = []; //x1, y1, x2, y2
//All of these are loaded by load() and used for other functions
let DOORS = [];
let LOOT = {}; //Format: [[x, y] 0, name 1, rarity]
let ENEMIES = {};
let DIALOGUE = [];
let GOALS = [];

//Other state and debug stats
let debugMode = false;
let gameOver = true;
let inText = false;
let bulletNum = 0;
let above = ""
let displayTrophy = false;

//Cooldowns for every enemy and player to be used in cooldownManager()
let cooldowns = {
  player: {
    bullet: [500, false],
    knife: [500, false]
  },
  /*
  TEST_ENEMY: {
    spawn: [1000, false],
    attack: [500, false]
  },
  */
  ALPHA_VARIANT: {
    spawn: [5000, false],
    attack: [2000, false],
    move: [0, false]
  },
  BETA_VARIANT: {
    spawn: [500, false],
    attack: [1000, false],
    move: [100, false]
  },
  DELTA_VARIANT: {
    spawn: [1000, false],
    attack: [1000, false],
    move: [2000, false]
  },
  OMICRON_VARIANT: {
    spawn: [500, false],
    attack: [500, false],
    move: [0, false]
  }
};

//Setup, vector is nessecary to rotate the player to the mouse
function setup() {
  createCanvas(800, 500);
  rectMode(CENTER);
  player.pos = createVector(width / 2, height / 2);
  player.weapon = player.weapons[0];
  frameRate(60);
  textAlign(CENTER);
  organizeInventory();
}

//Main control, basically just runs all the other functions which in turn run their own other functions
function draw() {
  if (inText == true) {
    return;
  }
  if (player.infoMode == 1 || player.infoMode == 2) {
    drawInfo();
    return;
  }
  if (gameOver == true) {
    spawnedEnemies = [];
    background(0);
    if (player.hp <= 0) {
      noLoop()
      push();
      fill(255);
      textSize(50);
      text("GAME OVER", 400, 250);
      textSize(15);
      text("Press any key to restart", 400, 275);
      pop();
    } else {
      push();
      stroke(255)
      strokeWeight(5)
      noFill()
      rect(400, 185, 300, 80)
      rect(400, 285, 300, 80)
      rect(400, 385, 300, 80)
      if (mouseX >= 250 && mouseX <= 550) {
        if (mouseY >= 185-40 && mouseY <= 185+40) {
          fill(255, 0, 0)
          rect(400, 185, 300, 80)
        } else {rect(400, 185, 300, 80)}
        noFill()
        if (mouseY >= 285-40 && mouseY <= 285+40) {
          fill(255, 0, 0)
          rect(400, 285, 300, 80)
        } else {rect(400, 285, 300, 80)}
        noFill()
        if (mouseY >= 385-40 && mouseY <= 385+40) {
          fill(255, 0, 0)
          rect(400, 385, 300, 80)
        } else {rect(400, 385, 300, 80)}
      }
      fill(255);
      noStroke()
      textSize(50);
      text("Start", 400, 200);
      text("How To Play", 400, 300)
      text("Quit Game", 400, 400)
      pop();
    }
    return;
  } else {
    cooldownManager();

    background("#ffa1c0");

    drawWalls();
    drawDoors();
    if (level[1] != 1) {
      push()
      stroke(0)
      fill(0, 255, 0)
      rectMode(CORNERS)
      rect(350, 485, 450, 500)
      pop()
    }
    drawLoot();
    //text(player.pos.x+" "+player.pos.y, 400, 400)
    drawPlayer();
    if (debugMode == true) {
      push();
      noStroke();
      fill(255, 0, 0);
      circle(player.pos.x, player.pos.y, 5);
      pop();
      push();
      noFill();
      stroke(255, 0, 0);
      rectMode(CORNERS);
      for (let enemy in ENEMIES) {
        rect(
          ENEMIES[enemy].spawnArea[0],
          ENEMIES[enemy].spawnArea[1],
          ENEMIES[enemy].spawnArea[2],
          ENEMIES[enemy].spawnArea[3]
        );
        text(
          str(enemy),
          (ENEMIES[enemy].spawnArea[0] + ENEMIES[enemy].spawnArea[2]) / 2,
          (ENEMIES[enemy].spawnArea[1] + ENEMIES[enemy].spawnArea[3]) / 2
        );
      }
      textAlign(LEFT)
      fill(0)
      noStroke()
      text("# of Bullets being processed: "+bulletNum+"\n# of Enemies on-screen: "+spawnedEnemies.length, 50, 470)
      pop();
    }
    let goalList = ""
    push()
    fill(0)
    textSize(25)
    textAlign(RIGHT)
    text("Level Goals:", 790, 420)
    textSize(15)
    for (var i = 0; i < GOALS.length; i++) {
      goalList = goalList+ GOALS[i][0]+": "+GOALS[i][1][0]+"/"+GOALS[i][1][1]+"\n"
    }
    text(goalList, 790, 450)
    pop()
    updatePlayer();
    AI()
    text(above, 400, 300)
  }
  if (displayTrophy == true && level[1] == 1) {
    trophy(300, 400)
  }
}

//Controls all the cooldowns and runs code every [interval].
function cooldownManager() {
  for (let item in cooldowns) {
    for (let interval in cooldowns[item]) {
      if (cooldowns[item][interval][1] != true) {
        cooldowns[item][interval][1] = true;
        setTimeout(function () {
          switch (interval) {
            case "bullet":
              if (keyIsDown(32) && player.weapon == "gun") {
                bulletNum++
                player.bullets.push(addBullet(player.pos.x, player.pos.y, player.angle, 0, 10, 10, 0.05));
              }
              break;
            case "knife":
              if (player.weapon == "knife" || player.weapon == "none") {
                if (keyIsDown(32)) {
                  stab();
                }
              }
              break;
            case "spawn":
              if (
                Object.keys(ENEMIES).length > 0 &&
                ENEMIES[item] != undefined && ENEMIES[item].complete != true
              ) {
                spawn(ENEMIES[item]);
              }
              break;
            case "attack":
              if (
                Object.keys(ENEMIES).length > 0 &&
                ENEMIES[item] != undefined && ENEMIES[item].complete != true
              ) {
                attack(ENEMIES[item]);
              }
              break;
            case "move":
              if (
                Object.keys(ENEMIES).length > 0 &&
                ENEMIES[item] != undefined && ENEMIES[item].complete != true
              ) {
                move(ENEMIES[item]);
              }
              break;
            default:
              break;
          }
          cooldowns[item][interval][1] = false;
        }, cooldowns[item][interval][0]);
      }
    }
  }
}

//Controls all the keyboard presses, but not player movement
function keyPressed() {
  if (keyIsDown(80) && keyIsDown(13)) {
    gameOver = true;
  }
  if (inText == true && keyIsDown(88)) {
    if (level[1] != 0) {
      LEVEL1[str(level[1])].dialogue = []
    }
    DIALOGUE = []
    loop()
    inText = false;
    loop();
  }
  if (gameOver == true && player.hp <= 0) {
    level = [1, 1];
    load();
    player.hp = 100;
    player.pos.x = width / 2;
    player.pos.y = height / 2;
    gameOver = false;
    loop();
  }
  //Change weapons with "3"
  if (keyIsDown(51)) {
    if (player.weapons.indexOf(player.weapon) == player.weapons.length - 1) {
      player.weapon = player.weapons[0];
    } else {
      player.weapon = player.weapons[player.weapons.indexOf(player.weapon) + 1];
    }
  }
  if (keyIsDown(49)) {
    if (debugMode == false) {
      debugMode = true;
    } else {
      debugMode = false;
    }
  }
  if (keyIsDown(67)) {
    if (gameOver == true) {return;}
    if (player.infoMode != 0) {
      player.infoMode = 0;
    } else {
      organizeInventory();
      player.infoMode = 1;
    }
  }
  //Shoot bullet
  if (keyIsDown(70)) {
    let lootPos = { x: 0, y: 0 };
    for (var i = 0; i < LOOT.length; i++) {
      lootPos.x = LOOT[i][0][0];
      lootPos.y = LOOT[i][0][1];
      if (
        player.pos.x >= lootPos.x - 12.5 &&
        player.pos.x <= lootPos.x + 12.5 &&
        player.pos.y >= lootPos.y - 12.5 &&
        player.pos.y <= lootPos.y + 12.5
      ) {
        if (
          player.inventory.length - player.inventory.count("----------") <
          player.space
        ) {
          addItem(LOOT[i]);
          LOOT.splice(i, 1);
        }
      }
    }
  }
}
