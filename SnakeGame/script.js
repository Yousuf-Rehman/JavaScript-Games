'use strict'
//Events
const GAMESPEED = 100;//ms
//Browser Functions
window.addEventListener('keydown',this.Keypressed, false);//for whole browser
window.setInterval(this.CallBack, GAMESPEED);
//ENUM for Direction
const DirEnum = Object.freeze({"Left":37, "Up":38, "Right":39, "Down":40})
//canvas Settings
let canvas = document.getElementById("canvas")
canvas.width = 500;
canvas.height = 500;
let context = canvas.getContext("2d")
//Grid Settings
let rows,cols;
rows = cols = 50;
let BoxH = 2*canvas.height/rows, BoxW = 2*canvas.width/cols;
let grid;
let SnakeArray = [];//Snake parts
let Direction = DirEnum.Right;//Initial Direction
const MovStep = BoxW;//Step To move by the snake, It may make the snake continous(for beeter visuals) and it can change the peed as well(not recommend this way speed change)

let RandomSnakeDiet = () => {
    return new Cell(Math.random()*(canvas.width-BoxW), Math.random()*(canvas.height-BoxH), "blue");//-BoxW so that It will remain in arena
}
let SnakeDiet = RandomSnakeDiet()//SnakeDiet for snake to eat

function Cell(x, y, rectColor = "green", borderColor="white", h=BoxH, w=BoxW) {//Cell for each grid block
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.rectColor = rectColor;
    this.borderColor = borderColor;

    this.show = () => {
        context.fillStyle = this.rectColor  //rectangle color
        context.strokeStyle = this.borderColor //border color
        context.fillRect(this.x, this.y, BoxW,BoxH)
        context.stroke()
    }

    this.hide = () => {    
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.MoveLeft = () => {
        this.x = (this.x - MovStep);
        if(this.x < 0)
            this.x = canvas.width;
    }

    this.MoveRight = () => {
        this.x = (this.x + MovStep)%canvas.width;
    }

    this.MoveUp = () => {
        this.y = (this.y - MovStep);
        if(this.y < 0)
            this.y = canvas.height;
    }

    this.MoveDown = () => {//On cell move down
        this.y = (this.y + MovStep)%canvas.height;
    }

    this.rectangleCord = (rect) => {//Object: just for ease //return rectangle diagonal co-ordinates
        x = rect.x
        y = rect.y
        w = rect.w
        h = rect.h
        return [{'x':x, 'y':y}, {'x':x + w, 'y':y + h}];
    }

    this.Intersection = (rect) => { 
        let l1 = this.rectangleCord(this)[0]
        let r1 = this.rectangleCord(this)[1]
        let l2 = this.rectangleCord(rect)[0]
        let r2 = this.rectangleCord(rect)[1]
        // If one rectangle is on left side of other  // If one rectangle is above other 
        if (l1.x >= r2.x || l2.x >= r1.x || l1.y >= r2.y || l2.y >= r1.y) 
            return false; 
        return true;
    } 
};

let Init_and_DrawBoard = () => {
    grid = new Array(rows)
    for(let i=0; i<rows; i++)
    grid[i] = new Array(cols)
    this.DrawBoard()
};Init_and_DrawBoard();

function DrawBoard(){
    //Draw Board
    for(let i = 0; i < grid.length; i++)
        for(let j = 0; j < grid[0].length; j++){
            grid[i][j] = new Cell(i*BoxW,j*BoxH)
            grid[i][j].show()
        }
}

function SnakeCell(){
    let cell = new Cell(-BoxH,0,"brown");
    cell.show()
    return cell;
} 

function Keypressed(e) {
    let code = e.keyCode;
    switch (code) {
        case DirEnum.Left: Direction = DirEnum.Left; break; //Left key
        case DirEnum.Up: Direction = DirEnum.Up; break; //Up key
        case DirEnum.Right: Direction = DirEnum.Right; break; //Right key
        case DirEnum.Down: Direction = DirEnum.Down; break; //Down key
    }
}
//button[0].children[1].addEventListener('click', Start)
//button[0].children[2].addEventListener('click', Pause)
//button[0].children[2].addEventListener('click', Stop)
function CallBack(){
    let X = SnakeArray[0].x;
    let Y = SnakeArray[0].y;

    switch (Direction) {
        case DirEnum.Left: SnakeArray[0].MoveLeft(); break; //Left key
        case DirEnum.Up: SnakeArray[0].MoveUp(); break; //Up key
        case DirEnum.Right: SnakeArray[0].MoveRight(); break; //Right key
        case DirEnum.Down: SnakeArray[0].MoveDown(); break; //Down key
    }
    
    this.CheckSnakeDietHit()
    DrawBoard()
    this.MoveAllParts_And_ShowSnake(X,Y)
    SnakeDiet.show()
}

function MoveAllParts_And_ShowSnake(X,Y){
    let prevX;
    let prevY;
    for(let part of SnakeArray){
        if(part == SnakeArray[0]) continue;
        prevX = part.x;
        prevY = part.y;
        part.x = X;
        part.y = Y;
        X = prevX;
        Y = prevY;
    }
    for(let part of SnakeArray)
        part.show()
}

function CheckSnakeDietHit(){
    if(SnakeArray[0].Intersection(SnakeDiet)){
        SnakeArray.push(this.SnakeCell())
        SnakeDiet = RandomSnakeDiet()
    }
}
SnakeArray.push(this.SnakeCell())