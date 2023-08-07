//============================================================================>
// ====================== GAME CLASS - MAIN CLASS ============================>

class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.topMargin = 260;
        this.debug = true;                      // debug mode to toggle when key press to remove collision circle
        this.player = new Player(this);         // creating instance of class Player
        this.fps = 100;
        this.timer = 0;
        this.interval = 1000 / this.fps;        // amount of milli sec needed to achieve this fps
        this.eggTimer = 0;
        this.eggInterval = 1000;
        this.numberOfObstacles = 10;            
        this.maxEggs = 10;
        this.obstacles = [];                    // instance of Obstacle
        this.eggs=[];
        this.enemies =[];
        this.hatchlings= [];
        this.particles =[]; 
        this.gameObjects= [];    
        this.score = 0;
        this.lostHatchlings = 0;
        this.winningScore = 30;
        this.gameOver = false;
        this.sound = new Audio();
        this.sound.src = 'assets/audio/win.wav';
        this.sound1 = new Audio();
       
        this.sound1.src = 'assets/audio/lose.wav';
        
                        // To order the objects visually better based on the vertical coordinates
        this.mouse = {                           // gives the x and y coordinates when we click around
            x: this.width * 0.5,
            y: this.height * 0.5,
            pressed : false
        }

        //=======================Event listeners =======================================>

        window.addEventListener('mousedown', e => { // e helps to get access to offset values
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = true;
            
        });
        window.addEventListener('mouseup', e => { 
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = false;
            
        });
        window.addEventListener('mousemove', e => { 
           if(this.mouse.pressed){
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;               
                console.log(this.mouse.x);
            }
        });
        window.addEventListener('keydown', e => { 
         
         if(e.key == 'd')  this.debug = !this.debug;
           
         else if(e.key == 'r')  this.restart();
        });
    }
    render(context, deltaTime){                     // draw and update all object in canvas
        if(this.timer > this.interval){

            //============animate next frame====>
            context.clearRect(0,0,this.width, this.height);
            this.gameObjects = [ this.player,...this.eggs,...this.obstacles,
                        ...this.enemies,...this.hatchlings,...this.particles]; 
           
            //================ sort by vertical position to make it  more visual sense =========
           this.gameObjects.sort((a,b) => {
                return a.collisionY - b.collisionY;
            });
            //===== draw and updates all objects in gameObjects array using single line of code
            this.gameObjects.forEach(object =>{
                object.draw(context); 
                object.update(deltaTime);
            });        
            this.timer =0;
        }
        this.timer += deltaTime;

            //===========add eggs periodically ================>
        if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver ){
            this.addEgg();
            this.eggTimer =0;
        }
        else{
            this.eggTimer += deltaTime;
        }

        //=============draw status text =======================>
        context.save();
        context.textAlign = 'left';
        context.fillText('Score:' + this.score, 25, 50);
        context.fillText('Lost:' + this.lostHatchlings, 25, 90);
        context.restore();          

        //======================= win / lose message=============>

        if(this.score > this.winningScore) {
            this.gameOver = true;
            context.save();
            context.fillStyle = 'rgba(0,0,0,0.5)';
            context.fillRect(0,0,this.width,this.height);
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.shadowOffsetX = 4;
            context.shadowOffsetY =4;
            context.shadowColor = 'black';
            let message1;
            let message2;
            if(this.lostHatchlings <=10) {
        //=============win=============================>
                this.sound.play();
                message1 = ' Congrats!! ';
                message2 = ' You build the bullies ';
            }
            else{
        //============= lose ==========================>
                this.sound1.play();
                message1 = 'Bullocks!!';
                message2 = ' You  lost ' +  this.lostHatchlings + ' hatchlings ';
            }
            context.font = '130px Bangers';
            context.fillText(message1, this.width * 0.5,this.height * 0.5 - 20);
            context.font = '40px Bangers';
            context.fillText(message2, this.width * 0.5,this.height * 0.5 + 30);
            context.fillText(" Final Score " +  this.score  + " Press 'R' to start over! " , this.width * 0.5 ,this.height * 0.5 + 80);
            context.restore();
        }
    }
    checkCollision(a,b) {                //========== check whether a & b collide each other ========>
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii = a.collissionRadius + b.collissionRadius; 
        return [( distance < sumOfRadii), distance, sumOfRadii, dx , dy];
    }

    addEgg(){
        this.eggs.push(new Egg(this));
    }
    addEnemy(){
        this.enemies.push(new Enemy(this));
       
    }
    removeGameObjects() {                //===== filter return a new x array which filtered out eggs that are  markedForDeletion 
                                         // ====  and overwrites the original array
       
        this.eggs = this.eggs.filter(object => !object.markedForDeletion); 
        this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion);
        this.particles = this.particles.filter(object => !object.markedForDeletion);
    }
    //====================== Restarting the game when press R =================>
    restart() {
        this.player.restart();
        this.obstacles = []; // instance of obstacle
        this.eggs=[];
        this.enemies =[];
        this.hatchlings= [];
        this.particles =[];
        this.mouse = {                  // ============= gives the x and y coordinates when we click around =========>
            x: this.width * 0.5,
            y: this.height * 0.5,
            pressed : false
        }
        this.score =0;
        this.lostHatchlings =0;
        this.gameOver = false;
        this.init();
    }
    init() { 

        for(let i =0; i< 3; i++){
            this.addEnemy();
           
        }
        //==================brute force algorithm for making space between objects ==============>

        let attempts = 0;
        
        while(this.obstacles.length < this.numberOfObstacles && attempts < 500){
            let testObstacle = new Obstacle(this);
            let overlap = false;
            this.obstacles.forEach (obstacle => {
                const dx = testObstacle.collisionX - obstacle.collisionX;                 
                const dy = testObstacle.collisionY - obstacle.collisionY;      
                const distance = Math.hypot(dy,dx);
                const distanceBuffer = 100;                     // controls obstacle spacing
                const sumOfRadii = testObstacle.collissionRadius + 
                                    obstacle.collissionRadius 
                                    + distanceBuffer;
                if(distance < sumOfRadii){
                    overlap = true;
                }
            });
            const margin = testObstacle.collissionRadius * 2;
            // ===============push the non overlapping obstacles to canvas ================>
            if(!overlap && testObstacle.spriteX > 0 
                && testObstacle.spriteX < this.width - testObstacle.width 
                && testObstacle.collisionY > this.topMargin + margin 
                && testObstacle.collisionY  < this.height - margin)
            {
                this.obstacles.push(testObstacle);
            }
                
            attempts++;
        }
    }   
}
