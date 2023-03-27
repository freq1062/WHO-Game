let level = [1, 3];

//Level data

function clearObj(object) {
  Object.keys(object).forEach((key) => delete object[key]);
}
/*lets go first enemy
const TEST_ENEMY = {
  name:"TEST_ENEMY",
  spawnArea: [0, 0, 25, 25],
  max: 5,
  shape: "SQUARE",
  size: 20,
  colour: [255, 0, 0],
  movement: "FOLLOW",
  attack: "MELEE",
  dmg: 5,
  hp: 20,
  speed: 1,
  loot: [
    ["TEST_ITEM", "COMMON"]
  ]
}*/

const BETA_VARIANT = {
  name: "BETA_VARIANT",
  spawnArea: [0, 0, 25, 25],
  max: 10,
  shape:"SQUARE",
  size: 15,
  colour: ["#006ba1"],
  movement: "RANDOM",
  attack: "BULLET_EXPLOSION",
  dmg: 2,
  hp: 100,
  speed: 0.5,
  complete:false,
  loot:[
    ["Powerful Antidote", "RARE", ["SPECIAL_EDIBLE", 50], 10],
    ["Mitochondria", "EPIC", ["SPEED", 8], 5],
    ["Protein Supplement", "UNCOMMON", ["EDIBLE", 50], 10],
    ["Supercharge", "EPIC", ["HEALTH_BOOST", 200], 5]
  ]
}

const DELTA_VARIANT = {
  name: "DELTA_VARIANT",
  spawnArea: [0, 0, 25, 25],
  max: 3,
  shape: "SQUARE",
  size: 25,
  colour: ["#c300ff"],
  movement: "RANDOM_TELEPORT",
  attack: "AIMED_SHOT",
  dmg: 25,
  hp: 50,
  speed: 0,
  complete: false,
  loot: [
    ["N95 Mask", "EPIC", ["ARMOR", 10], 5],
    ["Glucose Ball", "UNCOMMON", ["HEALTH_BOOST", 150], 25],
    ["Flagellum", "RARE", ["SPEED", 5], 15],
    ["Long Spike", "RARE", ["WEAPON_REACH", 50], 15],
    ["Membrane Piece", "COMMON", ["EDIBLE", 5], 90],
  ],
};

/*
const RHINOVIRUS = {
  name: "RHINOVIRUS",
  spawnArea: [0, 0, 25, 25],
  max: 10,
  size: 60,
  colour: 200,
  shape: "SQUARE",
  movement: "FOLLOW",
  attack: "AIMED_SHOT",
  dmg: 3,
  hp: 20,
  complete:false,
  speed:0.7,
  loot:[
    ["Cytoplasm Goo", "LEGENDARY", ["SPECIAL_EDIBLE", 100], 100]
  ],
}*/

const OMICRON_VARIANT = {
  name: "OMICRON_VARIANT",
  spawnArea:[0, 0, 25, 25],
  max:15,
  shape:"SQUARE",
  size: 20, 
  colour: ["#cf001c"],
  movement:"FOLLOW",
  attack: "MELEE",
  dmg: 5,
  hp: 200,
  complete:false,
  speed: 3,
  loot: [
    ["Hazmat Suit", "LEGENDARY", ["ARMOR", 50], 25],
    ["Long Spike III", "LEGENDARY", ["WEAPON_REACH", 100], 25]
  ]
}

const ALPHA_VARIANT = {
  name: "ALPHA_VARIANT",
  spawnArea: [0, 0, 25, 25],
  max: 3,
  shape: "SQUARE",
  size: 50,
  colour: ["#ffdd00"],
  movement: "FOLLOW",
  attack: "MELEE",
  dmg: 10,
  hp: 10,
  complete:false,
  speed: 0.5,
  loot: [
    ["Cloth Mask", "UNCOMMON", ["ARMOR", 5], 25],
    ["Sharp Spike", "RARE", ["WEAPON_DMG", 25], 2],
    ["Vitamin Supplement", "RARE", ["GUN_SPEED", 250], 2],
    ["Protein Piece", "COMMON", ["EDIBLE", 10], 40],
  ],
};
/*
Armor = dmg reduced by this much
Weapon_dmg = base damage increased by this much
weapon_reach = base reach increased by this much
speed = player speed increased by this much
health_boost = player total hp increased by this much
gun_speed = gun cooldown reduced by this much
gun_dmg = gun dmg increased by this much
edible = increases health by this much
special_edible = increases health by this much, but can go past player total health limit
bag = increases inventory space
*/
function load() {
  if (level[1] == 7) {
    displayTrophy = true;
  }
  noLoop();
  if (gameOver == true){
    player.pos.x = 400;
    player.pos.y = 450;    
  }
  WALLS = [];
  DOORS = [];
  clearObj(ENEMIES);
  spawnedEnemies = [];
  LOOT = [];
  DIALOGUE = [];
  GOALS = [];
  switch (level[0]) {
    case 1:
      let currentLevel = LEVEL1[str(level[1])];
      WALLS = currentLevel.walls;
      DOORS = currentLevel.doors;
      LOOT = currentLevel.loot;
      DIALOGUE = currentLevel.dialogue;
      GOALS = currentLevel.goals;
      if (currentLevel == undefined) {return;}
      for (var i = 0; i < currentLevel.enemies.length; i++) {
        if (currentLevel.enemies[i][0].complete == true) {continue;}
        ENEMIES[currentLevel.enemies[i][0].name] = currentLevel.enemies[i][0];
        ENEMIES[currentLevel.enemies[i][0].name].spawnArea =
          currentLevel.enemies[i][1];
      }
      break;
    default:
      DIALOGUE.push([
        0,
        "ERROR: stage not found(either that or this hasn't been made yet)",
      ]);
      gameOver = true
      break;
  }
  createDialogue();
}
/*
{walls: [[0,0,50,300],[750,0,800,300],[0,300,300,350],[400,300,800,350]]}
*/
//name 0 rarity 1 stats 2 position 3

//About the text including "~": I used this for dramatic pauses because i know i wont be using it anywhere else please dont think im an average discord mod lmao
/*
item examples:
      [[50, 50], "Cloth Mask", "UNCOMMON", ["ARMOR", 5]],
      [[50, 100], "Spike Blade", "RARE", ["WEAPON_DMG", 25]],
      [[100, 100], "Golgi Body", "LEGENDARY", ["GUN_SPEED", 50]],
      [[100, 50], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[100, 50], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[100, 50], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[100, 50], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[100, 50], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[150, 50], "N95 Mask", "EPIC", ["ARMOR", 10]],
      [[100, 150], "O2 Supplement", "UNCOMMON", ["SPECIAL_EDIBLE", 25]],
      [[50, 150], "Small Pouch", "COMMON", ["BAG", 12]],
      [[150, 150], "Antibody Ammo", "EPIC", ["GUN_DMG", 5]],
      [[150, 100], "Immune Booster", "RARE", ["HEALTH_BOOST", 150]],
*/

const LEVEL1 = {
  1: {
    walls: [
      [225, 200, 250, 500], 
      [525, 200, 550, 500],
      [250, 475, 525, 500],
      [250, 200, 350, 225],
      [425, 200, 525, 225],
      [275, 384, 361, 446],
    ],
    doors: [[350, 0, 450, 15]],
    enemies: [],
    loot: [
      [[278, 274], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[487, 432], "Protein Piece", "COMMON", ["EDIBLE", 10]], 
      [[445, 433], "Protein Piece", "COMMON", ["EDIBLE", 10]],
      [[484, 332], "Immune Booster I", "UNCOMMON", ["HEALTH_BOOST", 150]],
      [[297, 356], "Cloth Mask", "UNCOMMON", ["ARMOR", 5]],
      [[451, 255], "Dopamine Booster", "UNCOMMON", ["GUN_SPEED", 100]]
    ],
    dialogue: [
      [75, "Welcome!"],
      [50, "You've been selected as part of a test group by the WHO,~ testing a new COVID-19 treatment."],
      [25, "Instead of using medicine and ventilators, we've decided to try and use human-controlled nanobots to kill the things manually."],
      [25, "Along with the thousands of other players,~ we've already created a GUI and controls to make the process as enjoyable as possible - Although please don't mind the bad graphics, as this experiment is still in its developmental phase."],
      [25, "We've provided some equipment and items in the top left corner to make things easier. Use them wisely and pick up items with f. View and use them in your inventory using c, and check out your stats within the same menu."],
      [50, "Good luck!"]
    ], goals: [], complete:false
  },
  2: {
    walls: [
      [300, 100, 500, 125],
      [198, 161, 223, 428],
      [198, 428, 342, 453]
    ],
    doors: [
      [350, 0, 450, 15]
    ],
    enemies: [
      [ALPHA_VARIANT, [50, 50, 75, 75]]
    ],
    loot: [],
    dialogue: [
      [
        50,
        "Good to see you again!~ We have a few more things to say before you start blasting, but if you would like to skip this dialogue on any level press x.",
      ],
      [50, "Obviously we don't want our subjects to be just standing around, so in order to get to the next level you will need to destroy a certain number of viruses. After that, the door to the next assignment will open and the viruses will be contained."],
      [50, "That's all, go give it a shot!"]
    ],
    goals: [
      ["ALPHA_VARIANT", [0, 5]]
    ],complete:false
  },
  3: {
    walls: [
      [25, 115, 200, 140],
      [25, 315, 200, 340],
      [25, 115, 50, 340],
      [175, 115, 200, 220],
      [175, 240, 200, 315]
    ],
    doors: [[350, 0, 450, 15]],
    enemies: [
    ],
    loot: [
      [[89, 283],"N95 Mask", "RARE", ["ARMOR", 10]],
      [[156, 252],"Spike Blade II", "EPIC", ["WEAPON_DMG", 25]],
      [[71, 217],"Blade Extender II", "RARE", ["WEAPON_REACH", 30]],
      [[138, 180],"Cytoplasm Jelly", "UNCOMMON", ["EDIBLE", 25]],
      [[76, 179],"Cytoplasm Jelly", "UNCOMMON", ["EDIBLE", 25]],
      [[112, 226],"Cytoplasm Jelly", "UNCOMMON", ["EDIBLE", 25]],
      [[84, 185], "Golgi Body", "EPIC", ["GUN_SPEED", 25]],
      [[116, 201], "Antibody Ammo", "RARE", ["GUN_DMG", 25]]
    ],
    dialogue: [
      [
        50,
        "Great job there, but that was only the first variant and more of a training dummy than anything..",
      ],
      [50, "But now that that's over, it's time to start with the real deal."],
      [25, "Take some of this equipment before going into the next room - You'll need to upgrade your equipment! Also keep in mind that you can backtrack to places you've previously been to."]
    ], goals: [
    ],complete:false
  },
  4: {
    walls:[
      [100, 100, 125, 125],
      [100, 150, 125, 175],
      [100, 200, 125, 225],
      [100, 250, 125, 275],
      [150, 100, 175, 125],
      [150, 150, 175, 175],
      [150, 200, 175, 225],
      [150, 250, 175, 275],
      [200, 100, 225, 125],
      [200, 150, 225, 175],
      [200, 200, 225, 225],
      [200, 250, 225, 275],
      [250, 100, 275, 125],
      [250, 150, 275, 175],
      [250, 200, 275, 225],
      [250, 250, 275, 275],
    ],
    enemies: [
      [BETA_VARIANT, [50, 50, 250, 75]]
    ],
    doors: [[350, 0, 450, 15]],
    loot: [],
    dialogue: [],
    goals: [
      ["BETA_VARIANT", [0, 10]]
    ],
    complete:false
  },
  5: {
    walls:[],
    enemies:[
      [DELTA_VARIANT, [100, 100, 700, 400]]
    ],
    doors:[[350, 0, 450, 15]],
    loot:[],
    dialogue:[
      [50, "Alright, don't get your hopes up because on this test are the hardest enemies in the experiment."],
      [25, "You've proven yourself to be a master of aim and resource management, so do not give up!"]
    ],
    goals:[
      ["DELTA_VARIANT", [0, 20]]
    ]
  },
  6: {
    walls:[],
    enemies:[
      [OMICRON_VARIANT, [400, 50, 500, 150]]
    ],
    doors:[[350, 0, 450, 15]],
    loot:[],
    dialogue:[
      [25, "Alright, we've come to the last guys to beat. These viruses are the fast ones, they spread like wildfire but don't do a lot of damage."],
      [25, "Still, don't get overwhelmed! This is the last test of this experiment."]
    ],
    goals:[
      ["OMICRON_VARIANT", [0, 10]]
    ]
  },
  7: {
    walls:[],
    enemies: [],
    doors:[],
    loot:[
      [[400, 250], "FINISHED THE GAME", "LEGENDARY",["SPECIAL_EDIBLE", Infinity]],
      [[400, 275], "HAVE FUN", "LEGENDARY", ["GUN_SPEED", 0]]
    ],
    dialogue: [
      [25, "Thank you ~for participating in the WHO's disinfectant program."],
      [25, "You've completed all the objectives, and deserve a prize.~ Please step forward and claim our best weapon as a thanks for your service."]
    ],
    goals: [
      [":)", [0, 0]]
    ]
  }
};

///////////
