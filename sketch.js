var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var obstaclesGroup, obstacle1;
var score = 0;
var gameOver, restart;

function preload() {
  man_running = loadAnimation(
    "assets/aa.png",
    "assets/bb.png",
    "assets/cc.png",
    "assets/dd.png"
  );
  man_collided = loadAnimation("assets/cc.png");
  bgImage = loadImage("assets/bgg.webp");
  coin1 = loadImage("assets/coin1.png");
  coin2 = loadImage("assets/coin2.png");
  coin3 = loadImage("assets/coin3.png");
  obstacle1 = loadImage("assets/hurdle.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  powerUpSound = loadSound("assets/powerupp.mp3");
  winSound = loadSound("assets/win.mp3");
}

function setup() {
  createCanvas(800, 400);

  bg = createSprite(400, 100, 400, 20);
  bg.addImage("bg", bgImage);
  bg.scale = 0.3;
  bg.x = width / 2;

  man = createSprite(50, 200, 20, 50);
  man.addAnimation("running", man_running);
  man.addAnimation("collided", man_collided);
  man.scale = 0.15;
  man.setCollider("circle", 0, 0, 300);

  invisibleGround = createSprite(400, 350, 1600, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(400, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(550, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  coinsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(255);

  man.x = camera.position.x - 270;

  if (gameState === PLAY) {
    bg.velocityX = -3;

    if (bg.x < 200) {
      bg.x = 550;
    }
    console.log(man.y);
    if (keyDown("space") && man.y > 270) {
      jumpSound.play();
      man.velocityY = -16;
    }

    man.velocityY = man.velocityY + 0.8;
    spawncoins();
    spawnObstacles();

    man.collide(invisibleGround);

    if (obstaclesGroup.isTouching(man)) {
      collidedSound.play();
      gameState = END;
    }
    if (coinsGroup.isTouching(man)) {
      powerUpSound.play();
      score = score + 1;
      coinsGroup.destroyEach();
    }
  } else if (gameState === END) {
    gameOver.x = camera.position.x;
    restart.x = camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    man.velocityY = 0;
    bg.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    man.changeAnimation("collided", man_collided);
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  } else if (gameState === WIN) {
    winSound.stop();
    bg.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    man.changeAnimation("collided", man_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
  }

  drawSprites();

  textSize(20);
  stroke(3);
  fill("black");
  text("Score: " + score, camera.position.x, 50);

  if (score >= 8) {
    man.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congratulations!! You win the game!! ", 70, 200);
    winSound.play();
    gameState = WIN;
  }
}

function spawncoins() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var coin = createSprite(camera.position.x + 500, 330, 40, 10);

    coin.velocityX = -(6 + (3 * score) / 100);
    coin.scale = 0.6;

    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        coin.addImage(coin1);
        break;
      case 2:
        coin.addImage(coin2);
        break;
      case 3:
        coin.addImage(coin3);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the coin
    coin.scale = 0.05;
    //assign lifetime to the variable
    coin.lifetime = 400;

    coin.setCollider("rectangle", 0, 0, coin.width / 2, coin.height / 2);
    //add each coin to the group
    coinsGroup.add(coin);
  }
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {
    var obstacle = createSprite(camera.position.x + 400, 330, 40, 40);
    obstacle.setCollider("rectangle", 0, 0, 200, 200);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + (3 * score) / 100);
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle

    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
 
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  man.visible = true;
  man.changeAnimation("running", man_running);
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  score = 0;
}
