//FILE FOR CONTROLLING ALL THE BULLETS
function drawBullet(bullet) {//Draws all the bullets
  //bullet = player.bullets[index]
  if (bullet == undefined) {
    return;
  }
  push();
  fill(bullet.colour);
  circle(
    bullet.x + 15 * cos(bullet.angle),
    bullet.y + 15 * sin(bullet.angle),
    bullet.size
  );
  pop();
}

function hitAnEnemy(x, y, targetPlayer, dmg) {//Detects if a player's bullet hit an enemy/an enemy's bullet hit the player and applies the nessecary damage
  let finalArray = [];
  let randomNum = 0;
  let lootPos = [];
  if (targetPlayer == false) {
    for (var i = 0; i < spawnedEnemies.length; i++) {
      if (spawnedEnemies[i][0] == undefined) {continue;}
      if (Object.keys(ENEMIES).length <=0) {return;}
      if (
        dist(x, y, spawnedEnemies[i][1][0], spawnedEnemies[i][1][1]) <=
        ENEMIES[spawnedEnemies[i][0]].size
      ) {
        spawnedEnemies[i][1][2] -= dmg;
        if (spawnedEnemies[i][1][2] <= 0) {
          completedGoals(ENEMIES[spawnedEnemies[i][0]])
          //}
          drop(i);
        }
        return true;
      }
    }
  } else {
    if (dist(x, y, player.pos.x, player.pos.y) <= 15) {
      player.hp -= dmg;
      return true;
    }
  }

  return false;
}

function hitAWall(x, y) {//Detects if any bullet hit a wall and if so removes the bullet
  let hit = false;
  for (var i = 0; i < WALLS.length; i++) {
    if (
      (x >= WALLS[i][0] &&
        x <= WALLS[i][2] &&
        y >= WALLS[i][1] &&
        y <= WALLS[i][3]) ||
      x >= 800 ||
      x <= 0 ||
      y >= 500 ||
      y <= 0
    ) {
      return true;
    }
  }
  return false;
}

function updateBullet(bullet, targetP, DMG, source) {//Moves the bullet and runs the previous bullet collision detectors
  //bullet = player.bullets[index]
  if (
    hitAWall(bullet.x, bullet.y) ||
    hitAnEnemy(bullet.x, bullet.y, targetP, DMG) ||
    bullet.x >= 800 ||
    bullet.x <= 0 ||
    bullet.y >= 500 ||
    bullet.y <= 0 ||
    bullet.counter >= 500
  ) {
    if (targetP == true) {
      spawnedEnemies[source][3].splice(bullet, 1);
    } else {
      player.bullets.splice(bullet, 1);
    }
    bulletNum--;
  } else {
    //print(bullet)
    bullet.counter += 1;
    bullet.x += bullet.speed * cos(bullet.angle);
    bullet.y += bullet.speed * sin(bullet.angle);
  }
}

function addBullet(originX, originY, turnAngle, col, siz, spd, aimLevel) {//Returns a "bullet object" and is pretty much a poor man's class
  return {
    x: originX,
    y: originY,
    angle: turnAngle + random(-aimLevel, aimLevel),
    colour: col,
    size: siz,
    speed: spd,
    counter: 0,
  };
}
