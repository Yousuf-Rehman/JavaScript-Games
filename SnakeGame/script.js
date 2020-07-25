'use strict'
//Events
const GAMESPEED = 30;//ms
//Browser Functions
let IntervalID;
let Start = false;
let Score = 0;
let ScoreIncrementer = 10;
function StartFunc(CallBackFunc){
    if(!Start){
        window.addEventListener('keydown',this.Keypressed, false);//for whole browser
        IntervalID = window.setInterval(CallBackFunc, GAMESPEED);
        Start = true;
    }
}

function PauseFunc(){
    if(Start){
        window.removeEventListener('keydown',this.Keypressed);//for whole browser
        window.clearInterval(IntervalID)
        Start = false;
    }
}

function ClearAll(){
    SnakeArray = []
    SnakeArray.push(this.SnakeCell())
    Direction = DirEnum.Right;//Initial Direction
    Score = 0;
    this.CallBack();
    this.PauseFunc();
};
//HTML Buttons
let button = document.querySelectorAll('#btnControl')
button[0].children[0].addEventListener('click', () => this.StartFunc(this.CallBack))
button[0].children[1].addEventListener('click', () => this.PauseFunc())
button[0].children[2].addEventListener('click', () => this.ClearAll())
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
let SnakeArray = [];//Snake parts
let Direction = DirEnum.Right;//Initial Direction
const MovStep = BoxW/2;//Step To move by the snake, It may make the snake continous(for beeter visuals) and it can change the peed as well(not recommend this way speed change)

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
        context.font = "18px Arial";
        context.fillText(`Score: ${Score}`, canvas.width - 100, 20);
        context.stroke()
    }

    this.hide = () => {    
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.MoveLeft = () => {
        this.x = (this.x - MovStep);
        if(this.x < 0)
            this.x = canvas.width-MovStep;
    }

    this.MoveRight = () => {
        this.x = (this.x + MovStep)%canvas.width;
    }

    this.MoveUp = () => {
        this.y = (this.y - MovStep);
        if(this.y < 0)
            this.y = canvas.height-MovStep;//-MovStep So it may not disppear
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

function DrawBoard(){
    //Draw Board
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
};DrawBoard();

function SnakeCell(){
    let cell = new Cell(-BoxH,0,"black");
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
        Score += ScoreIncrementer;
        SnakeArray.push(this.SnakeCell())
        SnakeDiet = RandomSnakeDiet()
    }
}
SnakeArray.push(this.SnakeCell())