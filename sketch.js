var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var play,bath,sleep,eat;
var milk,milkBottle1;
var gameState = 1;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png");
bedroom=loadImage("Bed Room.png");
milkBottle1 = loadImage("milk.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  eat = createButton("eat");
  sleep = createButton("sleep");
  bath = createButton("bath");
  play = createButton("play");

  eat.position(605,150);
  sleep.position(650,150);
  bath.position(770,120);
  play.position(720,120);

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(520,120);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(630,120);
  addFood.mousePressed(addFoods);

  
}

function draw() {


  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   textSize(13);
   fill("black");
   text("Long Press UP_ARROW KEY To Feed Your Dog Mukku",10,15);

   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
   if(gameState === 1){
     dog.addImage(happyDog);
     dog.scale=0.175;
     dog.y = 250;
   }
   if(gameState === 2){
     dog.addImage(sadDog);
     dog.scale = 0.175;
     dog.milkBottle1.visible = "false";
     dog.y = 250;
   }
 if(bath.mousePressed(function(){
   gameState=3;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===3){
   dog.addImage(washroom);
   dog.scale=1;
   milkBottle1.visible=false;
 }
 if(sleep.mousePressed(function(){
   gameState = 4;
   database.ref('/').update({'gameState':gameState})
 }))
 if(gameState === 4){
   dog.addImage(bedroom)
   milkBottle1.visible="false";
 }
 if(play.mousePressed(function(){
   gameState=5;
   database.ref('/').update({'gameState':gameState})
 }))
 if(gameState === 5){
   dog.addImage(garden);
   milkBottle1.visible="false";
 }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}