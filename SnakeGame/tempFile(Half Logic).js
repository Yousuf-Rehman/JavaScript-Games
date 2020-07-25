'use strict'
//Events
window.addEventListener('keydown',this.Keypressed, false);//for whole browser
window.setInterval(this.CallBack, 300);

const DirEnum = Object.freeze({"Left":37, "Up":38, "Right":39, "Down":40})

//canvas
let canvas = document.getElementById("canvas")
canvas.width = 500;
canvas.height = 500;
let context = canvas.getContext("2d")

let rows,cols;
rows = cols = 50;
let BoxH = 2*canvas.height/rows, BoxW = 2*canvas.width/cols;
let grid;
let SnakeArray = [];
let Direction = DirEnum.Right;
const MovStep = BoxW;

let RandomItem = () => {
    return new Cell(Math.random()*canvas.width, Math.random()*canvas.height, "blue");
}
let Item = RandomItem()

function Cell(x, y, rectColor = "green", borderColor="white", h=BoxH, w=BoxW) {
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

    this.MoveDown = () => {
        this.y = (this.y + MovStep)%canvas.height;
    }

    /*this.Intersection = (rect) => {
        return !( rect.x  > (this.x + this.w) || (rect.x + rect.w) <  this.x || rect.y > (this.y + this.h) || (rect.y + rect.h) <  this.y);
    }*/
    // Returns true if two rectangles (l1, r1) and (l2, r2) overlap 
    this.rectangleCord = (rect) => {
        x = rect.x
        y = rect.y
        w = rect.w
        h = rect.h
        return [{'x':x, 'y':y}, {'x':x + w, 'y':y + h}];
    }

    this.Intersection = (rect) => {
        // If one rectangle is on left side of other 
        let l1 = this.rectangleCord(this)[0]
        let r1 = this.rectangleCord(this)[1]
        let l2 = this.rectangleCord(rect)[0]
        let r2 = this.rectangleCord(rect)[1]
        //console.log(l1.x + " " + r1.x)
        //console.log(l1.y + " " + r1.y)
        //console.log(l2.x + " " + r2.x)
        //console.log(l2.y + " " + r2.y)
        // If one rectangle is on left side of other 
        if (l1.x >= r2.x || l2.x >= r1.x) 
            return false; 
        // If one rectangle is above other 
        if (l1.y >= r2.y || l2.y >= r1.y) 
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
    let cell = new Cell(0,0,"brown");
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
    switch (Direction) {
        case DirEnum.Left: SnakeArray[0].MoveLeft(); break; //Left key
        case DirEnum.Up: SnakeArray[0].MoveUp(); break; //Up key
        case DirEnum.Right: SnakeArray[0].MoveRight(); break; //Right key
        case DirEnum.Down: SnakeArray[0].MoveDown(); break; //Down key
    }
    
    //console.log(Direction)
    this.CheckItem()
    DrawBoard()
    this.ShowSnake()
    Item.show()
}

function ShowSnake(){
    for(let part of SnakeArray)
        part.show()
}

function CheckItem(){
    if(SnakeArray[0].Intersection(Item)){// || Item.Intersection(SnakeArray[0])){
        SnakeArray.push(this.SnakeCell())
        Item = RandomItem()
    }
}
SnakeArray.push(this.SnakeCell())