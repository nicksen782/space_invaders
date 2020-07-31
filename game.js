"use strict";

window.onload=function(){
	console.log("SPACE INVADERS! " +"(v4)");

	LOADER.init();
};

// Holds the rendered images from the source sprite sheet.
let IMGCACHE={};

// Holds game variables.
let GAMEVARS = {
	// Gameplay variables.
	invader_velx       : 0 , // INVADER x speed.
	invader_vely       : 0 , // INVADER y speed.
	invader_spacing_x  : 0 , // INVADER x spacing.
	invader_spacing_y  : 0 , // INVADER y spacing.
	invader_shot1_vely : 0 , // INVADER shot (y) speed.
	invader_fmax       : 0 , // INVADER frames before changing.
	ship1_velx         : 0 , // SHIP x speed.
	ship1_shot1_vely   : 0 , // SHIP shot (y) speed.
	player_xvel        : 0 , // PLAYER x speed.
	player_shot1_vely  : 0 , // PLAYER shot (y) speed.

	//
	paused            : false   ,
	audiocanplay      : false   ,
	pagevisible       : true    ,
	raf_id            : null    ,
	fps               : 30      ,
	msPerFrame        : 1000/30 ,
	last_raf_tstamp   : 0       ,
	gameover_bottom   : 190     ,
	maxShots_PLAYERS  : 1       ,
	maxShots_SHIPS    : 5       ,
	maxShots_INVADERS : 1       ,
	shotCounts        : {}      , // Cached counts of shot counts grouped by origin.

	// State management
	gamestate_main : 0 ,
	gamestate_sub1 : 0 ,

	// Arrays containing all the entities.
	PLAYERS  : [] ,
	SHOTS    : [] ,
	SHIPS    : [] ,
	INVADERS : [] ,
	BARRIERS : [] ,

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

	// Resets gameplay variables to the default state.
	reset_game_consts : function(){
		let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;

		// Gameplay variables.
		GAMEVARS.invader_velx       =  Math.ceil(w/4) ;
		GAMEVARS.invader_vely       =  Math.ceil(h/2) ;
		GAMEVARS.invader_spacing_x  =  Math.ceil(w/4) ;
		GAMEVARS.invader_spacing_y  =  Math.ceil(h/2) ;
		GAMEVARS.invader_shot1_vely = -4  ;
		GAMEVARS.invader_fmax       = 15  ;
		GAMEVARS.ship1_velx         =  3  ;
		GAMEVARS.ship1_shot1_vely   = -4  ;
		GAMEVARS.player_xvel        =  4  ;
		GAMEVARS.player_shot1_vely  =  6  ;

		// Arrays containing entities.
		GAMEVARS.PLAYERS  = [] ;
		GAMEVARS.SHOTS    = [] ;
		GAMEVARS.SHIPS    = [] ;
		GAMEVARS.INVADERS = [] ;
		GAMEVARS.BARRIERS = [] ;

		//
		GAMEVARS.KEYSTATE = {} ;

		GAMEVARS.paused =  false ;
	},

};

// Game functions.
let FUNCS = {
	//
	startGameFromBeginning : function(){
		// Cancel the current animation frame.
		if(GAMEVARS.raf_id != null){
			window.cancelAnimationFrame(GAMEVARS.raf_id);
		}
		GAMEVARS.raf_id = null;

		// Reset game vars.
		GAMEVARS.reset_game_consts();

		// Handle state.
		//

		// Request animation frame.
		GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
	},

	// STATE MANAGEMENT
	// ****************

	//
	gameover : function(){
		// Reset game.
		FUNCS.startGameFromBeginning();

		// DEBUG
		DEBUG.demoEntities();

		// Handle state.
		//
	},

	// SINGLE-ENTITY ADDITIONS
	// ***********************

	// Adds a new player.
	addPlayer : function(playernum){
		// Make sure that this playernum doesn't already exist.
		let matches = GAMEVARS.PLAYERS.filter(function(d,i,a){ return d.playernum==playernum; });
		if(matches.length){ console.log("PLAYERNUM IS ALREADY IN USE."); return; }

		let newPlayer;
		let width  ;
		let height ;

		if    (playernum==1){
			let width  = IMGCACHE["player"][0].width;
			let height = IMGCACHE["player"][0].height;
			newPlayer = {
				"x"         : DOM.mainCanvas.width/4 - width ,
				"y"         : DOM.mainCanvas.height  - height-2 ,
				"control"  	: "H",
				"playernum"	: 1,
			};
		}
		else if(playernum==2){
			let width  = IMGCACHE["player"][0].width;
			let height = IMGCACHE["player"][0].height;
			newPlayer = {
				"x"         : DOM.mainCanvas.width- DOM.mainCanvas.width/4 - (width) ,
				"y"         : DOM.mainCanvas.height  - height-2 ,
				"control"   : "H",
				"playernum" : 2,
			};
		}
		else{ console.log("INVALID PLAYERNUM"); return; }

		// Add the player.
		// console.log("adding player");
		GAMEVARS.PLAYERS.push (
			new Player(
				newPlayer.x        ,
				newPlayer.y        ,
				newPlayer.control  ,
				newPlayer.playernum
			)
		);
	},

	// Add invader. (Just one.)
	addAlienInvader : function(data){
		GAMEVARS.INVADERS.push (
			new Invader(
				data.x   ,
				data.y   ,
				data.type,
			)
		);
	},

	//
	addShot : function(shot){
		GAMEVARS.SHOTS.push (
			new Shot(
				shot.x   ,
				shot.y   ,
				shot.origin,
			)
		);
	},

	//
	createInvaderGrid : function(){
		// Invader grid is 6x6 of invaders.
		// Each row has only one type of invader.
		// All invaders move together (X and Y.)
		// All invaders share the same dimensions.

		// These will be used as keys to GAMEVARS.IMGCACHE.
		let types = [ "invader1", "invader2", "invader3", "invader4", "invader5", "invader6" ];
		let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		let x = w;
		let y = 0 ;

		//
		for(let row=1; row<=6; row++){
			y = 0 + (row*h) + GAMEVARS.invader_spacing_y*(row-1);

			// Offset for the whole row.
			y+=(h*1)-h/2;

			for(let col=1; col<=6; col++){
				// X is the col times the invader height + col times invader height divided by 4.
				x = ((col-1)*w)  + GAMEVARS.invader_spacing_x*(col-1);

				// Offset for the whole col.
				x+=w/1.5;

				FUNCS.addAlienInvader( {
					"x"    : x ,
					"y"    : y ,
					"type" : types[row-1]
				});

			}

		}

	},

	//
	moveInvaderGrid : function(){
		// Invaders move together.
		// Check the left and right x bounds.
		// If any invader reaches the bounds then they need to move down and change directions.
		// If any invader reaches the bottom then it is game over.

		// Determine if a boundary was reached.
		let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		let boundaryReached;
		for( let invader of GAMEVARS.INVADERS ){
			if(invader.isHit || invader.removeThis){ continue; }
			// Depending on the direction, determine if a boundary was reached.
			if     (invader.dir=="L"){ boundaryReached = (invader.x <= 0 + w / 2);                             }
			else if(invader.dir=="R"){ boundaryReached = (invader.x      + w) >= DOM.mainCanvas.width - w / 2; }

			// Stop looking if any invader reached a boundary.
			if(boundaryReached){
				// console.log("boundary!");
				break;
			}
		}

		// Was a boundary reached?
		if(boundaryReached){
			// Check all invaders to see if they reached the bottom.
			let bottomReached=false;
			for( let invader of GAMEVARS.INVADERS ){
				//
				if(invader.isHit || invader.removeThis){ continue; }

				//
				if(invader.y+h >= GAMEVARS.gameover_bottom){ bottomReached=true; }
			}

			// changeDirectionsOrLose();
			if(bottomReached){
				// GAME OVER!
				FUNCS.gameover();
			}
			else{
				// Game continues

				// Change the x velocity.
				GAMEVARS.invader_velx *= -1;

				for( let invader of GAMEVARS.INVADERS ){
					if(invader.isHit || invader.removeThis){ continue; }

					// Change the direction.
					if     (invader.dir=="L"){ invader.dir="R"; }
					else if(invader.dir=="R"){ invader.dir="L"; }

					// Reset the frameslatency to GAMEVARS.invader_fmax * -1.
					invader.frameslatency= Math.ceil( (GAMEVARS.invader_fmax * -1) / 2 );

					// Move the invader down.
					invader.y += Math.ceil(h/2);
				}
			}
		}
		// Move the invaders group.
		else                  {
			// moveInvaders();
			let moved    = false;
			let framenum = null;

			for(let i=0; i<GAMEVARS.INVADERS.length; i++){
				if(GAMEVARS.INVADERS[i].isHit || GAMEVARS.INVADERS[i].removeThis){ continue; }

				// Change the frame if enough frames have passed by.
				if(GAMEVARS.INVADERS[i].frameslatency >= GAMEVARS.invader_fmax){
					moved=true;
					if     (GAMEVARS.INVADERS[i].framenum==0){ GAMEVARS.INVADERS[i].framenum=1; }
					else if(GAMEVARS.INVADERS[i].framenum==1){ GAMEVARS.INVADERS[i].framenum=0; }
					else                                     { GAMEVARS.INVADERS[i].framenum=0; }

					framenum = GAMEVARS.INVADERS[i].framenum;
					GAMEVARS.INVADERS[i].frameslatency=0;

					// Move the Alien Invader on the X axis.
					GAMEVARS.INVADERS[i].x += GAMEVARS.invader_velx;

					// Make sure that the new x and y are valid and the Alien Invader cannot go out of bounds.
					GAMEVARS.INVADERS[i].x = Math.max( 0, Math.min(GAMEVARS.INVADERS[i].x, DOM.mainCanvas.width - w) );

					// Bounce the Alien Invader on the Y axis.
					if     (GAMEVARS.INVADERS[i].jumpingY == 0){ GAMEVARS.INVADERS[i].y -= 1; }
					else if(GAMEVARS.INVADERS[i].jumpingY == 1){ GAMEVARS.INVADERS[i].y += 1; }
					GAMEVARS.INVADERS[i].jumpingY = ! GAMEVARS.INVADERS[i].jumpingY ;
				}
				// Not enough frames passed? Increase frameslatency for this invader.
				else{
					GAMEVARS.INVADERS[i].frameslatency++;
				}
			}

			// Play the movement sound if there was movement.
			// if(moved){
				// if     (framenum==0){ FUNCS.playSound('alien_invader_move1'); }
				// else if(framenum==1){ FUNCS.playSound('alien_invader_move2'); }
			// }
		}
	},

	// Pauses the game.
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

	// MAIN GAME LOOP
	// **************

	// Determines if enough time has occurred for the next frame to be processed.
	allowFrame : function(tstamp){
		let msSinceLastFrame = tstamp - GAMEVARS.last_raf_tstamp;
		let allowThisFrame = (msSinceLastFrame > GAMEVARS.msPerFrame ? true : false);
		if(!allowThisFrame){ return false ; }
		else               { return true  ; }
	},

	//
	countProjectiles        : function(){
		let projectiles_counts = {};
		let origin;

		for(let i=0; i<GAMEVARS.SHOTS.length; i++){
			origin=GAMEVARS.SHOTS[i].origin;
			if(undefined == projectiles_counts[origin]){ projectiles_counts[origin]=0; }
			projectiles_counts[origin]++;
		}

		// FUNCS.countProjectiles()
		GAMEVARS.shotCounts = projectiles_counts ;
	},

	//
	gameloop : function(tstamp){
		// If NOT paused then request an animation frame and repeat the set Timeout.

		if(!GAMEVARS.paused && GAMEVARS.pagevisible){
			// Can this frame be processed?
			if( ! FUNCS.allowFrame(tstamp) ) {
				// Schedule next animation frame.
				GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
				// console.log("SKIP");
				return;
			}

			// Record the last timestamp from requestAnimationFrame.
			GAMEVARS.last_raf_tstamp = tstamp;

			// Clear the canvas to ready it for a new screen.
			DOM.preMainCanvas_ctx.fillStyle = "black";
			DOM.preMainCanvas_ctx.fillRect(0, 0, DOM.preMainCanvas.width, DOM.preMainCanvas.height);
			// DOM.mainCanvas_ctx.fillStyle = "black";
			// DOM.mainCanvas_ctx.fillRect(0, 0, DOM.mainCanvas.width, DOM.mainCanvas.height);

			// Remove expired shots.
			GAMEVARS.SHOTS   = GAMEVARS.SHOTS.filter  ( function (value) { return ! value.removeThis; } );

			// Update the cached counts of shots. (GAMEVARS.shotCounts)
			FUNCS.countProjectiles();

			// Draw line - lose line.
			DOM.preMainCanvas_ctx.beginPath();
			DOM.preMainCanvas_ctx.moveTo( 0, GAMEVARS.gameover_bottom );
			DOM.preMainCanvas_ctx.lineTo( DOM.mainCanvas.width, GAMEVARS.gameover_bottom);
			DOM.preMainCanvas_ctx.closePath();
			DOM.preMainCanvas_ctx.strokeStyle = 'yellow';
			DOM.preMainCanvas_ctx.lineWidth = 1;
			DOM.preMainCanvas_ctx.stroke();

			// Draw line - bottom line.
			DOM.preMainCanvas_ctx.beginPath();
			DOM.preMainCanvas_ctx.moveTo( 0, DOM.mainCanvas.height-1 );
			DOM.preMainCanvas_ctx.lineTo( DOM.mainCanvas.width, DOM.mainCanvas.height-1);
			DOM.preMainCanvas_ctx.closePath();
			DOM.preMainCanvas_ctx.strokeStyle = 'brown';
			DOM.preMainCanvas_ctx.lineWidth = 1;
			DOM.preMainCanvas_ctx.stroke();

			// Handle creating enemy SHOTS.
			//

			// Update PLAYER positions. (queries the current input too.)
			for(let i=0; i<GAMEVARS.PLAYERS.length; i++){
				GAMEVARS.PLAYERS[i].updatePosition();
				GAMEVARS.PLAYERS[i].draw();
			}

			// Update SHOTS positions
			for(let i=0; i<GAMEVARS.SHOTS.length; i++){
				GAMEVARS.SHOTS[i].updatePosition();
				GAMEVARS.SHOTS[i].draw();
			}

			// Update SHIPS positions
			for(let i=0; i<GAMEVARS.SHIPS.length; i++){
				// GAMEVARS.SHIPS[i].updatePosition();
				// GAMEVARS.SHIPS[i].draw();
			}

			// Update INVADERS positions
			FUNCS.moveInvaderGrid();
			for(let i=0; i<GAMEVARS.INVADERS.length; i++){
				if(GAMEVARS.INVADERS[i].removeThis){ continue; }

				if(GAMEVARS.INVADERS[i].isHit){
					GAMEVARS.INVADERS[i].draw_explode();
					GAMEVARS.INVADERS[i].draw();
				}
				else{
					GAMEVARS.INVADERS[i].draw();
				}

			}

			// Update ALL SHOTS
			for(let i=0; i<GAMEVARS.SHOTS.length; i++){
				// Skip shots that are to be removed.
				if(GAMEVARS.SHOTS[i].removeThis){ console.log("skip shot"); continue; }

				//
				GAMEVARS.SHOTS[i].updatePosition();
				GAMEVARS.SHOTS[i].draw();
			}

			// Update the debug data.
			if(DOM.chk_debug.checked){
				// Update all displayed debug data.
				// DEBUG.updateDebugData();
				window.requestAnimationFrame(DEBUG.updateDebugData);
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

		//
		DOM.currentFPS.innerText="FPS: " + GAMEVARS.fps + " ("+GAMEVARS.msPerFrame.toFixed(2)+" ms)";

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
		DOM.pauseState = document.getElementById("pauseState");
		DOM.currentFPS = document.getElementById("currentFPS");
		DOM.fps_select = document.getElementById("fps_select");

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
				"shot1"    : [ { "x":22, "y":304, "w":4, "h":16, "nW":2, "nH":8 } ],

				// Barrier
				"barrier"  : [ { "x":8, "y":256, "w":32, "h":40, "nW":32, "nH":40 } ],

				// Hits
				"hit1"     : [ { "x":56, "y":256, "w":32, "h":24, "nW":32, "nH":16 }, { "x":56, "y":288, "w":32, "h":24, "nW":32, "nH":16 } ],
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
		if(!DOM.chk_debug.checked){ return; }

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

	// Adjust the FPS.
	adjustFPS : function(dir, newFPS=30){
		// The values may come in as text. Fix it here.
		dir    = parseInt(dir   , 10) ;
		newFPS = parseInt(newFPS, 10) ;

		// Directly set?
		if(dir == 0){
			GAMEVARS.fps = newFPS ;
			GAMEVARS.msPerFrame = 1000 / GAMEVARS.fps ;
		}

		// Raise up by 1?
		else if(dir == 1){
			if(GAMEVARS.fps + 1 <= 60){
				GAMEVARS.fps = GAMEVARS.fps + 1 ;
				GAMEVARS.msPerFrame = 1000 / GAMEVARS.fps ;
			}
		}

		// Lower down by 1?
		else if(dir == -1){
			if(GAMEVARS.fps - 1 > 0){
				GAMEVARS.fps = GAMEVARS.fps - 1 ;
				GAMEVARS.msPerFrame = 1000 / GAMEVARS.fps ;
			}
		}

		// Update the displayed FPS.
		if(dir!=0){ DOM.fps_select.value=""; }
		DOM.currentFPS.innerText="FPS: " + GAMEVARS.fps + " ("+GAMEVARS.msPerFrame.toFixed(2)+" ms)";
	},

	//
	updateDebugData : function(){
		let createTable_type1 = function (headers=[], data={}, caption="", width=400){
			// Create the table.
			let table = document.createElement("table");
			table.style.width=width+"px";

			let captionElem = document.createElement("caption");
			captionElem.style.width=(width-2)+"px";
			captionElem.innerText=caption;
			table.appendChild(captionElem);

			// One row for each var.
			headers.forEach(function(d,i,a){
				let row = table.insertRow(table.rows.length);
				let cell_th = document.createElement("th");
				let cell_td = document.createElement("td");

				cell_th.innerText = d;
				cell_td.innerText = data[d];

				row.appendChild(cell_th);
				row.appendChild(cell_td);
			});

			// Return the table.
			return table;
		};
		let createTable_type2 = function (headers=[], data=[], caption="", width=400){
			// Create the table.
			let table = document.createElement("table");
			table.style.width=width+"px";

			let captionElem = document.createElement("caption");
			captionElem.style.width=(width-2)+"px";
			captionElem.innerText=caption;
			table.appendChild(captionElem);

			// Create the headers.
			let row = table.insertRow(table.rows.length);

			headers.forEach(function(d,i,a){
				// let cell = row.insertCell(i);
				let cell = document.createElement("th");
				cell.innerText = d;
				row.appendChild(cell);
			});

			// Create the data row.
			data.forEach(function(d1,i1,a1){
				row = table.insertRow(table.rows.length);
				headers.forEach(function(d2,i2,a2){
					let cell = document.createElement("td");
					cell.innerText = d1[d2];
					row.appendChild(cell);
				});
			});

			// Return the table.
			return table;
		};

		let shots         = function(){
			let data = {
				"AI" : [],
				"AS" : [],
				"P1" : [],
				"P2" : [],
			};
			GAMEVARS.SHOTS.forEach(function(d,i,a){
				let newRec = {
					"i"          : i            ,
					"x"          : d.x          ,
					"y"          : d.y          ,
					"origin"     : d.origin     ,
					"oob"        : d.removeThis ,
				};

				switch(newRec.origin){
					case "AI" : { data["AI"].push(newRec); break; }
					case "AS" : { data["AS"].push(newRec); break; }
					case "P1" : { data["P1"].push(newRec); break; }
					case "P2" : { data["P2"].push(newRec); break; }
					default   : { break; }
				}
			});

			let headers = [
				"i"          ,
				"x"          ,
				"y"          ,
				"origin"     ,
				"oob" ,
			];

			let table1 = createTable_type2( headers, data["AI"], "Shots (AI) ("+data["AI"].length+")", 135 );
			let table2 = createTable_type2( headers, data["AS"], "Shots (AS) ("+data["AS"].length+")", 135 );
			let table3 = createTable_type2( headers, data["P1"], "Shots (P1) ("+data["P1"].length+")", 135 );
			let table4 = createTable_type2( headers, data["P2"], "Shots (P2) ("+data["P2"].length+")", 135 );

			table1.classList.add("debugTable1");
			table2.classList.add("debugTable1");
			table3.classList.add("debugTable1");
			table4.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			div.appendChild(table1);
			div.appendChild(table2);
			// div.appendChild( document.createElement("br"));
			div.appendChild(table3);
			div.appendChild(table4);

			// Return the table.
			return {
				"div" : div ,
			};
		};
		let players         = function(){
			let data = {
				"P1" : [],
				"P2" : [],
			};
			GAMEVARS.PLAYERS.forEach(function(d,i,a){
				let newRec = {
					"i"           : i             ,
					"x"           : d.x           ,
					"y"           : d.y           ,
					"imgCacheKey" : d.imgCacheKey ,
					"player"      : d.playernum   ,
					"origin"      : d.origin      ,
					"shots"       : d.shots       ,
					"hits"        : d.hits        ,
				};

				switch(newRec.origin){
					case "P1" : { data["P1"].push(newRec); break; }
					case "P2" : { data["P2"].push(newRec); break; }
					default   : { console.log("no origin match"); break; }
				}
			});

			let headers = [
				"i"           ,
				"x"           ,
				"y"           ,
				"imgCacheKey" ,
				"player"      ,
				"shots"       ,
				"hits"        ,
			];

			let table3 = createTable_type2( headers, data["P1"], "Player (P1) ("+data["P1"].length+")", 250 );
			let table4 = createTable_type2( headers, data["P2"], "Player (P2) ("+data["P2"].length+")", 250 );

			table3.classList.add("debugTable1");
			table4.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			// div.appendChild( document.createElement("br"));
			div.appendChild(table3);
			div.appendChild(table4);

			// Return the table.
			return {
				"div" : div ,
			};
		};
		let invaders       = function(){
			let dims = {
				"w": IMGCACHE["invader1"][0].width  ,
				"h": IMGCACHE["invader1"][0].height ,
				"spacing_x"  : GAMEVARS.invader_spacing_x  ,
				"spacing_y"  : GAMEVARS.invader_spacing_y  ,
				"shot1_vely" : GAMEVARS.invader_shot1_vely ,
				"fmax"       : GAMEVARS.invader_fmax       ,
			};

			let mapFunction = function(d,i,a){
				// let dir = (Math.sign(d.dir) == 1 ? 'R' : 'L') ;
				let dir = d.dir;
				let frame = d.frameslatency + "/" + dims.fmax;
				let x = d.x;
				let y = d.y;

				return {
					"i"        : i            ,
					"shots"    : d.shotsFired ,
					"dir"      : dir          ,
					"f"        : frame        ,
					"x"        : x            ,
					"y"        : y            ,
					"isHit" : d.isHit   ,
					"dead"     : d.removeThis ,
					"fnum"     : d.framenum   ,
				};
			};

			let headers = [
				"i",
				"shots",
				"dir"  ,
				"f"    ,
				"x"    ,
				"y"    ,
				"isHit",
				"dead",
				"fnum",
			];

			let data = GAMEVARS.INVADERS.map(mapFunction);

			let len = data.length;
			let data1 = data.splice(0, len/2);
			let data2 = data.splice(0, len/2);

			let table1 = createTable_type2( headers, data1, "Invaders (group 1)", 275 );
			let table2 = createTable_type2( headers, data2, "Invaders (group 2)", 275 );

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			table1.classList.add("debugTable1");
			table2.classList.add("debugTable1");
			div.appendChild(table1);
			div.appendChild(table2);

			// Return the table.
			return {
				"div" : div ,
			};
		};

		let html_shots    = shots();
		let html_players  = players();
		let html_invaders = invaders();

		let div = document.createElement("div");
		div.appendChild(html_players.div);
		div.appendChild(html_invaders.div);
		div.appendChild(html_shots.div);

		DOM.debug_output.innerHTML="";
		DOM.debug_output.appendChild(div);

		// Toggle the paused indicator.
		let pauseState = DOM.pauseState.innerText;
		if     (pauseState==" --"){ DOM.pauseState.innerText = " ==" ;  }
		else if(pauseState==" =="){ DOM.pauseState.innerText = " --" ;  }
	},

	demoEntities : function(){
		// Player 1
		FUNCS.addPlayer(1);

		// Player 2
		FUNCS.addPlayer(2);

		// Invader grid
		FUNCS.createInvaderGrid();

		// Ship
		// FUNCS.createShip();

		// Barriers
		// FUNCS.createBarrier();
	},

	lowerInvaders : function(){
		// let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		for(let invader of GAMEVARS.INVADERS){
			if(invader.isHit || invader.removeThis){ continue; }
			invader.y += Math.ceil(h/2);
		}
	},
	raiseInvaders : function(){
		// let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		for(let invader of GAMEVARS.INVADERS){
			if(invader.isHit || invader.removeThis){ continue; }
			invader.y -= Math.ceil(h/2);
		}
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
	this.isHit = false  ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = "player";
	this.framenum    = 0;

	// Set the origin.
	this.origin=null;
	if     (playernum==1){ this.origin = "P1"; }
	else if(playernum==2){ this.origin = "P2"; }
	else { console.log("ERROR: INVALID PLAYERNUM"); return; }

	//
	this.fire = function(){
		// Update the cached counts for projectiles.
		FUNCS.countProjectiles();

		let player_key;
		if(this.control=='H'){
			if     (this.playernum==1){ player_key = "P1";}
			else if(this.playernum==2){ player_key = "P2";}
			else{
				console.log("INVALID PLAYERNUM");
				return;
			}

			let shotCount = GAMEVARS.shotCounts[player_key] ? GAMEVARS.shotCounts[player_key] : 0 ;

			if(shotCount + 1 <= GAMEVARS.maxShots_PLAYERS){
				// Record this as a shot.
				this.shots+=1;

				// Get the source image.
				let img = IMGCACHE[this.imgCacheKey][this.framenum];
				// let img = IMGCACHE["shot1"][0];

				// Add the new shot into the game.
				let shot = {
					"x"      : this.x + (img.width  /2) - 1,
					"y"      : this.y - (img.height /2) - 1,
					"origin" : player_key
				};

				//
				FUNCS.addShot(shot);

			}
			else{
				// console.log("Max shots for p1 already on the board.", shotCount);
				return;
			}

		}
		// else if(this.control=='C'){
		// }
	};

	//
	this.draw = function(){
		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};

	this.updatePosition = function(){
		let newX = this.x;

		let player_key;

		if(this.control=='H'){
			if     (this.playernum==1){ player_key = "P1";}
			else if(this.playernum==2){ player_key = "P2";}
			else{
				console.log("INVALID PLAYERNUM");
				return;
			}

			// Check if a keycode is contained within KEYSTATE.
			let left  = GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player_key].LEFT.CODE ] ;
			let right = GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player_key].RIGHT.CODE] ;
			let fire  = GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player_key].FIRE.CODE ] ;
			if (left ) { newX -= GAMEVARS.player_xvel; }
			if (right) { newX += GAMEVARS.player_xvel; }
			if (fire ) { this.fire(); }

			// Make sure that the new x and y are valid and the Player ships cannot go out of bounds.
			let width = IMGCACHE[this.imgCacheKey][this.framenum].width;

			// Adjust x if it is in bounds.
			if(  (newX <=0 || newX >= DOM.mainCanvas.width-width) ){
				// console.log("OUT OF BOUNDS", newX);
				return;
			}
			else{
				this.x=newX;
			}
		}
		// else if(this.control=='C'){
		// }

	};

}
function Shot   (x, y, origin){
	// Passed with 'new'.
	this.x      = x      ;
	this.y      = y      ;
	this.origin = origin ;

	//
	this.removeThis=false;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = "shot1";
	this.framenum    = 0;

	// Collision check functions.

	// Axis-Aligned Bounding-Box collision detection.
	this.AABB = function(box1, box2){
		// Check for overlap.
		// let ax = target.pos.x;      let ay = target.pos.y;
		// let aw = target.size.w;     let ah = target.size.h;
		// let bx = projectile.pos.x;  let by = projectile.pos.y;
		// let bw = projectile.size.w; let bh = projectile.size.h;

		let ax = box1.x; let ay = box1.y;
		let aw = box1.w; let ah = box1.h;
		let bx = box2.x; let by = box2.y;
		let bw = box2.w; let bh = box2.h;

		// Axis Aligned Bounding Boxes (AABB). (Is a box overlapping another box?)
		// https://www.youtube.com/watch?v=ghqD3e37R7E
		return (
			ax < bx + bw && // Right  edge of A is left      edge of B
			ay < by + bh && // Bottom edge of A is above top edge of B
			bx < ax + aw && // Right  edge of B is left      edge of A
			by < ay + ah	// Bottom edge of B is above top edge of A
		);
	};

	//
	this.detectCollision = function(rect){
		let collisions = {
			"PLAYERS"  : [] ,
			"SHOTS"    : [] ,
			"SHIPS"    : [] ,
			"INVADERS" : [] ,
			"BARRIERS" : [] ,
		};

		let keys1 = Object.keys(collisions);

		for(let key1 of keys1){
			for(let key2 of GAMEVARS[key1]){
				let rec = key2;

				if(rec.removeThis){ continue; }
				if(rec.isHit)     { continue; }

				let targetImg;
				try{
					targetImg = IMGCACHE[rec.imgCacheKey][rec.framenum];
				}
				catch(e){
					console.log(
						"CATCH:",
						"\n	key1           :", key1            ,
						"\n	rec.imgCacheKey:", rec.imgCacheKey ,
						"\n	rec.framenum   :", rec.framenum    ,
						"\n	rec            :", rec             ,
						"\n	targetImg      :", targetImg       ,
						""
					);
				}

				let collided = this.AABB(
					{
						"x":rect.x , "y":rect.y ,
						"w":rect.w , "h":rect.h ,
					},
					{
						"x":rec.x           , "y":rec.y,
						"w":targetImg.width , "h":targetImg.height,
					}
				);

				if(collided){
					collisions[key1].push(rec);
				}
			}

		}

		return collisions;
	};

	//
	this.updatePosition = function(){
		if(this.removeThis){ console.log("dead shot"); return; }

		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Fired by player?
		if(this.origin == "P1" || this.origin == "P2"){
			// Did the shot leave the screen boundry? (on Y.)
			if(this.y <= 0+img.height){
				// Set the remove flag.
				this.removeThis=true;

				// Update the player's accuracy.
				//

				return;
			}

			//
			let hits = this.detectCollision(
				{
					"x":this.x   , "y":this.y,
					"w":img.width, "h":img.height
				}
			);

			// Did the shot collide with a barrier?
			if     (hits.BARRIERS.length){
				// console.log("BARRIERS hit!", hits.BARRIERS.length, hits);
				this.removeThis=true;
				return;
			}

			// Did the shot collide with a invader?
			else if(hits.INVADERS.length){
				console.log("INVADERS hit!", hits.INVADERS.length, hits);
				this.removeThis=true;

				hits.INVADERS.forEach(function(d,i,a){
					d.isHit         = true;
					d.removeThis    = false;
					d.imgCacheKey   = "hit1";
					d.framenum      = 0;
					d.frameslatency = 0;
					d.explodeRepeat =  0;
					// d.explodeRepeatsMax = 0;
				});
				return;
			}

			// Did the shot collide with a ship?
			else if(hits.SHIPS.length){
				// console.log("SHIPS hit!", hits.SHIPS.length, hits);
				this.removeThis=true;
				return;
			}

			// Shot is still active. Move the shot.
			else{
				// Move the projectile.
				this.y += Math.abs(GAMEVARS.player_shot1_vely) * -1;
			}

		}

		// Fired by enemy?
		else if(this.origin == "AI" || this.origin == "AS"){

			// Did the shot leave the screen boundry? (on Y.)
			if(this.x+img.height <= DOM.mainCanvas.height){
				// Set the remove flag.
				this.removeThis=true;

				// Update the player's accuracy.
				//
			}
			else{
				// Move the projectile.
				this.y += GAMEVARS.player_shot1_vely;
			}

			// Did the shot collide with a player?
		}
	};

	//
	this.draw = function(){
		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};

}
function Ship   (x, y, type){

}
function Invader(x, y, type){
	// Passed with 'new'.
	this.x    = x    ;
	this.y    = y    ;
	this.type = type ;

	// Created at instantiation.
	this.dir           = "R"   ;
	this.frameslatency = 0     ;
	this.jumpingY      = false ;
	this.isHit      = false ;
	this.removeThis    = false ;
	this.shotsFired    = 0 ;
	this.jumpingY      = false ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = type;
	this.framenum    = 0;

	// Explode
	this.explodeRepeat     = 0 ;
	this.explodeRepeatsMax = 1 ;
	this.explodeFramesLatencyMax = 2 ;

	//
	this.draw           = function(){
		// Get the source image.
		// let img = IMGCACHE[this.type][this.framenum];
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};

	this.draw_explode = function(){
		// Animations still remaining?
		if(this.explodeRepeat < this.explodeRepeatsMax){
			this.removeThis=false;
			// if(this.frameslatency >= GAMEVARS.invader_fmax){
			if(this.frameslatency >= this.explodeFramesLatencyMax){
				if     (this.framenum==0){ this.framenum=1; }
				else if(this.framenum==1){ this.framenum=0; this.explodeRepeat+=1; }
				else                     { this.framenum=0; }

				if     (this.jumpingY == 0){ this.y -= 1; }
				else if(this.jumpingY == 1){ this.y += 1; }
				this.jumpingY = ! this.jumpingY ;

				this.frameslatency=0;
			}
			else{
				this.frameslatency += 1; //
			}
		}
		// Animations are done. Remove the Invader.
		else{
			this.isHit=false;
			this.removeThis=true;
		}
	};

	//
	// this.updatePosition = function(){

	// };

	//
	// this.awardPoints    = function(){

	// };
}