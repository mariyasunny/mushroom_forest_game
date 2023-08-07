//=====================================================================>
//====================== LARVA CLASS ==================================>

class Larva{
    constructor(game,x,y){ // passing reference from where the larva appear
        this.game = game;    
        this.collisionX = x;
        this.collisionY = y;
        this.collissionRadius = 30;
        this.image = document.querySelector('#larva');
        this.spriteWidth = 150;
        this.spriteHeight = 150;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.speedY = 1 + Math.random();
        this.frameX =0;
        this.frameY = Math.floor(Math.random() * 2);
        this.sound = new Audio();
        this.sound.src = 'assets/audio/deathscream.wav';
    }

    draw(context)
    { 
        context.drawImage(this.image,this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
            this.spriteWidth,this.spriteHeight, this.spriteX, this.spriteY,this.width,this.height); // shows the single image with 250 x 250px

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
        this.collisionY -= this.speedY;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 -50; 
        
       
        //move to safety
        if(this.collisionY < this.game.topMargin  && !this.game.gameOver)
        {
            this.markedForDeletion = true;
            this.game.removeGameObjects();
            if(!this.game.gameOver)
            this.game.score ++ ;
            
            for(let i =0; i<3; i++){
                this.game.particles.push(new Firefly(this.game,this.collisionX,this.collisionY,'yellow'));
            }
            
        }

        // collision with objects

        let collisionObjects = [this.game.player, ...this.game.obstacles]; // .. (spread operator helps to expand elements in 
                            // an array to another array...  which means it helps 
                            // all elements in same level ... the objects in 
                            // collisionObjects are solid object
        collisionObjects.forEach(object => {
            let [ collision, distance,  sumOfRadii, dx , dy] =
                    this.game.checkCollision(this,object); // destructuring to extract all 5 individual variables from checkCollision method... 
                                                            //  distance < sumOfRadii with collision means there is collision
            if(collision){
                const unit_x = dx/distance;
                const unit_y = dy/distance;
                this.collisionX = object.collisionX + (sumOfRadii+ 1) * unit_x
                this.collisionY = object.collisionY + (sumOfRadii+ 1) * unit_y
            }
        });

        // collision with enemies

        this.game.enemies.forEach(enemy => {
            if(this.game.checkCollision(this,enemy)[0] && !this.game.gameOver) {  //  destructuring extracts only first property 
                                                                                // from checkCollision method ( distance < sumOfRadii) on line 63
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                this.game.lostHatchlings++;
                this.sound.play();
                for(let i =0; i<3; i++){
                    this.game.particles.push(new Spark(this.game,this.collisionX,this.collisionY,'blue'));
                }
                

            }
        })
    }
}