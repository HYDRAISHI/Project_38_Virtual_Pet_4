var dog,dogImg, happyDog, database, foodS, foodStock;
var button1, button2;
var fedTime;
var foodObj;
var lastFed;
var gameState, readState;
var bedroom, garden, washroom, livingroom;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  washroom = loadImage("images/washroom.png");
  bedroom = loadImage("images/bedroom.png");
  garden = loadImage("images/garden.png");
  livingroom = loadImage("images/Living Room.png")
}

function setup() {
	createCanvas(1000, 800);
  dog = createSprite(600, 350);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  readState = database.ref('gameState');
  readState.on("value", function(data){
  gameState = data.val();

  foodObj = new Food(foodStock,lastFed);

})
  
}


function draw() {  
  background("yellow");

  button1 = createButton("Feed The Dog");
  button1.position(500,95);
  button1.mousePressed(feedDog);

  button2 = createButton("Add Food");
  button2.position(600,95);
  button2.mousePressed(addFoods);
  //text("Press Up Arrow Key To Feed Your Dog Drago Milk", 125, 100);
  text("Food Left : " + foodS, 125, 130);
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  if(lastFed>=12){
    text("Last Feed " + lastFed%12 + " PM", 350,30);
  }
  else if(lastFed === 0){
    text("Last Feed : 12 AM", 350,30);
  }
  else{
    text("Last Feed : " + lastFed + " AM", 350,30);
  }

  /*
  currentTime = hour()
    if(currentTime == (lastFed + 1)){
      update("playing");
      foodObj.garden();
    }
    else if(currentTime == (lastFed + 2)){
      update("Sleeping");
      foodObj.bedroom();
    }
    else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
      update("Bathing");
      foodObj.washroom();
    }
    else{
      update("Hungry");
      foodObj.display();
      dog.visible = true;
    }
  
  
  
  if(gameState != "Hungry"){
    button1.hide();
    button2.hide();
  }
  else{
    button1.show();
    button2.show();
    dog.addImage(dogImg);
  }
  */
  if(foodS == 0){
    
    dog.addImage(dogImg);
    foodS = 20;
  
  }  

  if(gameState === 1){
    dog.addImage(happyDog);
    dog.y = 250;
  }

  if(gameState === 2){
    dog.addImage(dogImg);
    dog.y = 250;
  }

  var bath = createButton("I WANT TO TAKE A BATH");
  bath.position(540,125);
  if(bath.mousePressed(function(){
    gameState = 3;
    database.ref('/').update({'gameState' : gameState});
    
  }));
  if(gameState === 3){
      dog.addImage(washroom);
      dog.scale = 2.5;
      foodObj.visible = false;
  }

  var sleep = createButton("I AM VERY SLEEPY");
  sleep.position(710, 125);

  if(sleep.mousePressed(function(){
    gameState = 4;
    database.ref('/').update({'gameState' : gameState});
  }));

  if(gameState === 4){
    dog.addImage(bedroom);
    dog.scale = 2.5;
    foodObj.visible = false;
  }

  var play = createButton("I WANT TO PLAY");
  play.position(570, 155);

  if(play.mousePressed(function(){
    gameState = 5;
    database.ref('/').update({'gameState' : gameState});
  }));

  if(gameState === 5){
    dog.addImage(livingroom);
    dog.scale = 2.5;
    foodObj.visible = false;
  }

  var playOut = createButton("I WANT TO PLAY OUTSIDE");
  playOut.position(690, 155);

  if(playOut.mousePressed(function(){
    gameState = 6;
    database.ref('/').update({'gameState' : gameState});
  }));

  if(gameState === 6){
    dog.addImage(garden );
    dog.scale = 2.5;
    dog.y = -50;
    foodObj.visible = false;
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  //foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  database.ref('/').update({
    'Food':x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
    database.ref('/').update({
    gameState:state
  })
}

