class Egg{
    constructor(game){
        this.game = game;
        this.collisionX = Math.random() * this.game.width;
        this.collisionY = Math.random() * this.game.height;
        this.collissionRadius = 40;
        this.margin = this.collissionRadius * 2;
        this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2));
        this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin -
            this.margin));
        this.image = document.querySelector('#egg');
        this.spriteWidth= 110;
        this.spriteHeight = 135;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.hatchTimer = 0;
        this.hatchInterval = 5000;
        this.isPlaying = true;
        this.markedForDeletion = false;
        this.sound = new Audio();
        this.sound.src = 'assets/audio/larva.wav';
    }
    draw(context)
    { 
        context.drawImage(this.image, this.spriteX, this.spriteY); // shows the single image with 250 x 250px
        if(this.game.debug){
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collissionRadius,0, Math.PI * 2);
            context.save(); //create a snapshot of current canvas state
            context.globalAlpha = 0.5; //set the opacity of shape
            context.fill();
            context.restore();
            context.stroke();
            const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
            context.fillText(displayTimer,this.collisionX,this.collisionY - this.collissionRadius * 2.5)
            this.hatchTimer++;
        }
        
    }   
    update(deltaTime){
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 30;
        // handle collisions... array contain elements that eggs interact with
        let collisionObjects = [this.game.player, ...this.game.obstacles,...this.game.enemies,...this.game.hatchlings]; 
        // .. (spread operator helps to expand elements in  an array to another array 
        // which means it helps all elements in same level  ) . The objects in collisionObjects are solid object
        collisionObjects.forEach(object => {
            let [ collision, distance,  sumOfRadii, dx , dy] =
                 this.game.checkCollision(this,object); // destructuring distance < sumOfRadii with collision means there is collision
            if(collision){
                const unit_x = dx/distance;
                const unit_y = dy/distance;
                this.collisionX = object.collisionX + (sumOfRadii+ 1) * unit_x
                this.collisionY = object.collisionY + (sumOfRadii+ 1) * unit_y
            }
        });
        //hatching

        if(this.hatchTimer > this.hatchInterval && this.isPlaying){           
            this.game.hatchlings.push(new Larva(this.game,this.collisionX,this.collisionY));
            this.sound.play();
            const durationInSeconds = 5;  // the sound effect stops in 5s after press pause
            setTimeout(() => {
                this.sound.pause();
                this.sound.currentTime = 0; // Reset the audio to the beginning
            }, durationInSeconds * 1000);
            this.markedForDeletion = true;
            this.game.removeGameObjects();
        }
        else{
            this.hatchTimer += deltaTime;
        }  
    }
}