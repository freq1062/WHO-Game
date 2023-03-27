//FILE FOR CONTROLLING ALL ENEMIES

let spawnedEnemies = [];//List of all current enemies - contains their position, health, name(to collect data from loaded data), and bullet array

function getOccurrence(array, value) {//I needed to find how many of an enemy show up in spawnedEnemies so this returns that
  if (array.length == 0) {
    return 0;
  } else {
    return array.filter((v) => v === value).length + 1;
  }
}

async function attack(enemy) {//Based on the enemy's attack, runs the nessecary calculations - this function is run by the cooldown manager
  let type = "";
  let finalDmg = 0;
  for (var i = 0; i < spawnedEnemies.length; i++) {
    //if (cooldowns[ENEMIES[spawnedEnemies[i][0]].name].attack[1] != false) {return;}
    if (ENEMIES[spawnedEnemies[i][0]] == undefined) {;return}
    finalDmg = ENEMIES[spawnedEnemies[i][0]].dmg - player.defense;
    if (finalDmg <= 0) {
      finalDmg = 1;
    }
    if (finalDmg == undefined) {return;}
    if (enemy.attack == "MELEE") {
      if (
        dist(
          spawnedEnemies[i][1][0],
          spawnedEnemies[i][1][1],
          player.pos.x,
          player.pos.y
        ) <= 15 &&
        spawnedEnemies[i][0] == enemy.name
      ) {
        player.hp -= finalDmg;
      }
    } else if (enemy.attack == "AIMED_SHOT") {
      spawnedEnemies[i][3].push(addBullet(spawnedEnemies[i][1][0], spawnedEnemies[i][1][1], atan2(player.pos.y - spawnedEnemies[i][1][1], player.pos.x - spawnedEnemies[i][1][0]), [255, 0, 0], 8, 15, 0.01))
      bulletNum++
    } else if (enemy.attack == "BULLET_EXPLOSION") {
      for (var j = 0; j < 6; j++) {
        spawnedEnemies[i][3].push(addBullet(spawnedEnemies[i][1][0], spawnedEnemies[i][1][1], j+1*60, [255, 0, 0], 8, 5, 0))
        bulletNum++
      }
    }
  }
}

function move(enemy) {//Same idea as the attack function but for move
  let data;
  for (var i = 0; i < spawnedEnemies.length; i++) {
    data = ENEMIES[spawnedEnemies[i][0]];
    if (data == undefined) {return;}
    //if (cooldowns[data.name].move[1] != false) {return;}
    current = spawnedEnemies[i]
    if (data.movement == "FOLLOW") {
      let x = player.pos.x;
      let y = player.pos.y;
      let distances = getDistances(current[1][0], current[1][1]);

      if (
        x >= current[1][0] &&
        distances.right >= current[1][0] + data.size / 2
      ) {
        current[1][0] += data.speed;
      } else if (
        x <= current[1][0] &&
        distances.left <= current[1][0] - data.size / 2
      ) {
        current[1][0] -= data.speed;
      }

      if (
        y >= current[1][1] &&
        distances.down >= current[1][1] + data.size / 2
      ) {
        current[1][1] += data.speed;
      } else if (
        y <= current[1][1] &&
        distances.up <= current[1][1] - data.size / 2
      ) {
        current[1][1] -= data.speed;
      }
      round(current[1][0]);
      round(current[1][1]);
    }
    else if (data.movement == "RANDOM_TELEPORT") {
      current[1][0] = round(random(50, 750));
      current[1][1] = round(random(50, 450));
    } 
    else if (data.movement == "RANDOM") {
      let distances = getDistances(current[1][0], current[1][1]);
      let direction = random([1, 2, 3, 4])
      for (var j = 0; j < round(random(0, 50)); j++) {
        if (direction == 1) {
          if (distances.right >= current[1][0] + data.size / 2){
            current[1][0]+=data.speed;
          }
        } else if (direction == 2) {
          if (distances.left <= current[1][0] - data.size / 2){
            current[1][0]-=data.speed;
          }
        } else if (direction == 3) {
          if (distances.down >= current[1][1] + data.size / 2) {
            current[1][1]+=data.speed;
          }
        } else if (direction == 4) {
          if (distances.up <= current[1][1] - data.size / 2) {
            current[1][1]-=data.speed;
          }
        }
      }
    }
  }

}

function AI() {//Kind of a general control function, but currently runs all the enemy attacks
  if (spawnedEnemies.length <= 0 || ENEMIES.length <= 0) {
    return;
  }
  let current = "";
  let data = "";
  for (var i = 0; i < spawnedEnemies.length; i++) {
    if (ENEMIES[spawnedEnemies[i][0]] == true) {
      drop(i)
      //spawnedEnemies.splice(i, 1)
      continue;
    }
    current = spawnedEnemies[i];
    data = ENEMIES[spawnedEnemies[i][0]];
    //if (cooldowns[data.name].move[1] == true) {return;}
    drawEnemy(data, current[1][0], current[1][1], current[1][2]);
    //draw the enemy
    for (var j = 0; j < current[3].length; j++) {
      if (data == undefined) {return;}
      updateBullet(current[3][j], true, data.dmg, i);
      drawBullet(current[3][j]);
    }
  }
}

function drawEnemy(enemyData, x, y, hp) {//Draws all the enemies based on their position and shape/colour data
  if (enemyData == undefined) {return;}
  if (enemyData.shape == "SQUARE") {
    push();
    rectMode(CENTER);
    fill(enemyData.colour);
    stroke(0);
    rect(x, y, enemyData.size);
    fill(0);
    noStroke();
    text(hp, x, y - enemyData.size / 2 - 15);
    pop();
  }
  /*
  push()
  fill(255, 0, 0)
  circle(x, y, 10)
  pop()
  */
}

function drop(i) {//When an enemy dies this controls what they drop based on data
  for (var j = 0; j < spawnedEnemies[i][2].length; j++) {
    randomNum = round(random(0, 100));
    if (randomNum <= spawnedEnemies[i][2][j][3]) {
      lootPos = [
        spawnedEnemies[i][1][0] + random(-25, 25),
        spawnedEnemies[i][1][1] + random(-25, 25),
      ];
      LOOT.push([
        lootPos,
        spawnedEnemies[i][2][j][0],
        spawnedEnemies[i][2][j][1],
        spawnedEnemies[i][2][j][2],
        spawnedEnemies[i][2][j][3],
      ]);
    }
  }
  spawnedEnemies.splice(i, 1);
}

function spawn(enemy) {
  let names = [];
  for (var i = 0; i < spawnedEnemies.length; i++) {
    names.push(spawnedEnemies[i][0]);
  }
  if (
    getOccurrence(names, str(enemy.name)) <= enemy.max &&
    spawnedEnemies.length <= 15
  ) {
    spawnedEnemies.push([
      enemy.name,
      [
        random(enemy.spawnArea[0], enemy.spawnArea[2]),
        random(enemy.spawnArea[1], enemy.spawnArea[3]),
        enemy.hp,
      ],
      enemy.loot,
      []//array for bullet objects
    ]);
  }
}
//spawnedEnemies: [[name, [x, y, hp]]]
