//===============================================================>
// ================= OBSTACLE CLASS =============================>

class Obstacle 
{
    constructor(game) 
    {
        this.game = game;
        this.collisionX = Math.random() * this.game.width;
        this.collisionY = Math.random() * this.game.height;
        this.collissionRadius = 30;
        this.image = document.querySelector('#obstacles');
        this.spriteWidth= 250;
        this.spriteHeight = 250;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 70;
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 3);
    }
         // draw the obstacle 
    draw(context)
    { 
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
          this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY,
             this.width, this.height); // shows the single image with 250 x 250px of sprite image 
      if(this.game.debug){
        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.collissionRadius,0, Math.PI * 2);
        context.save();             //create a snapshot of current canvas state
        context.globalAlpha = 0.5; //set the opacity of shape
        context.fill();
        context.restore();
        context.stroke();
      }            
    }   
    update(){

    }
    
}
