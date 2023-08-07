//=============================================================>
//===============  Loads all assets in canvas   ===============>

window.addEventListener('load',function(){
  const playbutton = document.getElementById('play-button');
  const playPauseButton = document.getElementById('playPauseButton');
  const volumeToggleBtn = document.getElementById('volumeToggle');
  const audioPlayer = document.getElementById('audioPlayer');

  const canvas=document.querySelector('#gameCanvas');
  const context = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;
  let isPlaying = false;

  context.fillStyle = '#fff';
  context.strokeWidth = 3;
  context.strokeStyle='#000';
  context.font = '40px Bangers';
  context.textAlign = 'center';
   getPlayerName();

  const game = new Game(canvas); // creating instance of Game
  game.init();
  
  // Function to start the game (You can add your game logic here)
  function startGame() {
    // Add your game logic here
    if(!isPlaying) {
      // Start the game loop
      isPlaying = true;
      animate(0);
      playPauseButton.textContent = 'Pause';
    }
    closeInstructions(); // Close the overlay after starting the game
  }

  // Function to close the instructions overlay
  function closeInstructions() {
      var overlay = document.getElementById('instructionsOverlay');
      overlay.style.display = 'none';
  }

  // Function to show the prompt and then display the instructions
  function getPlayerName() {
      var playerName =   prompt("Enter the player name:");
      var upperPlayername = playerName.toUpperCase();
      if (upperPlayername != null && upperPlayername.trim() !== "") {
          showInstructionsOverlay(upperPlayername);
      } else {
          getPlayerName(); // Prompt again if the name is empty or canceled
      }
  }
  function showInstructionsOverlay(upperPlayername) {
    var overlay = document.getElementById('instructionsOverlay');
    var instructionsBox = overlay.querySelector('.instructions-box');
    var instructionsMessage =   "Welcome " +`<span id ='name'>  ${upperPlayername} </span>` + " to   the Mushroom forest  game !";
    
    instructionsBox.querySelector('h1').innerHTML = instructionsMessage;
    
    overlay.style.display = 'block';
    playbutton.addEventListener("click", function() {
      // Show the popup when the mouse enters the button
      startGame();
    });  
  }
    //================== delta time is the amount of time that passed between each call requestAnimationFrame
    
    let lastTime = 0;

  function animate(currentTime){ // moves or animate the player or circle when mouse move
    if(isPlaying){
      currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime =currentTime;
      //ctx.clearRect(0,0,canvas.width,canvas.height); // removes the redundancy or repetition or clear the circle
      game.render(context,deltaTime); // draw and update the circle nd position
      requestAnimationFrame(animate); // animate the circle

    }      
  }

  animate(0);

    // Event listener for the play/pause button
  playPauseButton.addEventListener('click', () => {
    if(!isPlaying) {
      // Start the game loop
      isPlaying = true;
      animate(0);
      playPauseButton.textContent = 'Pause';
    } else {
      // Pause the game loop
      isPlaying = false;
      playPauseButton.textContent = 'Resume';    
    }
  });


  // Set initial state
  let isMuted = true;

  // Function to toggle volume state
  function toggleVolume() {
    if (isMuted) {
      audioPlayer.play();// Unmute (full volume)
      volumeToggleBtn.textContent = 'Mute'
    } else {
      audioPlayer.pause(); // Mute
      volumeToggleBtn.textContent = 'Unmute'
    }
    isMuted = !isMuted; // Toggle the state
    
  }
  // Attach the click event listener to the button
  volumeToggleBtn.addEventListener('click', toggleVolume);

});

