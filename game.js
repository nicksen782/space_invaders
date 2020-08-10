"use strict";

window.onload=function(){
	console.log("SPACE INVADERS! " +"(v4)");

	//
	LOADER.init();
};

// Holds the rendered images from the source sprite sheet.
let IMGCACHE={};

// Holds game variables.
let GAMEVARS = {
	// Gameplay variables.
	// invader_info : {
	// },
	// ship_info : {
	// },
	// player_info : {
	// },

	invader_velx       : 0 , // INVADER x speed.
	invader_vely       : 0 , // INVADER y speed.
	invader_spacing_x  : 0 , // INVADER x spacing.
	invader_spacing_y  : 0 , // INVADER y spacing.
	invader_shot_vely  : 0 , // INVADER shot (y) speed.
	invader_fmax       : 0 , // INVADER frames before changing.
	invader_fire_info : {
		"lastFire"       : 0    , // The last fire.
		"nextFire"       : 3000 , // milliseconds since lastFire before the next fire can be made.
		"minWait"        : 500  , // Min time between fires (in ms.)
		"maxWait"        : 1500 , // Max time between fires (in ms.)
		"maxProjectiles" : 5    , // Max number of projectiles allowed for Alien Invaders.
	},

	ship_velx          : 0 , // SHIP x speed.
	ship_shot_vely     : 0 , // SHIP shot (y) speed.
	ship_fire_info : {
		"lastFire"       : 0    , // The last fire.
		"nextFire"       : 4000 , // milliseconds since lastFire before the next fire can be made.
		"minWait"        : 1000 , // Min time between fires (in ms.)
		"maxWait"        : 3000 , // Max time between fires (in ms.)
		"maxProjectiles" : 1    , // Max number of projectiles allowed for Alien Ships.
	},

	player_xvel        : 0 , // PLAYER x speed.
	player_shot_vely   : 0 , // PLAYER shot (y) speed.

	//
	paused             : false   ,
	pausedOnMenu       : false   ,
	audiocanplay       : false   ,
	pagevisible        : true    ,
	raf_id             : null    ,
	fps                : 31      ,
	msPerFrame         : 1000/31 ,
	last_raf_tstamp    : 0       ,
	gameover_bottom    : 215     , // lines
	barrier_top        : 175     , // lines
	maxShots_PLAYERS   : 1       ,
	shotCounts         : {}      , // Cached counts of shot counts grouped by origin.

	// State management
	gamestate_main     : 0 ,
	gamestate_sub1     : 0 ,

	// Arrays containing all the entities.
	PLAYERS            : [] ,
	SHOTS              : [] ,
	SHIPS              : [] ,
	INVADERS           : [] ,
	BARRIERS           : [] ,
	HITS               : [] ,
	JOYSTICKS          : [] , // Set one time.

	// Keyboard controls.
	KEYSTATE           : {},
	KEYBOARD_CONTROLS  : {
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
	sounds             : {
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
	reset_game_consts  : function(){
		let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;

		// Gameplay variables.
		GAMEVARS.invader_velx       = Math.ceil(w/4) ;
		GAMEVARS.invader_vely       = Math.ceil(h/2) ;
		GAMEVARS.invader_spacing_x  = Math.ceil(w/3) ;
		GAMEVARS.invader_spacing_y  = Math.ceil(h/3) ;
		GAMEVARS.invader_shot_vely  = 4  ;
		GAMEVARS.invader_fmax       = 15 ;
		GAMEVARS.ship_velx          = 3  ;
		GAMEVARS.ship_shot_vely     = 5  ;
		GAMEVARS.player_xvel        = 4  ;
		GAMEVARS.player_shot_vely   = 6  ;

		// Arrays containing entities.
		GAMEVARS.PLAYERS  = [] ;
		GAMEVARS.SHOTS    = [] ;
		GAMEVARS.SHIPS    = [] ;
		GAMEVARS.INVADERS = [] ;
		GAMEVARS.BARRIERS = [] ;
		GAMEVARS.HITS     = [] ;

		//
		GAMEVARS.KEYSTATE = {} ;

		GAMEVARS.paused =  false ;
	},

};

// Game functions.
let FUNCS = {
	//
	demoEntities              : function(){
		setTimeout(function(){
			FUNCS.startGameFromBeginning();

			// Player 1
			FUNCS.addPlayer(1);

			// Player 2
			// FUNCS.addPlayer(2);

			// Invader grid
			FUNCS.createInvaderGrid();

			// Ship
			// FUNCS.createShip();

			// Barriers
			FUNCS.createBarrier(0, 1);
			FUNCS.createBarrier(1, 1);
			FUNCS.createBarrier(2, 1);
		}, 500);
	},

	//
	getRandom : function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

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
	gameover               : function(){
		// Reset game.
		FUNCS.startGameFromBeginning();

		// DEBUG
		FUNCS.demoEntities();

		// Handle state.
		//
	},

	// SINGLE-ENTITY ADDITIONS
	// ***********************

	// Adds a new player.
	addPlayer              : function(playernum){
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

	//
	createBarrier          : function(position, type){
		let spacing = DOM.mainCanvas.width/3;

		let positions = [
			{ "x":(spacing/3)+(spacing*0), "y":180 },
			{ "x":(spacing/3)+(spacing*1), "y":180 },
			{ "x":(spacing/3)+(spacing*2), "y":180 },
		];
		let pos = positions[position];

		// Add the barrier.
		GAMEVARS.BARRIERS.push (
			new Barrier(
				Math.ceil(pos.x)    , // x
				Math.ceil(pos.y)    , // y
				type       // type
			)
		);
	},

	// Add invader. (Just one.)
	addAlienInvader        : function(data){
		GAMEVARS.INVADERS.push (
			new Invader(
				data.x   ,
				data.y   ,
				data.type,
			)
		);
	},

	//
	addShot                : function(shot){
		GAMEVARS.SHOTS.push (
			new Shot(
				shot.x   ,
				shot.y   ,
				shot.origin,
			)
		);
	},

	//
	createInvaderGrid      : function(){
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
			y = 0 + ((row-1)*h) + GAMEVARS.invader_spacing_y*(row-1);

			// Offset for the whole row.
			y+=(h*1)-h/2;
			// y+=((h-1)*1)-h/2;

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
	moveInvaderGrid        : function(){
		// Invaders move together.
		// Check the left and right x bounds.
		// If any invader reaches the bounds then they need to move down and change directions.
		// If any invader reaches the bottom then it is game over.

		// Determine if a boundary was reached.
		let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		let boundaryReached;
		for( let invader of GAMEVARS.INVADERS ){
			if(invader.removeThis){ continue; }
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
				let img = IMGCACHE[invader.imgCacheKey][invader.framenum];
				//
				if(invader.removeThis){ continue; }

				//
				if(invader.y+h >= GAMEVARS.gameover_bottom){ bottomReached=true; }

				// Remove the barriers?
				if(GAMEVARS.BARRIERS.length && (invader.y+img.height) >= GAMEVARS.barrier_top){
					console.log("REMOVING BARRIERS!");
					GAMEVARS.BARRIERS=[];
				}
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
					if(invader.removeThis){ continue; }

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
				let invader=GAMEVARS.INVADERS[i];

				if(invader.removeThis){ continue; }

				// Get the source image key and the total number of frames.
				let img = IMGCACHE[invader.imgCacheKey];
				let totalFrames = img.length;

				// Change the frame if enough frames have passed by.
				if(invader.frameslatency >= GAMEVARS.invader_fmax){
					moved=true;

					// Change the frame.
					if(invader.framenum+1==totalFrames){ invader.framenum=0;  }
					else                               { invader.framenum+=1; }

					framenum = invader.framenum;
					invader.frameslatency=0;

					// Move the Alien Invader on the X axis.
					invader.x += GAMEVARS.invader_velx;

					// Make sure that the new x and y are valid and the Alien Invader cannot go out of bounds.
					invader.x = Math.max( 0, Math.min(invader.x, DOM.mainCanvas.width - w) );

					// Bounce the Alien Invader on the Y axis.
					// if     (invader.jumpingY == 0){ invader.y -= 1; }
					// else if(invader.jumpingY == 1){ invader.y += 1; }
					// invader.jumpingY = ! invader.jumpingY ;
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

	// Randomly selects an active invader and adds a shot for it.
	invaderShoot_random    : function(){
		// NOTE: Assumes that an invader is ready to shot.

		// Find an invader that is not dead.
		let active = GAMEVARS.INVADERS.filter(function(d,i,a){
			if(!d.removeThis){ return d; }
		});

		// Make sure least one invader was returned.
		if(!active.length){ return; }

		// Pick an active invader at random.
		let index = FUNCS.getRandom(0, active.length-1);

		// Select the invader.
		let invader = active[index];

		// Update the last fire time.
		let now = Math.floor(performance.now());
		GAMEVARS.invader_fire_info.lastFire = now;

		// Determine the next shot time.
		let min        = GAMEVARS.invader_fire_info.minWait ;
		let max        = GAMEVARS.invader_fire_info.maxWait ;
		let numSeconds = FUNCS.getRandom(min,max);
		GAMEVARS.invader_fire_info.nextFire=numSeconds ;

		// Fire!
		invader.fire();
	},

	// Pauses the game.
	pause                  : function(){
		if(GAMEVARS.raf_id==null){
			//
			LOADER.windowFocus();

			// Request animation frame and store the raf_id.
			GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
		}
		else{
			//
			LOADER.windowBlur();

			// Cancel current animation frame and reset the stored raf_id.
			window.cancelAnimationFrame(GAMEVARS.raf_id);
			GAMEVARS.raf_id = null;
		}
	},

	// GAMELOOP FUNCTIONS
	// ******************

	// Determines if enough time has occurred for the next frame to be processed.
	allowFrame             : function(tstamp){
		// LOADER.fps.tick( tstamp );
		// let fps = LOADER.fps.value;
		// let canRunFrame=false;
		// if(fps>GAMEVARS.fps){ canRunFrame=true; }

		// tstamp = performance.now();

		// Determine how long it has been since the last tstamp.
		let msSinceLastFrame = tstamp - GAMEVARS.last_raf_tstamp;

		// Determine if this frame can be processed.
		let allowThisFrame   = (msSinceLastFrame >= GAMEVARS.msPerFrame ? true : false);

		// If not enough time has occurred then return false.
		if(!allowThisFrame){ return false ; }

		// Otherwise, return true and also record the last tstamp.
		else               {
			// Record the last timestamp from requestAnimationFrame.
			GAMEVARS.last_raf_tstamp = tstamp;

			//
			LOADER.fps.tick( tstamp );

			// Return true to allow the frame to be processed.
			return true  ;
		}
	},

	//
	countProjectiles       : function(){
		let projectiles_counts = {
			"P1":0,
			"P2":0,
			"AI":0,
			"AS":0,
		};
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
	removeExpired          : function(){
		// Remove expired shots.
		GAMEVARS.SHOTS   = GAMEVARS.SHOTS.filter  ( function (value) { return ! value.removeThis; } );

		// Remove expired hits.
		GAMEVARS.HITS = GAMEVARS.HITS.filter  ( function (value) { return ! value.removeThis; } );
	},

	//
	clearCanvas            : function(){
		// Clear the canvas to ready it for a new screen.
		DOM.preMainCanvas_ctx.fillStyle = "black";
		DOM.preMainCanvas_ctx.fillRect(0, 0, DOM.preMainCanvas.width, DOM.preMainCanvas.height);
		// DOM.mainCanvas_ctx.fillStyle = "black";
		// DOM.mainCanvas_ctx.fillRect(0, 0, DOM.mainCanvas.width, DOM.mainCanvas.height);
	},

	//
	drawLines              : function(){
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

		// Draw line - barrier_top
		DOM.preMainCanvas_ctx.beginPath();
		DOM.preMainCanvas_ctx.moveTo( 0, GAMEVARS.barrier_top );
		DOM.preMainCanvas_ctx.lineTo( DOM.mainCanvas.width, GAMEVARS.barrier_top);
		DOM.preMainCanvas_ctx.closePath();
		DOM.preMainCanvas_ctx.strokeStyle = 'blue';
		DOM.preMainCanvas_ctx.lineWidth = 1;
		DOM.preMainCanvas_ctx.stroke();
	},

	//
	handleHits             : function(){
		// Handle hits.
		for(let i=0; i<GAMEVARS.HITS.length; i++){
			// Skip removed hits.
			if(GAMEVARS.HITS[i].removeThis){ continue; }

			// Update the hits.
			GAMEVARS.HITS[i].update();

			// Draw the hits.
			GAMEVARS.HITS[i].draw();
		}
	},

	//
	updatePlayerPositions  : function(){
		// Update PLAYER positions. (queries the current input too.)
		for(let i=0; i<GAMEVARS.PLAYERS.length; i++){
			GAMEVARS.PLAYERS[i].updatePosition();
			GAMEVARS.PLAYERS[i].draw();
		}
	},

	//
	updateShipsPositions   : function(){
		// Update SHIPS positions
		for(let i=0; i<GAMEVARS.SHIPS.length; i++){
			// GAMEVARS.SHIPS[i].updatePosition();
			// GAMEVARS.SHIPS[i].draw();
		}
	},

	//
	updateInvaderPositions : function(){
		// Update INVADERS positions
		FUNCS.moveInvaderGrid();
		for(let i=0; i<GAMEVARS.INVADERS.length; i++){
			// Skip removed invaders.
			if(GAMEVARS.INVADERS[i].removeThis){ continue; }

			//  Draw the invader.
			GAMEVARS.INVADERS[i].draw();
		}
	},

	//
	updateShotsPositions   : function(){
		// Update ALL SHOTS
		for(let i=0; i<GAMEVARS.SHOTS.length; i++){
			// Skip shots that are to be removed.
			if(GAMEVARS.SHOTS[i].removeThis){ console.log("skip shot"); continue; }

			//
			GAMEVARS.SHOTS[i].updatePosition();
			GAMEVARS.SHOTS[i].draw();
		}
	},

	//
	updateBarrierPositions : function(){
		// Update ALL BARRIERS
		for(let i=0; i<GAMEVARS.BARRIERS.length; i++){
			// Skip shots that are to be removed.
			if(GAMEVARS.BARRIERS[i].removeThis){ console.log("skip BARRIER"); continue; }

			//
			GAMEVARS.BARRIERS[i].updatePosition();
			GAMEVARS.BARRIERS[i].draw();
		}
	},

	//
	addInvaderShots        : function(){
		// Update the cached counts of shots. (GAMEVARS.shotCounts)
		FUNCS.countProjectiles();

		// Add shots from INVADERS?
		let now = Math.floor(performance.now());
		if(GAMEVARS.shotCounts["AI"] < GAMEVARS.invader_fire_info.maxProjectiles){
			// Room remains for invader shots. Is it time for the next shot?
			let lastFire = GAMEVARS.invader_fire_info.lastFire;
			let nextFire = GAMEVARS.invader_fire_info.nextFire;
			let canShoot = (now - lastFire) >= (nextFire) ? true : false ;
			if(canShoot){ FUNCS.invaderShoot_random(); }
		}
	},

	//
	addShipShots           : function(){
		// Add shots from SHIPS?
		//
	},

	//
	emulateKeypressByControls : function(player, action, active){
		// console.log(player, action, active);
		let players = [ "P1", "P2" ];
		let actions = [ "left", "right", "fire" ];
		if(players.indexOf(player) == -1) { console.log("INVALID PLAYER: ", player); return ; }
		if(actions.indexOf(action) == -1) { console.log("INVALID ACTION: ", action); return ; }

		if     (action == "left" ) { GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player].LEFT.CODE ] = active ; }
		else if(action == "right") { GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player].RIGHT.CODE] = active ; }
		else if(action == "fire" ) { GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player].FIRE.CODE ] = active ; }
	},
	//
	updateDisplayedControls : function(){
		// let input_indexes  = [0, 1];
		// let input  = input_indexes[i];

		let player_indexes = ["P1", "P2"];
		let ctx_indexes1 = [DOM.joystick1_canvas_ctx, DOM.joystick2_canvas_ctx];
		for(let i=0; i<player_indexes.length; i+=1){
			let player   = player_indexes[i];
			let ctx      = ctx_indexes1[i];
			let canvas   = ctx.canvas;
			let dir      = canvas.getAttribute("dir");
			let left     = GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player].LEFT.CODE ] ;
			let right    = GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player].RIGHT.CODE] ;
			let stickPos = GAMEVARS.JOYSTICKS[i].stickPos;

			if     (left) {
				// Far left?
				if     (stickPos==0){
					ctx.clearRect(0,0,canvas.width, canvas.height);
					ctx.drawImage(IMGCACHE.joystick_left_0[0],0,0);
				}
				// Inside left?
				else if(stickPos==1){
					ctx.clearRect(0,0,canvas.width, canvas.height);
					ctx.drawImage(IMGCACHE.joystick_left_1[0],0,0);
				}

				if(dir!="left"){
					canvas.setAttribute("dir", "left");
				}
			}
			else if(right){
				// Inside right?
				if     (stickPos==3){
					ctx.clearRect(0,0,canvas.width, canvas.height);
					ctx.drawImage(IMGCACHE.joystick_right_3[0],0,0);
				}
				// Far right?
				else if(stickPos==4){
					ctx.clearRect(0,0,canvas.width, canvas.height);
					ctx.drawImage(IMGCACHE.joystick_right_4[0],0,0);
				}

				if(dir!="right"){
					canvas.setAttribute("dir", "right");
				}
			}
			else             {
				if(dir!="idle"){
					ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(IMGCACHE.joystick_idle_2         [0],0,0);
					canvas.setAttribute("dir", "idle");
				}
			}
		}

		let ctx_indexes2 = [DOM.fire1_canvas_ctx, DOM.fire2_canvas_ctx];
		for(let i=0; i<player_indexes.length; i+=1){
			let player = player_indexes[i];
			let fire   = GAMEVARS.KEYSTATE[GAMEVARS.KEYBOARD_CONTROLS[player].FIRE.CODE ] ;
			let ctx    = ctx_indexes2[i];
			let canvas = ctx.canvas;
			let firing = canvas.getAttribute("firing");

			if(fire){
				if(firing=="false"){
					ctx    .clearRect(0,0,canvas.width    , canvas.height    );
					ctx    .drawImage(IMGCACHE.button_pressed  [0],0,0);
					canvas.setAttribute("firing", "true");
				}
			}
			else{
				if(firing=="true"){
					ctx    .clearRect(0,0,canvas.width    , canvas.height    );
					ctx    .drawImage(IMGCACHE.button_unpressed  [0],0,0);
					canvas.setAttribute("firing", "false");
				}
			}

		}

	},

	//
	gameloop               : function(tstamp){
		// If NOT paused then request an animation frame and repeat the set Timeout.
		if( (!GAMEVARS.paused && !GAMEVARS.pausedOnMenu) && GAMEVARS.pagevisible ){

			// Can this frame be processed?
			if( ! FUNCS.allowFrame(tstamp) ) {
				// Schedule next animation frame.
				GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
				return;
			}
			else{
				// Schedule next animation frame.
				GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
			}

			// document.getElementById("debug_calcFPS").innerText = LOADER.fps.value;

			// CLEAN-UP.
			FUNCS.clearCanvas();            // Clear the precanvas for a new frame.
			FUNCS.removeExpired();          // Shots, hits
			FUNCS.drawLines();              //

			// ANIMATIONS
			FUNCS.handleHits();       //

			// POSITIONS
			FUNCS.updateBarrierPositions();  //
			FUNCS.updatePlayerPositions();  //
			FUNCS.updateShipsPositions();   //
			FUNCS.updateInvaderPositions(); //
			FUNCS.updateShotsPositions();   //

			// SHOTS
			FUNCS.addInvaderShots();        //
			FUNCS.addShipShots();           //

			// Update the debug data.
			if(DEBUGMODE && DEBUG.DOM.chk_debug.checked){
				window.requestAnimationFrame(DEBUG.updateDebugData);
			}

			// Update the output canvas.
			DOM.mainCanvas_ctx.drawImage(DOM.preMainCanvas, 0, 0);

			// Update the displayed controls.
			FUNCS.updateDisplayedControls();           //

			// Schedule next animation frame.
			// GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
		}
		else{
			setTimeout(function(){
				// Schedule next animation frame.
				GAMEVARS.raf_id = window.requestAnimationFrame(FUNCS.gameloop);
			}, 1000);
		}

	},
};

// DOM cache.
let DOM = {};

// Used during initial load and init.
let LOADER = {
	// Calculates the average frames per second.
	fps : {
		// colxi: https://stackoverflow.com/a/55644176/2731377
		sampleSize : 60    ,
		value      : 0     ,
		_sample_   : []    ,
		_index_    : 0     ,
		_lastTick_ : false ,

		//
		now          : 0 ,
		delta        : 0 ,
		fps          : 0 ,
		average      : 0 ,
		sampleLength : 0 ,
		i            : 0 ,

		tick : function(timestamp) {
			// if is first tick, just set tick timestamp and return
			if (!this._lastTick_) {
				// this._lastTick_ = performance.now();
				this._lastTick_ = timestamp;
				return 0;
			}

			// calculate necessary values to obtain current tick FPS
			// this.now = performance.now();
			this.now = timestamp;
			this.delta = (this.now - this._lastTick_) / 1000;
			this.fps = 1 / this.delta;

			// add to fps samples, current tick fps value
			this._sample_[this._index_] = Math.round(this.fps);
			// this._sample_[this._index_] = (this.fps);

			// iterate samples to obtain the average
			this.average = 0;
			this.sampleLength = this._sample_.length;
			for (this.i = 0; this.i < this.sampleLength; this.i++) { this.average += this._sample_[this.i]; }
			this.average = Math.round(this.average / this.sampleLength);
			// this.average = (this.average / this.sampleLength);

			// set new FPS
			this.value = this.average;

			// store current timestamp
			this._lastTick_ = this.now;

			// increase sample index counter, and reset it
			// to 0 if exceded maximum sampleSize limit
			this._index_++;
			if (this._index_ === this.sampleSize) { this._index_ = 0; }
			return this.value;
		}
	},

	//
	toggleMenu                       : function(){
		// Update the debug data.
		if(DEBUGMODE && DEBUG.DOM.chk_debug.checked){
			window.requestAnimationFrame(DEBUG.updateDebugData);
		}

		// Open the menu.
		if( DOM.menu.classList.contains("closed") ){
			//
			DOM.menu.classList.remove('closed');
			DOM.menu_tab.innerText="CLICK TO CLOSE MENU";
			GAMEVARS.pausedOnMenu=true;

			//
			DOM.entireBodyDiv.classList.add("show");
			DOM.entireBodyDiv.onclick=function(){
				DOM.menu.classList.add('closed');
				DOM.menu_tab.innerText="CLICK TO OPEN MENU";
				GAMEVARS.pausedOnMenu=false;
				DOM.entireBodyDiv.classList.remove("show");
				DOM.entireBodyDiv.onclick=null;
			};
		}

		// Close the menu.
		else{
			//
			DOM.menu.classList.add('closed');
			DOM.menu_tab.innerText="CLICK TO OPEN MENU";
			GAMEVARS.pausedOnMenu=false;

			//
			DOM.entireBodyDiv.classList.remove("show");
			DOM.entireBodyDiv.onclick=function(){
				DOM.menu.classList.remove('closed');
				DOM.menu_tab.innerText="CLICK TO CLOSE MENU";
				GAMEVARS.pausedOnMenu=true;
				DOM.entireBodyDiv.classList.add("show");
				DOM.entireBodyDiv.onclick=null;
			};
		}

	},

	//
	defaultDocumentTitle             : "",

	// This should be run only once.
	init                             : function(){
		//
		LOADER.defaultDocumentTitle=document.title;

		// Populate the DOM cache.
		LOADER.populateDOM_cache();

		//
		if(DEBUGMODE){
			DEBUG.DOM.currentFPS.innerText="" + GAMEVARS.fps + " ("+GAMEVARS.msPerFrame.toFixed(2)+" ms)";
		}

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

				//
				LOADER.setupInput();

				// DEBUG - Setup the mousemove listener for hovering over the canvas.
				if(DEBUGMODE && DEBUG.showCanvasCursorCoords){
					// Move
					DOM.mainCanvas       .addEventListener('mousemove', DEBUG.getCanvasMousePosition, false);
					DOM.joystick1_canvas .addEventListener('mousemove', DEBUG.getCanvasMousePosition, false);
					DOM.joystick2_canvas .addEventListener('mousemove', DEBUG.getCanvasMousePosition, false);
					DOM.fire1_canvas     .addEventListener('mousemove', DEBUG.getCanvasMousePosition, false);
					DOM.fire2_canvas     .addEventListener('mousemove', DEBUG.getCanvasMousePosition, false);

					// Leave
					DOM.mainCanvas       .addEventListener('mouseleave', DEBUG.resetCanvasMousePositions, false);
					DOM.joystick1_canvas .addEventListener('mouseleave', DEBUG.resetCanvasMousePositions, false);
					DOM.joystick2_canvas .addEventListener('mouseleave', DEBUG.resetCanvasMousePositions, false);
					DOM.fire1_canvas     .addEventListener('mouseleave', DEBUG.resetCanvasMousePositions, false);
					DOM.fire2_canvas     .addEventListener('mouseleave', DEBUG.resetCanvasMousePositions, false);
				}

				// Adjust the audio play prototype and then test audio availability.
				LOADER.adjustAudioPlayPrototype();
				LOADER.testAudioAvailability().then(
					function(){
						LOADER.loadSoundFiles().then(
							function(){
								// Unhide the menu div.
								DOM.menu.classList.add('ready');
								DOM.menu_div.classList.add("available");

								// Populate data in the menu.
								LOADER.populateMenu_data();

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

	//
	populateDOM_cache                : function(){
		//
		DOM.mainCanvas = document.getElementById("mainCanvas") ;
		DOM.requestUserInteraction = document.getElementById("requestUserInteraction") ;

		// Non-attached DOM.
		DOM.preMainCanvas  = document.createElement("canvas");

		// Input controls canvas.
		DOM.joystick1_canvas = document.getElementById("joystick1_canvas") ;
		DOM.joystick2_canvas = document.getElementById("joystick2_canvas") ;
		DOM.fire1_canvas     = document.getElementById("fire1_canvas")     ;
		DOM.fire2_canvas     = document.getElementById("fire2_canvas")     ;

		// MENU
		DOM.menu_div = document.getElementById('menu_div');
		DOM.menu     = document.getElementById('menu');
		DOM.menu_tab = document.getElementById('menu_tab');

		DOM.menu_player_size_normal = document.getElementById('menu_player_size_normal');
		DOM.menu_player_size_large  = document.getElementById('menu_player_size_large');
		DOM.menu_player_size_larger = document.getElementById('menu_player_size_larger');

		//
		DOM.entireBodyDiv = document.getElementById('entireBodyDiv');

		if(DEBUGMODE){ DEBUG.populateDebugDOM(); }
	},

	populateMenu_data                : function(){
		let canvas1 = DOM.menu_player_size_normal ;
		let canvas2 = DOM.menu_player_size_large  ;
		let canvas3 = DOM.menu_player_size_larger ;
		let ctx1 = DOM.menu_player_size_normal.getContext('2d');
		let ctx2 = DOM.menu_player_size_large .getContext('2d');
		let ctx3 = DOM.menu_player_size_larger.getContext('2d');

		// Set canvas width.
		canvas1.width = IMGCACHE.player[0].width        ; canvas1.height = IMGCACHE.player[0].height        ;
		canvas2.width = IMGCACHE.player_large[0].width  ; canvas2.height = IMGCACHE.player_large[0].height  ;
		canvas3.width = IMGCACHE.player_larger[0].width ; canvas3.height = IMGCACHE.player_larger[0].height ;

		// Set canvas CSS width. (Main canvas is square.)
		let data1 = DOM.mainCanvas.getBoundingClientRect();
		let data2 = DOM.mainCanvas.width;
		let ratio = (data2/data1.width);
		canvas1.style.width = Math.floor(canvas1.width / ratio)+"px" ; canvas1.style.height = Math.floor(canvas1.height / ratio)+"px";
		canvas2.style.width = Math.floor(canvas2.width / ratio)+"px" ; canvas2.style.height = Math.floor(canvas2.height / ratio)+"px";
		canvas3.style.width = Math.floor(canvas3.width / ratio)+"px" ; canvas3.style.height = Math.floor(canvas3.height / ratio)+"px";

		// Draw
		ctx1.drawImage(IMGCACHE.player[0], 0, 0);
		ctx2.drawImage(IMGCACHE.player_large[0], 0, 0);
		ctx3.drawImage(IMGCACHE.player_larger[0], 0, 0);
	},

	//
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

	//
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
				"ship"     : [ { "x":8, "y":24, "w":32, "h":16, "nW":24, "nH":16 } ],

				// Player Ship
				"player"       : [ { "x":8, "y":336, "w":32, "h":24, "nW":24*1  , "nH":16 } ],
				"player_large" : [ { "x":8, "y":336, "w":32, "h":24, "nW":24*1.5, "nH":16 } ],
				"player_larger": [ { "x":8, "y":336, "w":32, "h":24, "nW":24*2  , "nH":16 } ],

				// Projectiles
				"shot"     : [ { "x":22, "y":304, "w":4, "h":16, "nW":2, "nH":12 } ],

				// Barrier
				"barrier"  : [ { "x":8, "y":256, "w":32, "h":40, "nW":32, "nH":32 } ],

				// Hits
				"hit1"     : [ { "x":56, "y":256, "w":32, "h":24, "nW":32, "nH":16 }, { "x":56, "y":288, "w":32, "h":24, "nW":32, "nH":16 } ],
				"hit2"     : [ { "x":56, "y":256, "w":32, "h":24, "nW":32, "nH":16 }, { "x":56, "y":288, "w":32, "h":24, "nW":32, "nH":16 } ],
				"hit3"     : [ { "x":56, "y":256, "w":32, "h":24, "nW":32, "nH":16 }, { "x":56, "y":288, "w":32, "h":24, "nW":32, "nH":16 } ],

				// Joystick
				"joystick_left_0"  : [ { "x":13*8, "y":16*8 , "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],
				"joystick_left_1"  : [ { "x":13*8, "y":21*8 , "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],
				"joystick_idle_2"  : [ { "x":13*8, "y":26*8 , "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],
				"joystick_right_3" : [ { "x":13*8, "y":31*8 , "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],
				"joystick_right_4" : [ { "x":13*8, "y":36*8 , "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],

				// Buttons
				"button_unpressed" : [ { "x":13*8, "y":6*8 , "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],
				"button_pressed"   : [ { "x":13*8, "y":11*8, "w":4*8, "h":4*8, "nW":(4*8), "nH":(4*8) } ],
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
						let dWidth  = Math.ceil(rec.nW) ;
						let dHeight = Math.ceil(rec.nH) ;

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

	//
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

			switch(e.keyCode){
				case 37 : { GAMEVARS.JOYSTICKS[0].stickPos = 1; break; } // P1 LEFT  Left Arrow
				case 39 : { GAMEVARS.JOYSTICKS[0].stickPos = 3; break; } // P1 RIGHT Right Arrow
				case 65 : { GAMEVARS.JOYSTICKS[1].stickPos = 1; break; } // P2 LEFT  A Key
				case 68 : { GAMEVARS.JOYSTICKS[1].stickPos = 3; break; } // P2 RIGHT D Key
				// case 38 : { break; } // P1 FIRE  Up Arrow
				// case 87 : { break; } // P2 FIRE  W Key
				default : { break; }
			}
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

			switch(e.keyCode){
				case 37 : { GAMEVARS.JOYSTICKS[0].stickPos = 2; break; } // P1 LEFT  Left Arrow
				case 39 : { GAMEVARS.JOYSTICKS[0].stickPos = 2; break; } // P1 RIGHT Right Arrow
				case 65 : { GAMEVARS.JOYSTICKS[1].stickPos = 2; break; } // P2 LEFT  A Key
				case 68 : { GAMEVARS.JOYSTICKS[1].stickPos = 2; break; } // P2 RIGHT D Key
				// case 38 : { break; } // P1 FIRE  Up Arrow
				// case 87 : { break; } // P2 FIRE  W Key
				default : { break; }
			}
		}
	},

	//
	windowFocus                      : function(){ document.title=""     + LOADER.defaultDocumentTitle ; GAMEVARS.pagevisible = true  ; },

	//
	windowBlur                       : function(){ document.title="(P) " + LOADER.defaultDocumentTitle ; GAMEVARS.pagevisible = false ; },

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

	//
	setupInput                      : function(){
		// Setup joystick input canvases (player 1)
		DOM.joystick1_canvas.width  = IMGCACHE.joystick_idle_2[0].width ;
		DOM.joystick1_canvas.height = IMGCACHE.joystick_idle_2[0].height ;
		LOADER.setpixelated(DOM.joystick1_canvas);
		DOM.joystick1_canvas_ctx    = DOM.joystick1_canvas.getContext('2d', {'alpha':false});
		DOM.joystick1_canvas_ctx.drawImage(IMGCACHE.joystick_idle_2[0],0,0);

		// Setup joystick input canvases (player 2)
		DOM.joystick2_canvas.width  = IMGCACHE.joystick_idle_2[0].width ;
		DOM.joystick2_canvas.height = IMGCACHE.joystick_idle_2[0].height ;
		LOADER.setpixelated(DOM.joystick2_canvas);
		DOM.joystick2_canvas_ctx    = DOM.joystick2_canvas.getContext('2d', {'alpha':false});
		DOM.joystick2_canvas_ctx.drawImage(IMGCACHE.joystick_idle_2[0],0,0);

		// Add the joysticks.
		GAMEVARS.JOYSTICKS.push( new Joystick(DOM.joystick1_canvas, "P1") );
		GAMEVARS.JOYSTICKS.push( new Joystick(DOM.joystick2_canvas, "P2") );

		// Setup fire input canvases (player 1)
		DOM.fire1_canvas.width  = IMGCACHE.button_pressed[0].width  ;
		DOM.fire1_canvas.height = IMGCACHE.button_pressed[0].height ;
		LOADER.setpixelated(DOM.fire1_canvas);
		DOM.fire1_canvas_ctx    = DOM.fire1_canvas.getContext('2d');
		DOM.fire1_canvas_ctx.drawImage(IMGCACHE.button_unpressed[0],0,0);

		// Setup fire input canvases (player 2)
		DOM.fire2_canvas.width  = IMGCACHE.button_pressed[0].width  ;
		DOM.fire2_canvas.height = IMGCACHE.button_pressed[0].height ;
		LOADER.setpixelated(DOM.fire2_canvas);
		DOM.fire2_canvas_ctx    = DOM.fire2_canvas.getContext('2d');
		DOM.fire2_canvas_ctx.drawImage(IMGCACHE.button_unpressed[0],0,0);

		// Touch fire listeners (player 1 and player 2)
		if("ontouchstart" in document.documentElement){
			// Fire button listeners (player 1).
			DOM.fire1_canvas.addEventListener("touchstart"  , function(e){ FUNCS.emulateKeypressByControls('P1', 'fire' , true);  e.preventDefault(); }, false);
			DOM.fire1_canvas.addEventListener("touchend"    , function(e){ FUNCS.emulateKeypressByControls('P1', 'fire' , false); e.preventDefault(); }, false);
			DOM.fire1_canvas.addEventListener("touchcancel" , function(e){ FUNCS.emulateKeypressByControls('P1', 'fire' , false); e.preventDefault(); }, false);

			// Fire button listeners (player 2).
			DOM.fire2_canvas.addEventListener("touchstart"  , function(e){ FUNCS.emulateKeypressByControls('P2', 'fire' , true);  e.preventDefault(); }, false);
			DOM.fire2_canvas.addEventListener("touchend"    , function(e){ FUNCS.emulateKeypressByControls('P2', 'fire' , false); e.preventDefault(); }, false);
			DOM.fire2_canvas.addEventListener("touchcancel" , function(e){ FUNCS.emulateKeypressByControls('P2', 'fire' , false); e.preventDefault(); }, false);
		}

		// Mouse fire listeners (player 1 and player 2)
		DOM.fire1_canvas.addEventListener("mousedown"  , function(e){ FUNCS.emulateKeypressByControls('P1', 'fire' , true);  e.preventDefault(); }, false);
		DOM.fire1_canvas.addEventListener("mouseup"    , function(e){ FUNCS.emulateKeypressByControls('P1', 'fire' , false); e.preventDefault(); }, false);
		DOM.fire1_canvas.addEventListener("mouseleave" , function(e){ FUNCS.emulateKeypressByControls('P1', 'fire' , false); e.preventDefault(); }, false);
		//
		DOM.fire2_canvas.addEventListener("mousedown"  , function(e){ FUNCS.emulateKeypressByControls('P2', 'fire' , true);  e.preventDefault(); }, false);
		DOM.fire2_canvas.addEventListener("mouseup"    , function(e){ FUNCS.emulateKeypressByControls('P2', 'fire' , false); e.preventDefault(); }, false);
		DOM.fire2_canvas.addEventListener("mouseleave" , function(e){ FUNCS.emulateKeypressByControls('P2', 'fire' , false); e.preventDefault(); }, false);
	},
};

// ***** User-defined objects used.
// ********************************

//
function Joystick(canvas, player){
	// Drag left and right display different joystick frames.

	// this.self   = this;
	let self   = this;
	self.canvas = canvas;
	self.player = player;
	self.maxDiff = 50;
	self.deadzone = 1;
	self.stickPos = 2; // 0, 1, (2), 3, 4

	this.dragStart = null;
	this.currentPos = { x: 0, y: 0 };

	this.handleMouseDown = function(event) {
		// stick.style.transition = '0s';
		if (event.changedTouches) {
			self.dragStart = {
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
			};

			FUNCS.emulateKeypressByControls(player, 'left', false);
			FUNCS.emulateKeypressByControls(player, 'right', false);
			self.stickPos=2;

			return;
		}
		else{
			self.dragStart = {
				x: event.clientX,
				y: event.clientY,
			};

			FUNCS.emulateKeypressByControls(player, 'left', false);
			FUNCS.emulateKeypressByControls(player, 'right', false);
			self.stickPos=2;
		}

	};

	this.handleMouseMove = function(event) {
		if (self.dragStart === null || self.dragStart === undefined) { return; }

		event.preventDefault();

		if (event.changedTouches) {
			event.clientX = event.changedTouches[0].clientX;
			event.clientY = event.changedTouches[0].clientY;
		}

		const xDiff    = event.clientX - self.dragStart.x;
		const yDiff    = event.clientY - self.dragStart.y;
		const angle    = Math.atan2(yDiff, xDiff);
		const distance = Math.min(self.maxDiff, Math.hypot(xDiff, yDiff));
		const xNew     = distance * Math.cos(angle);
		const yNew     = distance * Math.sin(angle);

		// stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
		self.currentPos = { x: Math.floor(xNew), y: Math.floor(yNew) };

		let left  = (Math.sign(xNew) == -1 ? true : false) && xNew ; // < self.deadzone;
		let right = (Math.sign(xNew) ==  1 ? true : false) && xNew ; // > self.deadzone;

		let width = self.canvas.width;

		let BETWEEN = function(x, min, max){
			// return ((x-min)*(x-max) <= 0);
			return x >= min && x<= max;
		};

		if     (left) {
			FUNCS.emulateKeypressByControls(player, 'left'  , true );
			FUNCS.emulateKeypressByControls(player, 'right' , false);
			if     ( BETWEEN( Math.abs(xNew), (width/2), (width)   ) ){ self.stickPos=0; } // Far left.
			else if( BETWEEN( Math.abs(xNew), (0)      , (width/2) ) ){ self.stickPos=1; } // Inside left.
		}
		else if(right){
			FUNCS.emulateKeypressByControls(player, 'left' , false);
			FUNCS.emulateKeypressByControls(player, 'right', true );
			if     ( BETWEEN( Math.abs(xNew), (0)      , (width/2) ) ){ self.stickPos=3; } // Inside right.
			else if( BETWEEN( Math.abs(xNew), (width/2), (width)   ) ){ self.stickPos=4; } // Far right.
		}
		else{
			FUNCS.emulateKeypressByControls(player, 'left' , false);
			FUNCS.emulateKeypressByControls(player, 'right', false);
			self.stickPos=2;
		}
	};

	this.handleMouseUp   = function(event) {
		if (self.dragStart === null || self.dragStart === undefined) { return; }
		// stick.style.transition = '.2s';
		// stick.style.transform = `translate3d(0px, 0px, 0px)`;
		self.dragStart = null;
		self.currentPos = { x: 0, y: 0 };

		FUNCS.emulateKeypressByControls(player, 'left' , false);
		FUNCS.emulateKeypressByControls(player, 'right' , false);
		self.stickPos=2;
	};

	this.canvas.addEventListener('mousedown'  , this.handleMouseDown);
	this.canvas.addEventListener('mouseup'    , this.handleMouseUp);
	this.canvas.addEventListener('mousemove'  , this.handleMouseMove);
	this.canvas.addEventListener('mouseleave' , this.handleMouseUp);

	if("ontouchstart" in document.documentElement){
		this.canvas.addEventListener('touchstart' , this.handleMouseDown);
		this.canvas.addEventListener('touchmove'  , this.handleMouseMove);
		this.canvas.addEventListener('touchend'   , this.handleMouseUp);
		this.canvas.addEventListener('touchcancel', this.handleMouseUp);
	}
}

//
function Player (x, y, control, playernum){
	// Passed with 'new'.
	this.x           = x         ;
	this.y           = y         ;
	this.control     = control   ;
	this.playernum   = playernum ;

	// Created at instantiation.
	this.score       = 0 ;
	this.shots       = 0 ;
	this.hits        = 0 ;
	this.accuracy    = "0.00%" ;
	this.timeshit    = 0 ;
	this.lastFire    = 0 ;
	this.nextFire    = 0 ;
	this.firingFreq  = 125 ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = "player";
	this.framenum    = 0;

	// Set the origin.
	this.origin=null;
	if     (playernum==1){ this.origin = "P1"; }
	else if(playernum==2){ this.origin = "P2"; }
	else { console.log("ERROR: INVALID PLAYERNUM"); return; }

	// Adds a new shot from the player.
	this.fire           = function(){
		let player_key;
		if(this.control=='H'){
			if     (this.playernum==1){ player_key = "P1";}
			else if(this.playernum==2){ player_key = "P2";}
			else{
				console.log("INVALID PLAYERNUM");
				return;
			}

			// Shot frequency is speed-limited.
			let now = Math.floor(performance.now());
			if( (now - this.lastFire) >= this.firingFreq ){
				// Update the cached counts for projectiles.
				FUNCS.countProjectiles();

				let shotCount = GAMEVARS.shotCounts[player_key] ? GAMEVARS.shotCounts[player_key] : 0 ;

				if(shotCount + 1 <= GAMEVARS.maxShots_PLAYERS){
					// Record this as a shot.
					this.shots+=1;

					// Get the source image.
					let img = IMGCACHE[this.imgCacheKey][this.framenum];
					// let img = IMGCACHE["shot"][0];

					// Add the new shot into the game.
					let shot = {
						"x"      : this.x + (img.width  /2) - 1,
						"y"      : this.y - (img.height /2) - 1,
						"origin" : player_key
					};

					//
					FUNCS.addShot(shot);

					// Record the last fire time.
					this.lastFire = now;
				}
				else{
					// console.log("Max shots for p1 already on the board.", shotCount);
					return;
				}

			}


		}
		// else if(this.control=='C'){
		// }
	};

	// Draws the player.
	this.draw           = function(){
		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);

		// Draw a color line under the player.
		let color ;
		if     (this.playernum==1){ color = "red" ; }
		else if(this.playernum==2){ color = "blue"; }
		DOM.preMainCanvas_ctx.fillStyle = color;
		DOM.preMainCanvas_ctx.fillRect(this.x, this.y+img.height, img.width, 1);
	};

	// Updates the player's position.
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

			// Adjust frame?
			let img = IMGCACHE[this.imgCacheKey];
			let totalFrames = img.length;
			if(this.framenum+1==totalFrames){ this.framenum=0 ; }
			else                            { this.framenum+=1; }

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

	// Updates the shot/hit accuracy for this player.
	this.updateAccuracy = function(){
		// Make sure there are both hits and shots counted.
		if(this.hits && this.shots){
			// Re-calculate.
			this.accuracy = (this.hits / this.shots) * 100;

			// Adjust to be a string.
			this.accuracy = parseInt(this.accuracy, 10).toFixed(1) + "%";
		}
	};

}

//
function Shot   (x, y, origin){
	// Passed with 'new'.
	this.x           = x      ;
	this.y           = y      ;
	this.origin      = origin ;

	//
	this.removeThis  = false;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = "shot";
	this.framenum    = 0;

	// Axis-Aligned Bounding-Box collision detection.
	this.AABB                 = function(box1, box2){
		// Check for overlap.
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

	// Used with AABB to detect overlap with rectangles.
	this.detectCollision      = function(rect){
		let collisions = {
			"PLAYERS"  : [] ,
			"SHOTS"    : [] ,
			"SHIPS"    : [] ,
			"INVADERS" : [] ,
			"BARRIERS" : [] ,
		};

		let keys1 = Object.keys(collisions);

		// Go through the collision keys...
		for(let key1 of keys1){
			// Go through the actual data...
			for(let key2 of GAMEVARS[key1]){
				// Get the data record.
				let rec = key2;

				// Skip if it has been set to removed.
				if(rec.removeThis){ continue; }

				// Get the image for the target box.
				let targetImg = IMGCACHE[rec.imgCacheKey][rec.framenum];

				// Determine if the two boxes overlap.
				let collided = this.AABB(
					// Box 1 (source)
					{
						"x":rect.x , "y":rect.y ,
						"w":rect.w , "h":rect.h ,
					},
					// Box 2 (target)
					{
						"x":rec.x           , "y":rec.y,
						"w":targetImg.width , "h":targetImg.height,
					}
				);

				// Add the collision if there was one.
				if(collided){ collisions[key1].push(rec); }
			}

		}

		return collisions;
	};

	// Gets firing origin and then updates the accuracy value. (P1 and P2 only.)
	this.updateOriginAccuracy = function(){
		if(this.origin == "P1" || this.origin == "P2"){
			let player = this.getFiringOrigin();
			if(!player){ console.log("ERROR: PLAYERNUM NOT FOUND."); return ; }
			player.updateAccuracy();
		}
	};

	// Returns a reference to the firing origin record.
	this.getFiringOrigin      = function(){
		let thisShot = this;
		let player = GAMEVARS.PLAYERS.filter(function(d,i,a){ return d.origin==thisShot.origin; });
		if(!player){ console.log("ERROR: PLAYERNUM NOT FOUND."); return false; }
		player=player[0];
		return player;
	};

	// Moves this shot, registers and handles hits.
	this.updatePosition       = function(){
		if(this.removeThis){ console.log("dead shot"); return; }

		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Fired by player?
		if(this.origin == "P1" || this.origin == "P2"){
			let player = this.getFiringOrigin();

			// Did the shot leave the screen boundry? (on Y.)
			if(this.y <=0+img.height){
				// Set the remove flag.
				this.removeThis=true;

				// Update the origin's accuracy.
				this.updateOriginAccuracy();

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
			if     (hits.BARRIERS.length && hits.BARRIERS[0].barrierHit(this)){
				// console.log("BARRIERS hit!", hits.BARRIERS.length, hits);

				// Remove the shot.
				this.removeThis=true;

				return;
			}

			// Did the shot collide with a invader?
			else if(hits.INVADERS.length){
				// console.log("INVADERS hit!", hits.INVADERS.length, hits);

				// Set the shot to be removed.
				this.removeThis   = true;

				// Select the first invader.
				// (If there were more hit then they will not register as hit.)
				let invader        = hits.INVADERS[0];

				// Create new hit.
				let img = IMGCACHE[invader.imgCacheKey][invader.framenum];

				// Add the new hit into the game.
				GAMEVARS.HITS.push(
					new Hit(
						invader.x       , // "x"
						invader.y       , // "y"
						img.width       , // "w"
						img.height      , // "h"
						invader.hitType   // "hitType"
					)
				);

				// Award points.
				invader.awardPoints(player);

				// Update hit count.
				player.hits+=1;

				// Update the origin's accuracy.
				this.updateOriginAccuracy();

				// Set invader data.
				invader.resetForRemoval();

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
				this.y += Math.abs(GAMEVARS.player_shot_vely) * -1;
			}

		}

		// Fired by enemy?
		else if(this.origin == "AI" || this.origin == "AS"){
			// Did the shot leave the screen boundry? (on Y.)
			if(this.y >= DOM.mainCanvas.height-img.height){
				// Set the remove flag.
				this.removeThis=true;

				// Update the enemy's accuracy.
				//

				return;
			}

			let hits = this.detectCollision(
				{
					"x":this.x   , "y":this.y,
					"w":img.width, "h":img.height
				}
			);

			// Did the shot collide with a barrier?
			if     (hits.BARRIERS.length && hits.BARRIERS[0].barrierHit(this)){
				// console.log("BARRIERS hit!", hits.BARRIERS.length, hits);

				// Remove the shot.
				this.removeThis=true;

				return;
			}

			// Did the shot collide with a player?
			else if     (hits.PLAYERS.length){
				this.removeThis=true;
				return;
			}

			// Shot is still active. Move the shot.
			else{
				// Get the velocity.
				let vely;
				if     (this.origin == "AI"){ vely = GAMEVARS.invader_shot_vely ; }
				else if(this.origin == "AS"){ vely = GAMEVARS.ship_shot_vely    ; }

				// Move the projectile.
				this.y += Math.abs(vely) * 1;
			}

			// Did the shot collide with a player?
		}
	};

	// Draws this shot.
	this.draw                 = function(){
		if( this.removeThis){ return; }

		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		let x=Math.ceil(this.x);
		let y=Math.ceil(this.y);
		DOM.preMainCanvas_ctx.drawImage(img, x, y);

		// Draw a color line under the player.
		let color ;
		let y_adjust=0;
		if     (this.origin=="P1"){ color = "red"    ; y_adjust = y + 0 ; }
		else if(this.origin=="P2"){ color = "blue"   ; y_adjust = y + 0 ; }
		else if(this.origin=="AI"){ color = "yellow" ; y_adjust = y + img.height; }
		else if(this.origin=="AS"){ color = "pink"   ; y_adjust = y + img.height; }
		DOM.preMainCanvas_ctx.fillStyle = color;
		DOM.preMainCanvas_ctx.fillRect(x, y_adjust, img.width, img.height/4);
	};

}

//
function Invader(x, y, type){
	// Passed with 'new'.
	this.x                       = x    ;
	this.y                       = y    ;
	this.type                    = type ;

	// Created at instantiation.
	this.dir                     = "R"   ;
	this.frameslatency           = 0     ;
	this.jumpingY                = false ;
	this.removeThis              = false ;
	this.shots                   = 0     ;
	this.jumpingY                = false ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey             = type;
	this.framenum                = 0;

	// Hit
	this.hitType                 = "hit1";

	// Draws this invader.
	this.draw            = function(){
		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};

	// Creates new shot.
	this.fire            = function(){
		// Get the source image.
		let img = IMGCACHE[this.type][0];

		// Create the shot data.
		let shot = {
			"x"      : this.x + (img.width /2) ,
			"y"      : this.y + (img.height)-2 ,
			"origin" : "AI"
		};

		// Increase the shot count.
		this.shots += 1;

		// Add the new shot into the game.
		FUNCS.addShot(shot);
	};

	// Configures the flags and settings for removal of this invader.
	this.resetForRemoval = function(){
		//
		this.removeThis    = true  ;

		//
		this.framenum      = 0     ;
		this.dir           = ""    ;
		this.jumpingY      = false ;
		this.frameslatency = 0     ;
		this.x             = 0     ;
		this.y             = 0     ;
		this.shots         = 0     ;
	};

	// this.updatePosition = function(){
	// };

	// Awards points to the specified player record.
	this.awardPoints    = function(player){
		let points=0;

		// Points given is based on the type of invader this was.
		switch (this.type) {
			case "invader1": { points = 30; break ; }
			case "invader2": { points = 25; break ; }
			case "invader3": { points = 20; break ; }
			case "invader4": { points = 15; break ; }
			case "invader5": { points = 10; break ; }
			case "invader6": { points = 5;  break ; }
			default : {
				console.log("ERROR: UNEXPECTED INVADER TYPE.", this.type);
				points = 1;
			}
			break;
		}

		// Add points.
		player.score += points;

	};
}

//
function Hit    (x,y, w, h, hitType){
	// Passed with 'new'.
	this.x           = x    ;
	this.y           = y    ;
	this.w           = w    ;
	this.h           = h    ;
	this.hitType = hitType ;

	// Hit
	this.animationRepeat      = 0 ;
	this.animationRepeatsMax  = 1 ;
	this.frameslatency        = 0 ;
	this.framesLatencyMax     = 2 ;

	// Created at instantiation.
	this.removeThis  = false ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = hitType;
	this.framenum    = 0;

	this.update  = function(){
		// Run the animation.

		// Get the source image key and the total number of frames.
		let img = IMGCACHE[this.imgCacheKey];
		let totalFrames = img.length;

		// Animations still remaining?
		if(this.animationRepeat < this.animationRepeatsMax){

			if(this.frameslatency >= this.framesLatencyMax){
				// Change the frame.
				if(this.framenum+1==totalFrames){
					this.framenum=0; this.animationRepeat+=1;
				}
				else{
					this.framenum+=1;
				}

				// Reset the latency timer.
				this.frameslatency=0;
			}
			else{
				this.frameslatency += 1;
			}
		}
		// Animations are done. Remove the hit.
		else{
			this.removeThis=true;
		}

	};

	this.draw    = function(){
		// Get the source image.
		let img = IMGCACHE[this.imgCacheKey][this.framenum];

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};
}

//
function Barrier(x, y, type){
	// Passed with 'new'.
	this.x           = x    ;
	this.y           = y    ;
	this.type        = type ;

	// Created at instantiation.
	this.canvas      = null      ;
	this.canvasCtx   = null      ;

	// Key used to access the image in the IMGCACHE.
	this.imgCacheKey = "barrier" ;
	this.framenum    = 0         ;


	// More in-depth collision detection for barriers.
	this.barrierHit = function(shot){
		let barrier=this;

		let coords = {
			x:shot.x - barrier.x ,
			y:shot.y - barrier.y
		};

		let shotImg = IMGCACHE[shot.imgCacheKey][shot.framenum];
		// let shotImg = {"width":4, "height":4};

		let check_x = coords.x;
		let check_y = (coords.y);
		let check_w = shotImg.width ;
		let check_h = shotImg.height;

		// Adjust to check for a wider area. Also to potentially remove more.
		check_x-=(shotImg.width/2)*2;
		check_w+=(shotImg.width/2)*6;

		// Adjust for downward shots.
		if(shot.origin=="AI" || shot.origin=="AS"){
			check_y += (shotImg.height) - (shotImg.height/2);
		}

		let data = this.canvasCtx.getImageData( check_x, check_y, check_w, check_h );

		let hitDetected=false;
		for(let i=0; i<data.data.length; i+=4){
			let r = data.data[i+0] ;
			let g = data.data[i+1] ;
			let b = data.data[i+2] ;
			let a = data.data[i+3] ;

			// Skip full transparent pixels.
			if(r==0 && g==0 && b==0 && a==0){ continue; }

			// Anything that isn't full transparent is a hit.
			else{
				hitDetected=true;
				break;
			}
		}

		// If hitDetected then use clearRect on the canvas where the shot would overlap fully.
		if(hitDetected){
			// Remove the affected area of the canvas.
			this.canvasCtx.clearRect( check_x, check_y, check_w, check_h );

			// return true to remove the shot.
			return true;
		}
		// return false to allow the shot to continue.
		else {
			return false;
		}

		// return true;
		return false;
	};

	// Used for moving barriers.
	this.updatePosition = function(){
		// Barriers do not move at this point.
		return;
	};

	// Draws this barrier.
	this.draw    = function(){
		let img;

		// Get the source image.
		img = this.canvas;

		// Draw the entity at the current coordinates.
		DOM.preMainCanvas_ctx.drawImage(img, this.x, this.y);
	};

	// Run this function at instantiation.
	this.configure = function(){
		// console.log("creating barrier.", this);
		if(this.type==1){
			// Get the source image.
			let img = IMGCACHE[this.imgCacheKey][this.framenum];

			// Create and store the canvas and configure.
			this.canvas = document.createElement("canvas");
			this.canvas.width  = img.width;
			this.canvas.height = img.height;
			LOADER.setpixelated(this.canvas);

			// Create and store the context.
			this.canvasCtx = this.canvas.getContext('2d');

			// Draw the source image to the canvas.
			this.canvasCtx.drawImage(img, 0, 0);
		}
	};

	//
	this.configure();
}

//
function Ship   (x, y, type){

}