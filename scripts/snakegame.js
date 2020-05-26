/* SnakeGame Using Javascript
* Author: Siddeshwar Ayyappagari 
*/
/* lets start the game functionality */
var snakeGame = function(){
	var self = this;
	/* function executes when play button is clicked on screen */
	self.startGame = function () {
		if( self.gamePaused ) {
			self.score = 0;
			//default left style of snake head
			self.snakeHead.style.left = '30px';
			//default top style of snake head
			self.snakeHead.style.top = '90px';
			//default direction of snake
			self.direction = 'right';
			/* To display the snake head after reset of the game */
			self.snakeHead.style.display = "block";
			/* current score will be non visible when the game is not playing */
			self.currentScore.style.display = "none";
			/* High score will be non visible when the game is not playing */
			self.highScore.style.display = "none";
			/*calling the food part of the snake */
			self.foodGenerate(); 
			/* the following classes are for added after click of start button in the game */
			self.homeScreen.className += ' hideHomeScreen';
			/* After clicking the play button this following classes are added to it as pause button*/
			self.startBtn.className += ' pauseBtn animated bounceIn';
			self.playArea.className += ' displayArea';
			self.foodWrapper.className += ' displayArea';	
			/* to call the function again and again for the movement of the snake*/
			self.movementTimeout = setTimeout(function(){ self.moveTo('right') }, self.time);
			self.gamePaused = false;
		}else {
			/* calls  the function for game to play after paused */
			self.resumeGame();
		}
	}
	/* function to pause the game */ 
	self.pauseGame = function () {
		/* removes the classes when paused is clicked  */
		self.startBtn.classList.remove("pauseBtn","animated","bounceIn");
		clearTimeout(self.movementTimeout);
	}
	
	/*Resume game after paused*/
	self.resumeGame = function () {
		/* adds the classes after game is paused  to resume the game back */
		self.startBtn.className += ' pauseBtn animated bounceIn';
		/* this function is called to give the current position of snake to moveTo function */
		self.moveTo(self.gamePausedDir);
	}
	/* Game reSet*/ 
	self.reSet = function () {
		/* food will disapear */
		self.food.style.display = "none";
		/* current score displays while playing*/
		self.currentScore.style.display = "block";
		/* current score will set to 0 after reset of game */
		self.scoreDisplay.innerHTML = '0';
		/*score will be disappear while game is paused or reset */
		self.scoreDisplay.style.display = 'none';
		/*high score will be display while game is paused or reset or after game over*/
		self.highScore.style.display = "block";
		/* reset the head position to the initial */
		self.snakeHead.classList.remove("blast","upFaceDirection","downFaceDirection","leftFaceDirection","rightFaceDirection");
		self.homeScreen.classList.remove("hideHomeScreen");
		self.playArea.classList.remove("displayArea");
		self.foodWrapper.classList.remove("displayArea");
		self.startBtn.classList.remove("pauseBtn","animated","bounceIn");
		self.gamePaused = true;
		self.gameOver = false;
		self.currentSpeedLevel = 0;
		self.time = 210;
	}
	/* To Generate the food */
	self.foodGenerate = function(){
		if ( !self.food ) {
			self.food = document.createElement('div');
			self.food.className  += 'food';
			self.foodWrapper.appendChild(self.food);	
		}
		self.food.style.display = 'block';	
		/*Here the food position will change randomly */
		self.foodPos = {
			top: Math.floor(Math.random() * 30)*30,
			left: Math.floor(Math.random() * 30)*30
		}
		/* if the food goes out of the area then again this function is called*/
		if ( self.foodPos.top > window.innerHeight - 50 || self.foodPos.left > window.innerWidth - 50 ) {
			self.foodGenerate();
			return;
		}
		/* if food comes below the pause button on the play area */
		if ( self.isBetween(parseFloat(self.startBtn.style.top) - self.foodPos.top, -39, 7) && self.isBetween(  parseFloat(self.startBtn.style.left) -self.foodPos.left  , 40, -59)) {
			self.foodGenerate();
			return;
		}
		var shouldReturn = false;
		/* if food comes on the snake */
		for(var j = 0 ; j < self.tailArray.length ; j++){
			if( self.isBetween(self.foodPos.top - self.tailArray[j][1],-15,15) || self.isBetween(self.foodPos.left - self.tailArray[j][0],-15,15)){
				shouldReturn = true;
				break;
			}
		}
		if ( shouldReturn ) {
			self.foodGenerate();
			return;
		}
		self.food.style.left = self.foodPos.left + 'px';
		self.food.style.top = self.foodPos.top + 'px';
	}
	/* function for tail creation */ 
	self.snakeTail = function() {
		/* divs for snake as tail */
		var tail = document.createElement('div');
		
		tail.className = 'tail';
		self.snakeTailArray.push(tail);
		self.playArea.appendChild(tail);
		/* To get the score details after eating the food atleast once */
		self.scoreDetails();
	}
	/*function for score details*/ 
	self.scoreDetails = function(){
		self.scoreDisplay.style.display = 'block';
		self.score += 10;
		// To display score while game is paused and after game over
		self.scorecount.innerHTML = self.score;
		// To display score while playing
		self.scoreDisplay.innerHTML = self.score;
		/* To get the highscore value from local server */
		if (typeof(Storage) !== "undefined") {	
			if( parseInt(self.scorecount.innerHTML) > parseInt(self.highScoreCount.innerHTML)) {
				self.highScoreCount.innerHTML = self.scorecount.innerHTML;
				localStorage.setItem("highScore", self.highScoreCount.innerHTML);
			} else {
				return self.highScoreCount.innerHTML ;
			}
			self.TopScore = localStorage.getItem("highScore");
		}
		self.highScoreCount.innerHTML = self.TopScore;
	}
	/* calculation for catching the food*/
	self.isBetween = function(num, a, b) {
		var min = Math.min.apply(Math, [a, b]),
		max = Math.max.apply(Math, [a, b]);
		return num >= min && num <= max;
	};
	/*function for blast the snake */  	
	self.blastAll = function(){
		if ( !self.blastStarted ) {
			clearTimeout(self.movementTimeout);
			/* animation like blast is going to add by class name 'blast' */
			self.snakeHead.className += ' blast';
			setTimeout(function(){
				self.snakeHead.style.display = 'none';
				self.blastStarted = true;
				self.blastAll();
			},100);
		} else {
			if( self.snakeTailArray.length ){
				self.snakeTailArray[0].className += ' blast';	
				setTimeout(function(){
					try {
						self.snakeTailArray[0].parentNode.removeChild(self.snakeTailArray[0]);
						self.snakeTailArray.splice(0,1);
						self.blastAll();
					} catch(e) {
					}		
				},130);
			} else {
				self.blastStarted = false;
				self.reSet();
			}
		}
	}
	/* Moving the snake in a direction */
	self.moveTo = function(dir){
		var canBlast = false;
		if (self.movementTimeout){
			clearTimeout(self.movementTimeout);	
		}	
		var snakeLeftVal,
		snakeTopVal;		
		/*When the movement is towards the left side */
		if ( dir === 'left' ) {		
			if ( self.snakeHead.offsetLeft - parseInt(self.snakeHead.offsetWidth) < 0 ) {
				canBlast = true;
			} else {
				self.snakeHead.style.left = self.snakeHead.offsetLeft - parseInt(self.snakeHead.offsetWidth) + 'px';
				snakeLeftVal = parseInt(self.snakeHead.style.left) + self.snakeHead.offsetWidth;
				snakeTopVal = parseInt(self.snakeHead.style.top)	
			}
		} 		
		/*When the movement is towards the right side */
		else if ( dir === 'right' ) {
			if ( self.snakeHead.offsetLeft + parseInt(self.snakeHead.offsetWidth + self.snakeMoment) > window.innerWidth ) {
				canBlast = true;
			} else {
				self.snakeHead.style.left = self.snakeHead.offsetLeft + parseInt(self.snakeHead.offsetWidth) + 'px';
				snakeLeftVal = parseInt(self.snakeHead.style.left) - self.snakeHead.offsetHeight;
				snakeTopVal = parseInt(self.snakeHead.style.top);	
			}
		}		
		/*When the movement is towards the top side of the screen */
		else if ( dir === 'top' ) {
			if ( self.snakeHead.offsetTop - parseInt(self.snakeHead.offsetHeight) < 0 ) {
				canBlast = true;
			} else {
				self.snakeHead.style.top = self.snakeHead.offsetTop - parseInt(self.snakeHead.offsetHeight) + 'px';
				snakeLeftVal = parseInt(self.snakeHead.style.left) ;
				snakeTopVal = parseInt(self.snakeHead.style.top) + self.snakeHead.offsetHeight;
			}
		} 		
		/*When the movement is towards the bottom side of the screen */
		else if ( dir === 'bottom' ) {
			if ( self.snakeHead.offsetTop + parseInt(self.snakeHead.offsetHeight +self.snakeMoment) > window.innerHeight ) {
				canBlast = true;
			} else {
				self.snakeHead.style.top = self.snakeHead.offsetTop + parseInt(self.snakeHead.offsetHeight) + 'px';
				snakeLeftVal = parseInt(self.snakeHead.style.left);
				snakeTopVal = parseInt(self.snakeHead.style.top) - self.snakeHead.offsetHeight;	
			}
		} 
		if ( self.isBetween(parseFloat(self.snakeHead.style.top) - self.foodPos.top, -35, 30) && self.isBetween(  parseFloat(self.snakeHead.style.left) -self.foodPos.left  , 35, -35)) {
			self.snakeMouth.classList.add('eat');
		} else {
			self.snakeMouth.classList.remove('eat');
		}
		if ( self.isBetween(parseFloat(self.snakeHead.style.top) - self.foodPos.top, -15, 15) && self.isBetween(  parseFloat(self.snakeHead.style.left) -self.foodPos.left  , 15, -15)) {
			self.foodGenerate();
			self.snakeTail();
		}		
		var snakeHeadLeft = parseInt(self.snakeHead.style.left);
		var snakeHeadTop = parseInt(self.snakeHead.style.top);
		for(var j = 0 ; j < self.tailArray.length ; j++){
			if( self.isBetween(snakeHeadLeft - parseInt(self.tailArray[j][0]), -15, 15) && self.isBetween(snakeHeadTop - parseInt(self.tailArray[j][1]), -15, 15)){
				canBlast = true;
				break;
			}
		}
		if ( !canBlast ) {
			self.moveSnakeTail(snakeTopVal, snakeLeftVal, dir);
			if(self.snakeTailArray.length > 0 && self.snakeTailArray.length % 7 == 0 && self.snakeTailArray.length/7 === self.currentSpeedLevel+1) {
				self.currentSpeedLevel++;
				self.time = (self.time - 60 > 60 ? self.time - 60 : 60);
			}
			self.movementTimeout = setTimeout(function(){ self.moveTo(direction) }, self.time);	
		}
		if ( canBlast ) {
			self.blastAll();
		}
	}
	/* for the movement of snake which ever the direction it goes*/
	self.moveSnakeTail = function(snakeTopVal, snakeLeftVal){
		var moveDir = [];
		if(self.snakeTailArray.length){
			for (var i = 0; i < self.snakeTailArray.length; i++) {
				moveDir.push([self.snakeTailArray[i].style.left, self.snakeTailArray[i].style.top]);
				self.snakeTailArray[i].style.top = i - 1 >= 0 ? parseInt(moveDir[i - 1][1]) + 'px': snakeTopVal + 'px' ;
				self.snakeTailArray[i].style.left = i - 1 >= 0 ? parseInt(moveDir[i - 1][0])  + 'px' : snakeLeftVal + 'px';
			}
		}
		self.tailArray = moveDir;
	}
	/* function for declaration of variables */
	self.initVariables = function(){
		self.homeScreen = document.getElementsByClassName("homeScreen")[0];
		self.startBtn = document.getElementById('startBtn');
		self.scorecount = document.getElementById('scorecount');
		self.scoreDisplay = document.getElementById('scoreDisplay');
		self.highScoreCount = document.getElementById('highScoreCount');
		self.playArea = document.getElementsByClassName("playArea")[0];
		self.snakeHead = document.getElementsByClassName("snakeHead")[0];
		self.pauseBtn = document.getElementsByClassName("pauseBtn")[0];
		self.classNames = self.snakeHead.className;
		self.currentSpeedLevel = 0;
		self.gamePaused = true;
		self.gameOver = true;
		self.foodWrapper = document.getElementsByClassName("foodWrapper")[0];
		self.food = document.getElementsByClassName("food")[0];
		self.snakeTailArray = [];
		self.direction = 'right';
		self.tailArray = [];
		self.time = 210;
		self.currentScore = document.getElementsByClassName("currentScore")[0];
		self.snakeMouth = document.getElementsByClassName("mouth")[0];
		self.highScore = document.getElementsByClassName("highScore")[0];
		self.snakeMoment = 30;
	}
	/* function for binding the events*/
	self.bindEvents = function(){
		self.startBtn.addEventListener("click", function(){ 
			self.gameOver = true;
			if ( self.startBtn.className.indexOf('pauseBtn') >= 0 && self.gameOver ) {
				self.pauseGame();
			} else {
				self.startGame();
			}
		});
		window.onkeydown = function(event){
			var canMove = false;
			if(event.keyCode == '13'){
				self.startGame();
			}
			if ( direction !== 'left' && direction !== 'right' && event.keyCode == '37' ) {
				canMove = true;
				direction = 'left';
				self.snakeHead.className = self.classNames + " leftFaceDirection";
			} else if ( direction !== 'top' && direction !== 'bottom' && event.keyCode == '38' ) {
				canMove = true;
				direction = 'top';
				self.snakeHead.className = self.classNames + " upFaceDirection";
			} else if ( direction !== 'right' && direction !== 'left' && event.keyCode == '39' ) {
				canMove = true;
				direction = 'right';
				self.snakeHead.className = self.classNames + " rightFaceDirection";
			} else  if (direction !== 'bottom' && direction !== 'top' && event.keyCode == '40' ) {
				canMove = true;
				direction = 'bottom';
				self.snakeHead.className = self.classNames + " downFaceDirection";
			}
			if ( canMove ) {
				self.gamePausedDir = direction;
				self.moveTo(direction);	
			}
		}
	}
	self.init = function(){
		/* highscore will be stored in local so that it wont become 0 when we refresh or restart the game */
		self.highScoreCount.innerHTML = localStorage.getItem("highScore");
		/* calling the global  variables */
		self.initVariables();
		/* calling the bindevents function */
		self.bindEvents();
	}
	return {
		init: init
	}
}
snakeGame().init();