function removeNode(array,node){
  for( var i = array.length-1; i>= 0; i--){
    if(array[i] == node){
      array.splice(i,1);
    }
  }
}

function heuristic(a, b){
  var distance = dist(a.i, a.j, b.i, b.j);
  return distance;
}

var columns = 40;
var lines = 40;
var grid = new Array(columns);

var Open = [];
var Closed = [];
var startNode;
var endNode;
var width, height;
var path = [];


function No(i,j)
{
  this.i = i;
  this.j = j;
  this.f =0;
  this.g =0;
  this.h =0;
  this.neighbours = [];
  this.parent = undefined;
  this.obstacle = false;

  if(random(1) < 0.30)
  {
    this.obstacle = true;
  }

  this.show = function(col)
  {
    fill(col);
    if(this.obstacle){
      fill(0);
    }
    noStroke();
    rect(this.i * width, this.j * height, width, height);
  }

  this.addneighbours = function(grid){
    var i = this.i;
    var j = this.j;

    if(i<columns-1)  {
      this.neighbours.push(grid[i+1][j]);
    }
    if(i>0){
      this.neighbours.push(grid[i-1][j]);
    }
    if(j<lines-1){
      this.neighbours.push(grid[i][j+1]);
    }
    if(j>0){
      this.neighbours.push(grid[i][j-1]);
    }
    // diagonais
    if(j>0 && i>0){
      this.neighbours.push(grid[i-1][j-1]);
    }
    if(j>0 && i<columns-1){
      this.neighbours.push(grid[i+1][j-1]);
    }
    if(j<lines-1 && i>0){
      this.neighbours.push(grid[i-1][j+1]);
    }

    if(j<lines-1 && i <columns-1){
      this.neighbours.push(grid[i+1][j+1]);
    }
  }

}

function setup() {
  createCanvas(400,400);
  console.log('A*');

  width = width / columns;
  height = height / lines;

  for (var i = 0;i < columns; i++){
    grid[i] = new Array(lines);
  }
  for (var i = 0;i < columns; i++){
    for(var j =0; j< lines;j++){
      grid[i][j] = new No(i,j);
    }
  }

  for (var i = 0;i < columns; i++){
    for(var j =0; j< lines;j++){
      grid[i][j].addneighbours(grid);
    }
  }

  startNode = grid[0][0];
  startNode.obstacle=false;
  endNode = grid[columns-1][lines-1];
  endNode.obstacle=false;

  Open.push(startNode);
  console.log(grid);
}


function draw() {
  if (Open.length > 0){

    var smallNeighbor = 0;
    for(var i =0; i<Open.length;i++){
      if(Open[i].f < Open[smallNeighbor].f){
        smallNeighbor = i;
      }
    }

    var currentNode = Open[smallNeighbor];

    if (currentNode === endNode){

      noLoop();
      console.log("Solution!");
    }

    removeNode(Open,currentNode);
    Closed.push(currentNode);

    var neighbours = currentNode.neighbours;
    for(var i =0; i<neighbours.length;i++){
      var currentNeighbor = neighbours[i];

      if(!Closed.includes(currentNeighbor) && !currentNeighbor.obstacle){
        var tempG = currentNode.g + heuristic(currentNeighbor,currentNode);

        var isBest = false;
        if(Open.includes(currentNeighbor)){
          if(tempG < currentNeighbor.g){
            currentNeighbor.g = tempG;
            isBest = true;
          }
        }
        else{
          currentNeighbor.g = tempG;
          isBest = true;
          Open.push(currentNeighbor);
        }

        if(isBest){
          currentNeighbor.h = heuristic(currentNeighbor,endNode);
          currentNeighbor.f = currentNeighbor.g + currentNeighbor.h;
          currentNeighbor.parent = currentNode;
        }
      }
    }
  }
  else{
    console.log('No Solution');
    noLoop();
    return;
  }
  background(0);

  for(var i =0; i <columns; i++){
    for(var j= 0; j < lines; j++){
      grid[i][j].show(color(255));
    }
  }

  for(var i = 0; i< Closed.length; i++){
    Closed[i].show(color(255,0,0)); // red
  }

  for(var i = 0; i< Open.length; i++){
    Open[i].show(color(0, 255, 0)); // green
  }

  path = [];
  var temp = currentNode;
  path.push(temp);
  while(temp.parent){
    path.push(temp.parent);
    temp = temp.parent;
  }

  for(var i =0; i< path.length; i++){ // blue
    path[i].show(color(0, 0, 255));
  }
}
