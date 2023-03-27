//Player object
let player = {
  pos: "",
  weapons: ["gun", "knife", "none"],
  weapon: "",
  hp: 100,
  defense: 0,
  totalHp: 100,
  inventory: [],
  equipped: {
    ARMOR: "NONE",
    WEAPON_DMG: "NONE",
    WEAPON_REACH: "NONE",
    SPEED: "NONE",
    HEALTH_BOOST: "NONE",
    BAG: "NONE",
    GUN_DMG: "NONE",
    GUN_SPEED: "NONE",
  },
  infoMode: 0, //0 = not activated, 1 = inventory, 2 = stats
  angle: 0,
  speed: 3,
  bullets: [],
  gun_dmg: 1,
  weapon_dmg: 5,
  knifeLimit: [18 + 25, 12],
  knifePos: [18, 12],
  reach: 25,
  space: 10,
};

//Draws player and weapons
function drawPlayer() {
  if (gameOver == true) {return;}
  push();
  translate(player.pos.x, player.pos.y);
  rotate(player.angle);
  stroke(0);
  fill("#ffe600");
  ellipse(0, 0, 30);
  switch (player.weapon) {
    case "gun":
      push();
      fill("#2e2e2e")
      rect(30, 0, 30, 5);
      ellipse(15, 0, 12);
      ellipse(30, 5, 12);
      pop();
      break;
    case "knife":
      push();
      fill("#2e2e2e")
      rect(
        player.knifePos[0] + player.reach / 2,
        player.knifePos[1],
        player.reach,
        5
      );
      ellipse(player.knifePos[0] - 4, 12, 12);
      ellipse(12, -12, 12);
      fill(255, 0, 0);
      pop();
      break;
    case "none":
      push();
      fill("#2e2e2e")
      ellipse(player.knifePos[0] - 4, 12, 12);
      ellipse(12, -12, 12);
      pop();
      break;
    default:
      break;
  }
  pop();
}

//You can punch people and also runs drop() if enemies are killed, completedGoals(), etc. Occasionally the enemy freezes up at 0hp for some reason but it seems to be lag based because I can't replicate the error consistently.
async function stab() {
  let hit = false;
  let offset = 0;
  if (player.knifePos[0] > 18) {
    return;
  }
  for (var i = 0; i < 50; i++) {
    if (hit == false) {
      for (var j = 0; j < spawnedEnemies.length; j++) {
        if (
          dist(
            player.pos.x +
              player.knifeLimit[0] * cos(player.angle) -
              12 * sin(player.angle),
            player.pos.y +
              player.knifeLimit[0] * sin(player.angle) +
              12 * cos(player.angle),
            spawnedEnemies[j][1][0],
            spawnedEnemies[j][1][1]
          ) <= 25
        ) {
          if (player.weapon == "none") {
            spawnedEnemies[j][1][2] -= 1;
          } else if (player.weapon == "knife") {
            spawnedEnemies[j][1][2] -= player.weapon_dmg;
          }
          if (spawnedEnemies[j][1][2] <= 0) {
            spawnedEnemies[j][1][2] = 0
            if (spawnedEnemies[i] != undefined) {
              let target = spawnedEnemies[j];
              drop(j);
              completedGoals(ENEMIES[target[0]])
            }
          }
          hit = true;
        }
      }
    }

    player.knifeLimit[0] = player.knifePos[0] + player.reach;
    if (i >= 25) {
      player.knifePos[0] -= 1;
    } else {
      player.knifePos[0] += 1;
    }
    await delay(1);
  }
  player.knifePos[0] = 18;
}

function updatePlayer() {//Controls movements, player collision, and guns/attacks
  push();
  if (player.hp <= player.totalHp) {
    fill(0);
  } else {
    fill(0, 255, 0);
  }
  text(player.hp + "/" + player.totalHp, player.pos.x, player.pos.y - 35);
  pop();
  if (player.bullets.length != 0) {
    for (var i = 0; i < player.bullets.length; i++) {
      updateBullet(player.bullets[i], false, player.gun_dmg, null);
      drawBullet(player.bullets[i]);
    }
  }
  if (
    keyIsDown(65) &&
    player.pos.x >= 0 &&
    getDistances(player.pos.x, player.pos.y).left <= player.pos.x - 10
  ) {
    player.pos.x += -player.speed;
  }

  if (
    keyIsDown(68) &&
    player.pos.x <= 800 &&
    getDistances(player.pos.x, player.pos.y).right >= player.pos.x + 10
  ) {
    player.pos.x += player.speed;
  }

  if (
    keyIsDown(87) &&
    getDistances(player.pos.x, player.pos.y).up <= player.pos.y - 10
  ) {
    player.pos.y += -player.speed;
  }
  
  if (player.pos.y >= 485 && player.pos.x >= 350 && player.pos.x <= 450) {
    switch(level[0]) {
      case 1:
        if (level[1] > 1) {
          level[1] --;
          load()
          player.pos.y = 20;
          loop()
        }
        break;
      default:
        break;
    }
  }

  if (
    keyIsDown(83) &&
    getDistances(player.pos.x, player.pos.y).down >= player.pos.y + 10
  ) {
    player.pos.y += player.speed;
  }
  if (player.hp <= 0) {
    gameOver = true;
  }
  player.angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x);
}

function addItem(item) {//Adds item to inventory
  //organizeInventory();
  if (player.inventory.includes("----------")) {
    //player.inventory.push(item)
    for (var i = 0; i < player.inventory.length; i++) {
      if (player.inventory[i] == "----------") {
        player.inventory[i] = item;
        break;
      }
    }
    //player.inventory[player.inventory.length - 1] = item;
    //organizeInventory();
    return;
  }
  return;
}

function drawButtons(buttonPos, col) {//Draws buttons for dropping and equipping in the inventory
  let trueFalse = false;
  push();
  stroke(col);
  rectMode(CORNERS);
  if (
    mouseX >= buttonPos[0] &&
    mouseX <= buttonPos[2] &&
    mouseY >= buttonPos[1] &&
    mouseY <= buttonPos[3]
  ) {
    fill(col);
    if (mouseIsPressed) {
      trueFalse = true;
    } else {
      trueFalse = false;
    }
  } else {
    fill(255);
    trueFalse = false;
  }
  rect(buttonPos[0], buttonPos[1], buttonPos[2], buttonPos[3]);
  pop();
  return trueFalse;
}

function equip(prop, stat, item) {//Equip and apply the nessecary stats to the player, then remove the item from the players inventory and replaces it(if needed) with what's currently equipped in that slot
  let addToInventory = [];
  if (player.equipped[prop] == "NONE") {
    player.equipped[prop] = item;
    if (prop == "GUN_SPEED") {
      cooldowns.player.bullet[0] = int(item[3][1]);
    } else {
      player[stat] = int(item[3][1]);
    }
  } else {
    addToInventory = player.equipped[prop];
    player.equipped[prop] = item;
    if (player.inventory.includes("----------")) {
      addItem(addToInventory);
    } else {
      LOOT.push(addToInventory);
      LOOT[LOOT.indexOf(addToInventory)][0][0] = player.pos.x+round(random(-25, 25));
      LOOT[LOOT.indexOf(addToInventory)][0][1] = player.pos.y+round(random(-25, 25));
      //addItem(addToInventory)
    }
    if (prop == "GUN_SPEED") {
      cooldowns.player.bullet[0] = int(item[3][1]);
    } else {
      player[stat] = int(item[3][1]);
    }
  }
}

function use() {//Use an item, goes before equip()
  if (player.infoMode == 0 || player.infoMode == 2) {
    return;
  }
  let stat = 0;
  for (var i = 0; i < player.inventory.length; i++) {
    if (player.inventory[i] == "----------") {
      continue;
    }
    stat = int(player.inventory[i][3][1]);
    if (drawButtons([750, 90 + i * 18, 775, 108 + i * 18], [0, 255, 0])) {
      switch (player.inventory[i][3][0]) {
        case "ARMOR":
          equip("ARMOR", "defense", player.inventory[i]);
          break;
        case "WEAPON_DMG":
          equip("WEAPON_DMG", "weapon_dmg", player.inventory[i]);
          break;
        case "WEAPON_REACH":
          equip("WEAPON_REACH", "reach", player.inventory[i]);
          break;
        case "SPEED":
          equip("SPEED", "speed", player.inventory[i]);
          break;
        case "HEALTH_BOOST":
          equip("HEALTH_BOOST", "totalHp", player.inventory[i]);
          break;
        case "GUN_SPEED":
          equip("GUN_SPEED", "gun_speed", player.inventory[i]);
          break;
        case "GUN_DMG":
          equip("GUN_DMG", "gun_dmg", player.inventory[i]);
          break;
        case "EDIBLE":
          if (player.hp + stat >= player.totalHp) {
            player.hp = player.totalHp;
          } else {
            player.hp += stat;
          }
          break;
        case "SPECIAL_EDIBLE":
          player.hp += stat;
          break;
        case "BAG":
          equip("BAG", "space", player.inventory[i]);
          break;
        default:
          console.log("Unknown effect for " + player.inventory[i][3][0]);
          break;
      }
      drawPlayer()
      player.inventory[i] = "----------";
      return;
    } else if (drawButtons([775, 90 + i * 18, 800, 108 + i * 18], [255, 0, 0])) {
      let item = [[player.pos.x+random(-10, 10), player.pos.y+random(-10, 10)], player.inventory[i][1], player.inventory[i][2], player.inventory[i][3]]
      LOOT.push(item)
      drawLoot()
      player.inventory[i] = "----------"
    }
  }
}

function organizeInventory() {//Puts everything at the start of the inventory
  let prevInventory = [];
  for (var i = 0; i < player.inventory.length; i++) {
    if (player.inventory[i] != "----------") {
      prevInventory.push(player.inventory[i]);
    }
  }
  player.inventory = [];
  for (var j = 0; j < player.space; j++) {
    if (j < prevInventory.length) {
      player.inventory.push(prevInventory[j]);
    } else {
      player.inventory.push("----------");
    }
  }
}

function drawInfo() {//Draws the inventory and stats
  if (player.infoMode == 0) {
    return;
  }
  push();
  fill(0);
  noStroke();
  rectMode(CORNERS);
  rect(400, 0, 800, 500);
  pop();
  if (player.infoMode == 1) {
    push();
    let content = "";
    fill(255);
    for (var i = 0; i < player.inventory.length; i++) {
      if (player.inventory[i] != "----------") {
        content = content+player.inventory[i][1]+"("+player.inventory[i][3][0]+": "+player.inventory[i][3][1]+")\n"
      } else {
        content = content + "(Empty)\n"
      }
    }
    textSize(50);
    text("INVENTORY", 600, 50);
    textSize(15);
    textAlign(LEFT);
    text(content, 425, 100);
    pop();
    use();
  } else if (player.infoMode == 2) {
    let playerEquipped = "";
    push();
    fill(255);
    textSize(50);
    text("STATS", 600, 50);
    textSize(20);
    text(
      "Armor: " +
        player.defense +
        "\nWeapon Stats: " +
        player.weapon_dmg +
        " " +
        player.reach +
        "\nSpeed: " +
        player.speed +
        "\nGun Stats: " +
        player.gun_dmg +
        " " +
        cooldowns.player.bullet[0] +
        "\nBag Space: " +
        player.inventory.length +
        "/" +
        player.space,
      600,
      100
    );
    for (let prop in player.equipped) {
      if (player.equipped[prop] == "NONE") {
        playerEquipped = playerEquipped + prop + ": " + "NONE\n";
      } else {
        playerEquipped =
          playerEquipped + prop + ": " + player.equipped[prop][1] + "\n";
      }
    }
    text(playerEquipped, 600, 250);
    pop();
  }
  push();
  fill(255);
  rectMode(CORNERS);
  rect(425, 25, 450, 50);
  pop();
}

Object.defineProperties(Array.prototype, {
  count: {
    value: function (query) {
      /* 
               Counts number of occurrences of query in array, an integer >= 0 
               Uses the javascript == notion of equality.
            */
      var count = 0;
      for (let i = 0; i < this.length; i++) if (this[i] == query) count++;
      return count;
    },
  },
});

function mousePressed() {//Controls all the mouse inputs
  if (gameOver == true && player.hp >0 && inText == false) {
    //loop()
    if (mouseX >= 250 && mouseX <= 550) {
      if (mouseY >= 185-40 && mouseY <= 185+40) {
        loop();
        gameOver = false;
        level = [1, 1]
        load()
        loop();
        return;
      } else if (mouseY >= 285-40 && mouseY <= 285+40) {
        clear()
        background(0)
        DIALOGUE =[
          [10, "INSTRUCTIONS\nProgress through each level by defeating a required amount of enemies. This will be displayed at the bottom right corner, under 'LEVEL GOALS'."],
          [10, "CONTROLS\nMove - WASD | Attack/Shoot - Spacebar | Inventory/Stats - 'c' | Progress Dialogue - 'z' | Skip Dialogue - 'x' | Swap weapons - '3' | Pick up item - 'f' | Debug Mode - '1' |"],
          [10, "ITEMS\nEach item has a different rarity(represented by its colour) and function(indicated after you pick it up)."],
          [10, "RARITY INDICATORS\nCommon: Grey | Uncommon: Lime | Rare: Red | Epic: Blue | Legendary: Purple |"],
          [10, "ITEM FUNCTIONS[1/2]\nARMOR = damage reduced | WEAPON_DMG = stabbing damage increased | WEAPON_REACH = knife reach increased | SPEED = speed increased"],
          [10, "ITEM FUNCTIONS[2/2]\nHEALTH_BOOST = total hp increased | GUN_SPEED = gun cooldown reduced | GUN_DMG = bullet damage increased | EDIBLE = adds to health | SPECIAL_EDIBLE = adds to health, can go past total hp | BAG = increases inventory space"]
        ]
        gameOver = true
        createDialogue()
        loop()
      } else if (mouseY >= 385-40 && mouseY <= 385+40) {
        noLoop()
        remove()
      }
    }
  }
  //425, 25, 450, 50
  if (mouseX >= 425 && mouseX <= 450 && mouseY >= 25 && mouseY <= 50) {
    if (player.infoMode == 1) {
      player.infoMode = 2;
    } else {
      player.infoMode = 1;
    }
  }
  if (LOOT.length <= 0) {
    return;
  }
}
