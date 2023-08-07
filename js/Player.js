class Player {
    constructor(game){
        this.game = game;
        this.collisionX = this.game.width * 0.5;  // x pont of circle at the beginning
        this.collisionY = this.game.height * 0.5; // y point of circle at the beginning
        this.collissionRadius = 40;
        this.speedX = 0;
        this.speedY = 0;
        this.dx = 0;
        this.dy = 0;
        this.speedModifier =5;
        this.spriteWidth = 255;
        this.spriteHeight = 256;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX; // represent the top left corner of sprite sheet frame of player
        this.spriteY; // represent the top left corner of sprite sheet frame of player
        this.frameX = 0;
        this.frameY = 5;
        this.image = document.querySelector("#bull");
    }

    restart() {
        this.collisionX = this.game.width * 0.5;  // x pont of circle at the beginning
        this.collisionY = this.game.height * 0.5; 
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 -100;
    }
    draw(context){ 
        context.drawImage(this.image, this.frameX * this. spriteWidth,this.frameY * this.spriteHeight, 
            this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height)
        // draw the player or circle
        if(this.game.debug){
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collissionRadius,0, Math.PI * 2);
            context.save(); //create a snapshot of current canvas state
            context.globalAlpha = 0.5; //set the opacity of shape
            context.fill();
            context.restore();
            context.stroke();
            //draw the line.............
            context.beginPath();
            context.moveTo(this.collisionX,this.collisionY); // starting x and y coordinates of line
            context.lineTo(this.game.mouse.x,this.game.mouse.y); // starting x and y coordinates of mouse ptr
            context.stroke();
        }
        
    }   
    update(){ // updating the position of mouse

        
        this.dx = (this.game.mouse.x - this.collisionX); // how fast the player X point move towards the mouse
        this.dy = (this.game.mouse.y - this.collisionY); // how fast the player y point move towards the mouse

        // sprite animation 
        const angle = Math.atan2(this.dy,this.dx) // calculating the angle between mouse and player... 
        //based on the angle activate the row of sprite sheet frame
        
        if (angle < -2.74 || angle > 2.74) this.frameY = 6;
        else if (angle < -1.96) this.frameY = 7;
        else if(angle < -1.17) this.frameY = 0;
        else if (angle < -0.39) this.frameY = 1;
        else if (angle < 0.39) this.frameY = 2;
        else if (angle < 1.17) this.frameY = 3;
        else if (angle < 1.96) this.frameY = 4;
        else if (angle < 2.74) this.frameY = 5;
        else if (angle < -2.74) this.frameY = 6;

        const distance = Math.hypot(this.dy,this.dx); // giving constant speed in each direction
        if(distance > this.speedModifier) {
            this.speedX = this.dx/distance || 0;
            this.speedY = this.dy/distance || 0;
        }
        else{
            this.speedX = 0;
            this.speedY = 0;
        }
        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 -100;

       // horizontal boundaries of player
       if(this.collisionX <  this.collissionRadius)
       this.collisionX = this.collissionRadius;
       else if (this.collisionX > this.game.width - this.collissionRadius)
       this.collisionX = this.game.width - this.collissionRadius;

        // vertical boundaries of player
        if(this.collisionY < this.game.topMargin + this.collissionRadius)
             this.collisionY = this.game.topMargin + this.collissionRadius;
        else if (this.collisionY > this.game.height - this.collissionRadius)
            this.collisionY = this.game.height - this.collissionRadius;

        // collisions with obstacles
        this.game.obstacles.forEach(obstacle => {
            //[( distance < sumOfRadii), distance, sumOfRadii, dx , dy]
            let [collision, distance, sumOfRadii, dx ,
                 dy] = this.game.checkCollision(this,obstacle);

        // let collision1 = game.checkCollision(this,obstacle)[0];
        //  let distance = game.checkCollision(this,obstacle)[1];
        if(collision) {
            const unit_x = dx / distance; // gives value between 0 and 1 or -1 and 1
            const unit_y = dy / distance; 
            // pushing player 1px away from obstacle
            this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x ;
            this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y ;
        }   
        })
    }
        

    
}
