"use strict";

window.onload=function(){
	console.log("SPACE INVADERS! " +"(v4)");

	LOADER.init();
};

// Holds the rendered images from the source sprite sheet.
let IMGCACHE={};

let GAMEVARS = {
	// Gameplay variables.
	invader_spacing_x  : 0 ,
	invader_spacing_y  : 0 ,
	invader_xvel       : 0 ,
	invader_shot1_vvel : 0 ,
	invader_fmax       : 0 ,
	ship1_xvel         : 0 ,
	ship1_shot1_vvel   : 0 ,
	player_xvel        : 0 ,
	player_shot1_vvel  : 0 ,

	//
	paused       : false ,
	audiocanplay : false ,
	pagevisible  : true  ,
	raf_id       : null  ,

	//
	PLAYERS  : [] ,
	SHOTS    : [] ,
	SHIPS    : [] ,
	INVADERS : [] ,

	// Keyboard controls.
	KEYSTATE : {},
	KEYBOARD_CONTROLS : {
		// "CODE" refers to the keycode value of the key. "NAME" and "PURPOSE" aren't actually required.
		"P1":{
			"LEFT"  : { "CODE" : 37, "NAME" : "Left Arrow"  },
			"RIGHT" : { "CODE" : 39, "NAME" : "Right Arrow" },
			"FIRE"  : { "CODE" : 38, "NAME" : "Up Arrow"    },
		},
		"P2":{
			"LEFT"  : { "CODE" : 65, "NAME" : "A Key" },
			"RIGHT" : { "CODE" : 68, "NAME" : "D Key" },
			"FIRE"  : { "CODE" : 87, "NAME" : "W Key" },
		}
	},

	//
	gamestate_main : 0 ,
	gamestate_sub1 : 0 ,

	// Resets gameplay variables to the default state.
	reset_game_consts : function(){
		// Gameplay variables.
		GAMEVARS.invader_spacing_x  =  12 ;
		GAMEVARS.invader_spacing_y  =  8  ;
		GAMEVARS.invader_xvel       =  2  ;
		GAMEVARS.invader_shot1_vvel = -4  ;
		GAMEVARS.invader_fmax       = 15  ;
		GAMEVARS.ship1_xvel         =  3  ;
		GAMEVARS.ship1_shot1_vvel   = -4  ;
		GAMEVARS.player_xvel        =  4  ;
		GAMEVARS.player_shot1_vvel  =  6  ;

		// Arrays containing entities.
		GAMEVARS.PLAYERS  = [] ;
		GAMEVARS.SHOTS    = [] ;
		GAMEVARS.SHIPS    = [] ;
		GAMEVARS.INVADERS = [] ;

		//
		GAMEVARS.KEYSTATE = {} ;
	},

	// Sound effects
	sounds         : {
		"player_shoot"        : { "src":"sounds/shoot5.mp3", "elem":undefined, vol:0.0075*(3+2) } ,
		"alien_ship_shoot"    : { "src":"sounds/shoot2.mp3", "elem":undefined, vol:0.0075*(3+2) } ,
		"alien_invader_shoot" : { "src":"sounds/shoot4.mp3", "elem":undefined, vol:0.0075*(3+2) } ,
		"player_hit"          : { "src":"sounds/hit1.mp3"  , "elem":undefined, vol:0.0075*(3+2) } ,
		"alien_ship_hit"      : { "src":"sounds/hit1.mp3"  , "elem":undefined, vol:0.0075*(3+2) } ,
		"alien_invader_hit"   : { "src":"sounds/hit1.mp3"  , "elem":undefined, vol:0.0075*(3+2) } ,
		"alien_invader_move1" : { "src":"sounds/move1.mp3" , "elem":undefined, vol:0.0750*(4+2) } ,
		"alien_invader_move2" : { "src":"sounds/move2.mp3" , "elem":undefined, vol:0.0750*(4+2) } ,
	},
};

// Game functions.
let FUNCS = {
	startGameFromBeginning : function(){
		// Reset game vars.
		GAMEVARS.reset_game_consts();

		// Handle state.
		//

		// Request animation frame.
		GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
	},
	gameover : function(){
		// Reset game vars.
		// GAMEVARS.reset_game_consts();

		// Handle state.
	},

	addPlayer(playernum){
		// Make sure that this playernum doesn't already exist.
		let matches = GAMEVARS.PLAYERS.filter(function(d,i,a){ return d.playernum==playernum; });
		if(matches.length){
			console.log("PLAYERNUM IS ALREADY IN USE.");
			return;
		}

		let newPlayer;

		let width  = IMGCACHE["player"][0].width;
		let height = IMGCACHE["player"][0].width;

		if    (playernum==1){
			newPlayer = {
				"x"         : DOM.mainCanvas.width/4 - width ,
				"y"         : DOM.mainCanvas.height  - height ,
				"control"  	: "H",
				"playernum"	: 1
			};
		}
		else if(playernum==2){
			newPlayer = {
				"x"         : DOM.mainCanvas.width- DOM.mainCanvas.width/4 - width ,
				"y"         : DOM.mainCanvas.height  - height ,
				"control"  	: "H",
				"playernum"	: 2
			};
		}
		else{ console.log("INVALID PLAYERNUM"); return; }

		//
		GAMEVARS.PLAYERS.push (
			new Player(
				newPlayer.x        ,
				newPlayer.y        ,
				newPlayer.control  ,
				newPlayer.playernum
			)
		);
	},

	pause : function(){
		if(GAMEVARS.raf_id==null){
			// Request animation frame.
			GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
		}
		else{
			window.cancelAnimationFrame(GAMEVARS.raf_id);
			GAMEVARS.raf_id = null;
		}
	},

	gameloop : function(){
		// If NOT paused then request an animation frame and repeat the set Timeout.
		if(!GAMEVARS.paused && GAMEVARS.pagevisible){
			// (KIND-OF DEBUG) Toggle the paused indicator.
			let pauseState = DOM.pauseState.innerText;
			if     (pauseState=="--"){ DOM.pauseState.innerText = "==" ;  }
			else if(pauseState=="=="){ DOM.pauseState.innerText = "--" ;  }

			// Clear the canvas to ready it for a new screen.
			DOM.preMainCanvas_ctx.fillStyle = "black";
			DOM.preMainCanvas_ctx.fillRect(0, 0, DOM.preMainCanvas.width, DOM.preMainCanvas.height);
			// DOM.mainCanvas_ctx.fillStyle = "black";
			// DOM.mainCanvas_ctx.fillRect(0, 0, DOM.mainCanvas.width, DOM.mainCanvas.height);

			// Update PLAYER positions. (queries the current input.)
			for(let i=0; i<GAMEVARS.PLAYERS.length; i++){
				GAMEVARS.PLAYERS[i].updatePosition();
				GAMEVARS.PLAYERS[i].draw();
			}

			// Update SHOTS positions
			for(let i=0; i<GAMEVARS.SHOTS.length; i++){
				// GAMEVARS.SHOTS[i].updatePosition();
				// GAMEVARS.SHIPS[i].draw();
			}

			// Update SHIPS positions
			for(let i=0; i<GAMEVARS.SHIPS.length; i++){
				// GAMEVARS.SHIPS[i].updatePosition();
				// GAMEVARS.SHIPS[i].draw();
			}

			// Update the output canvas.
			DOM.mainCanvas_ctx.drawImage(DOM.preMainCanvas, 0, 0);

			// Schedule next animation frame.
			GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
		}
		else{
			// Schedule next animation frame.
			GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
		}

	},
};

// DOM cache.
let DOM = {};

// Used during initial load and init.
let LOADER = {
	// This should be run only once.
	init                             : function(){
		// Populate the DOM cache.
		LOADER.populateDOM_cache();

		// Load the graphics.
		LOADER.loadGraphics().then(
			function(){
				// Setup the output canvas.
				LOADER.setpixelated(DOM.mainCanvas);
				DOM.mainCanvas_ctx = DOM.mainCanvas.getContext('2d');

				// Setup the pre-output canvas.
				DOM.preMainCanvas.width  = DOM.mainCanvas.width  ;
				DOM.preMainCanvas.height = DOM.mainCanvas.height ;
				LOADER.setpixelated(DOM.preMainCanvas);
				DOM.preMainCanvas_ctx    = DOM.preMainCanvas.getContext('2d');

				// Prevent the screen from scrolling when using the arrow keys to control the game.
				window.addEventListener("keydown"  , LOADER.preventScroll, false);

				// Setup the event listeners for keyboard controls.
				document.addEventListener("keydown", LOADER.getKeyPress );
				document.addEventListener("keyup"  , LOADER.delKeyPress  );

				// Handle window blur/focus.
				window.addEventListener('focus', LOADER.windowFocus , false );
				window.addEventListener('blur' , LOADER.windowBlur  , false );

				// DEBUG - Setup the mousemove listener for hovering over the canvas.
				if(DEBUG.showCanvasCursorCoords){
					DOM.mainCanvas.addEventListener('mousemove', DEBUG.getCanvasMousePosition, false);
				}

				// Adjust the audio play prototype and then test audio availability.
				LOADER.adjustAudioPlayPrototype();
				LOADER.testAudioAvailability().then(
					function(){
						LOADER.loadSoundFiles().then(
							function(){
								// If the audio is ready then start the game.
								if(GAMEVARS.audiocanplay){
									// Reset game vars.
									GAMEVARS.reset_game_consts();

									//
									FUNCS.startGameFromBeginning();
								}
								// Otherwise, inform the user that they must click on the page.
								else{
									LOADER.addUserInteractionRestriction();
								}
							},
							function(err){ console.log("ERROR:", err); }
						);
					},
					function(err){ console.log("ERROR:", err); }
				);


			},
			function(err){ console.log("ERROR:", err); }
		);
	},
	populateDOM_cache                : function(){
		//
		DOM.mainCanvas = document.getElementById("mainCanvas") ;
		DOM.requestUserInteraction = document.getElementById("requestUserInteraction") ;
		DOM.pauseState = document.getElementById("pauseState")

		// DEBUG
		DOM.chk_debug      = document.getElementById('chk_debug')      ;
		DOM.mouseCoordsDiv = document.getElementById("mouseCoordsDiv") ;
		DOM.debug_output   = document.getElementById('debug_output')   ;

		// Non-attached DOM.
		DOM.preMainCanvas  = document.createElement("canvas");
	},
	setpixelated                     : function(canvas){
		// https://stackoverflow.com/a/13294650
		// https://stackoverflow.com/a/32798277

		let ctx = canvas.getContext("2d");
		// ctx['mozImageSmoothingEnabled']    = false; // Depreciated. Use imageSmoothingEnabled instead.
		ctx.imageSmoothingEnabled       = false; //
		ctx.oImageSmoothingEnabled      = false; //
		ctx.webkitImageSmoothingEnabled = false; //
		ctx.msImageSmoothingEnabled     = false; //

		// image-rendering: crisp-edges;
		// image-rendering: -moz-crisp-edges;
		// image-rendering: -webkit-optimize-contrast;
		// -ms-interpolation-mode: nearest-neighbor;
	},
	loadGraphics                     : function(){
		return new Promise(function(resolve,reject){
			let sprite_coords = {
				// Invaders
				"invader1" : [ { "x":8, "y":48 , "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":48 , "w":32, "h":24, "nW":24, "nH":16 } ],
				"invader2" : [ { "x":8, "y":80 , "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":80 , "w":32, "h":24, "nW":24, "nH":16 } ],
				"invader3" : [ { "x":8, "y":112, "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":112, "w":32, "h":24, "nW":24, "nH":16 } ],
				"invader4" : [ { "x":8, "y":144, "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":144, "w":32, "h":24, "nW":24, "nH":16 } ],
				"invader5" : [ { "x":8, "y":176, "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":176, "w":32, "h":24, "nW":24, "nH":16 } ],
				"invader6" : [ { "x":8, "y":216, "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":216, "w":32, "h":24, "nW":24, "nH":16 } ],

				// Alien Ship
				"ship1"    : [ { "x":8, "y":24, "w":32, "h":16, "nW":24, "nH":16 } ],

				// Player Ship
				"player"   : [ { "x":8, "y":336, "w":32, "h":24, "nW":24, "nH":16 } ],

				// Projectiles
				"shot1"    : [ { "x":22, "y":304, "w":4, "h":16, "nW":4, "nH":16 } ],

				// Barrier
				"barrier"  : [ { "x":8, "y":256, "w":32, "h":40, "nW":32, "nH":40 } ],

				// Hits
				"hit1"     : [ { "x":56, "y":256, "w":32, "h":24, "nW":24, "nH":16 }, { "x":56, "y":288, "w":32, "h":24, "nW":24, "nH":16 } ],
			};

			// Holds the sprite sheet image.
			let images = new Image();
			images.onload=function(){
				// Clear the onload function (only needed once.)
				images.onload=null;

				// Create a temp canvas for our image and draw to it.
				let canvas = document.createElement("canvas");
				canvas.width  = images.width;
				canvas.height = images.height;

				// Disable dithering / anti-aliasing.
				LOADER.setpixelated(canvas);

				// Get canvas context.
				let context = canvas.getContext('2d');

				// Draw the image to the temp canvas.
				context.drawImage(images, 0, 0);

				// Go through sprite_coords and create a cache of individual images of the canvas.
				for(let key1 in sprite_coords){
					// Create initial empty array.
					IMGCACHE[key1] = [];

					for(let rec of sprite_coords[key1]){
						let tmp_canvas = document.createElement("canvas");
						tmp_canvas.width  = rec.nW;
						tmp_canvas.height = rec.nH;
						LOADER.setpixelated(tmp_canvas);
						let tmp_context = tmp_canvas.getContext('2d');

						let sx      = rec.x ;
						let sy      = rec.y ;
						let sWidth  = rec.w ;
						let sHeight = rec.h ;
						let dx      = 0 ;
						let dy      = 0 ;
						let dWidth  = rec.nW ;
						let dHeight = rec.nH ;

						tmp_context.drawImage(images, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

						// console.log(key2);
						IMGCACHE[key1].push( tmp_canvas );
					}
				}

				resolve();
			};
			images.src = 'images/invaders_2_.png';
		});
	},
	// Wrap the native DOM audio element play function and handle any autoplay errors
	adjustAudioPlayPrototype         : function(){
		Audio.prototype.play = (function(play) {
			// https://stackoverflow.com/a/56279295
			return function () {
				let audio   = this;
				let args    = arguments;
				let promise = play.apply(audio, args);


				if (promise !== undefined) {
					promise
					.then(function(e){
						if(!GAMEVARS.audiocanplay){ GAMEVARS.audiocanplay=true; }
					})
					.catch(_ => { GAMEVARS.audiocanplay=false; });
				}
			};
		})(Audio.prototype.play);
	},
	//
	testAudioAvailability            : function(){
		return new Promise(function(resolve,reject){
			// Trigger the audio test. (silent mp3 file and volume 0.)
			let audio = document.createElement("audio");
			audio.src="data:audio/mpeg;base64,/+MQxAAHUjnwAABHif+8AEY/5LA8YxuQ3G4x5FoTu4AhbvEJPRAiTgBmlf+T+sQqkTP4+f/jEsQJB+H2CAAAR4HfeOzEatSORAYLGQYcKQypcLcFB0DCtfys/jn+2yjhiTpEUUjULlVU/+MQxBEHWc4MAABHhQgkdJEQJCEtr6Vl9Ir/9GpGu3sQqHD9XVidC6VWZhcgKleSkaHf1P/jEMQaCFpaBAAAR4AHGxy+rApSdcoZQ8q+VCPhMmNSal5RqTU1/hqCJjUm1JYKCoKCkUL/4xDEHwgKPdQAAEeFqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
			audio.volume=0;
			audio.play();

			if(!GAMEVARS.audiocanplay){ GAMEVARS.audiocanplay=true  ; }
			else                      { GAMEVARS.audiocanplay=false ; }

			resolve();
		});
	},

	//
	addUserInteractionRestriction    : function(){
		DOM.requestUserInteraction.classList.remove("hidden");

		document.addEventListener   ('keydown'    , LOADER.removeUserInteractionRestriction, false);
		document.addEventListener   ('keyup'      , LOADER.removeUserInteractionRestriction, false);
		document.addEventListener   ('mousedown'  , LOADER.removeUserInteractionRestriction, false);
		document.addEventListener   ('mouseup'    , LOADER.removeUserInteractionRestriction, false);
		document.addEventListener   ('touchstart' , LOADER.removeUserInteractionRestriction, false);
		document.addEventListener   ('touchend'   , LOADER.removeUserInteractionRestriction, false);
	},
	removeUserInteractionRestriction : function(){
		document.removeEventListener('keydown'     , LOADER.removeUserInteractionRestriction);
		document.removeEventListener('keyup'       , LOADER.removeUserInteractionRestriction);
		document.removeEventListener('mousedown'   , LOADER.removeUserInteractionRestriction);
		document.removeEventListener('mouseup'     , LOADER.removeUserInteractionRestriction);
		document.removeEventListener('touchstart'  , LOADER.removeUserInteractionRestriction);
		document.removeEventListener('touchend'    , LOADER.removeUserInteractionRestriction);

		DOM.requestUserInteraction.classList.add("hidden");

		GAMEVARS.audiocanplay=true;

		//
		FUNCS.startGameFromBeginning();
	},

	// User Input.
	preventScroll                    : function(e){
		let keys = [
			32, // Space
			37, // ArrowLeft
			38, // ArrowUp
			39, // ArrowDown
			40  // ArrowRight
		];

		if(keys.indexOf(e.keyCode) > -1) { e.preventDefault(); }
	},
	getKeyPress                      : function(e){
		let allowed=[
			37, // P1 LEFT  Left Arrow
			39, // P1 RIGHT Right Arrow
			38, // P1 FIRE  Up Arrow
			65, // P2 LEFT  A Key
			68, // P2 RIGHT D Key
			87, // P2 FIRE  W Key
		];
		if(allowed.indexOf(e.keyCode) != -1){
			GAMEVARS.KEYSTATE[e.keyCode] = true;
		}
	},
	delKeyPress                      : function(e){
		let allowed=[
			37, // P1 LEFT  Left Arrow
			39, // P1 RIGHT Right Arrow
			38, // P1 FIRE  Up Arrow
			65, // P2 LEFT  A Key
			68, // P2 RIGHT D Key
			87, // P2 FIRE  W Key
		];
		if(allowed.indexOf(e.keyCode) != -1){
			GAMEVARS.KEYSTATE[e.keyCode] = false;
		}
	},
	windowFocus                      : function(){ GAMEVARS.pagevisible = true  ; },
	windowBlur                       : function(){ GAMEVARS.pagevisible = false ; },

	// Sounds
	loadSoundFiles                   : function(){
		return new Promise(function(resolve,reject){
			// Create the sound if it is not already cached.
			let keys = Object.keys(GAMEVARS.sounds);
			keys.forEach(function(d,i,a){
				let key = d;
				let value = GAMEVARS.sounds[key];
				if(!value.elem){
					let elem;
					elem = document.createElement("audio");
					elem.src = value.src;
					elem.setAttribute("preload", "auto");
					elem.setAttribute("controls", "none");
					elem.style.display = "none";
					GAMEVARS.sounds[key].elem = elem;
					elem.load();
				}
			});

			resolve();
		});
	},

};

// For DEBUG.
let DEBUG = {
	//
	showCanvasCursorCoords : true,
	getCanvasMousePosition : function(evt){
		let mouseCoordsDiv = DOM.mouseCoordsDiv;

		let getMousePos = function(canvas) {
			let rect = canvas.getBoundingClientRect();

			return {
				// Only works correctly for a non-CSS stretched canvas.
				// x: Math.floor(evt.clientX - rect.left),
				// y: Math.floor(evt.clientY - rect.top )

				// Works correctly for a CSS stretched canvas.
				x: Math.floor((evt.clientX - rect.left) / (rect.right  - rect.left) * DOM.mainCanvas.width ),
				y: Math.floor((evt.clientY - rect.top)  / (rect.bottom - rect.top)  * DOM.mainCanvas.height)
			};
		};

		let mousePos = getMousePos(DOM.mainCanvas, evt);
		let message = '(x:' + mousePos.x + ', y:' + mousePos.y + ')';
		mouseCoordsDiv.innerText = message;
	},

	//
	drawAllGraphics : function(){
		let images = [];
		for(let key in IMGCACHE){
			for(let rec of IMGCACHE[key]){
				images.push(rec);
			}
		}

		let x = 0;
		let y = 0;

		for(let img of images){
			// Bounds check. Would the image be drawn over the boundry?
			if(x+img.width >= DOM.preMainCanvas.width){ x=0; y+=32; }

			// Draw the image.
			DOM.preMainCanvas_ctx.drawImage(img, x, y);

			// Add the img width plus some extra to x.
			x+=img.width+8;
		}

	},

	//
	drawPreCanvasToPostCanvas(){
		DOM.mainCanvas_ctx.drawImage(DOM.preMainCanvas, 0, 0);
	},

};

// ***** User-defined objects used.
// ********************************

function Player (x, y, control, playernum){
	// Passed with 'new'.
	this.x         = x         ;
	this.y         = y         ;
	this.control   = control   ;
	this.playernum = playernum ;

	// Created at instantiation.
	this.score    = 0 ;
	this.shots    = 0 ;
	this.hits     = 0 ;
	this.accuracy = 0 ;
	this.timeshit = 0 ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = "player";
	this.frameNum    = 0;

	//
	this.draw = function(){
		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.frameNum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};

	this.updatePosition = function(){
		let newX = this.x;

		// Check if a keycode is contained within KEYSTATE.
		if(this.playernum==1 && this.control=='H'){
			if (GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS.P1.LEFT.CODE]) { newX -= GAMEVARS.player_xvel; }
			if (GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS.P1.RIGHT.CODE]){ newX += GAMEVARS.player_xvel; }
			// if (GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS.P1.FIRE.CODE]) { this.fire(); }
		}
		else if(this.playernum==2 && this.control=='H'){
			if (GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS.P2.LEFT.CODE]) { newX -= GAMEVARS.player_xvel; }
			if (GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS.P2.RIGHT.CODE]){ newX += GAMEVARS.player_xvel; }
			// if (GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS.P2.FIRE.CODE]) { this.fire(); }
		}

		// Make sure that the new x and y are valid and the Player ships cannot go out of bounds.
		let width = IMGCACHE[this.imgCacheKey][this.frameNum].width;

		// Adjust x if it is in bounds.
		if(  (newX <=0 || newX >= DOM.mainCanvas.width-width) ){
			// console.log("OUT OF BOUNDS", newX);
			return;
		}
		else{
			this.x=newX;
		}
	};

}
function Shot   (x, y, origin){

}
function Ship   (x, y, type){

}
function Invader(x, y, type){

}