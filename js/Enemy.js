// ========================================================================>
// =================== ENEMY CLASS ========================================>

class Enemy {
    constructor(game){
        this.game = game;            
        this.speedX = Math.random() * 3 + 1;
        this.image = document.querySelector('#toads');
        this.spriteWidth= 140;
        this.spriteHeight = 260;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.collisionX =  this.game.width +this.width + Math.random() * this.game.width * 0.5;
        this.collisionY = this.game.topMargin +( Math.random() * (this.game.height -this.game.topMargin));
        this.collissionRadius = 30;
        this.spriteX;
        this.spriteY;
        this.frameX =0;
        this.frameY =Math.floor(Math.random() * 4);
    }
    draw(context)
    { 
        context.drawImage(this.image, this.frameX * this.spriteWidth,this.frameY * this.spriteHeight,
             this.spriteWidth,this.spriteHeight,this.spriteX, this.spriteY, this.width,this.height); // shows the single image with 250 x 250px
      if(this.game.debug){
        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.collissionRadius,0, Math.PI * 2);
        context.save(); //create a snapshot of current canvas state
        context.globalAlpha = 0.5; //set the opacity of shape
        context.fill();
        context.restore();
        context.stroke();
      }
        
    }   
    update() {
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 50;
        this.collisionX -=this.speedX;
        if(this.spriteX + this.width < 0 && (!this.game.gameOver)) {  // reset the enemy when the right edge of spreadsheet hides the left edge of canvas 
            this.collisionX =  this.game.width +this.width + Math.random() * this.game.width * 0.5; //give each one random delay
            this.collisionY = this.game.topMargin +( Math.random() * (this.game.height -this.game.topMargin) );
            this.frameY = Math.floor(Math.random() * 4);
        }

        let collisionObjects = [this.game.player, ...this.game.obstacles]; // .. (spread operator helps to expand elements in an array to another array 
        // which means it helps all elements in same level  )
        collisionObjects.forEach(object => {
            let [ collision, distance,  sumOfRadii, dx , dy] = this.game.checkCollision(this,object); // destructuring distance < sumOfRadii with collision 
            //means there is collision
            if(collision){
                const unit_x = dx/distance;
                const unit_y = dy/distance;
                this.collisionX = object.collisionX + (sumOfRadii+ 1) * unit_x
                this.collisionY = object.collisionY + (sumOfRadii+ 1) * unit_y
            }
        })
    }
}
