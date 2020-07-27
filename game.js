// GLOBAL STUFF
// Constants
var KEYBOARD_CONTROLS = {
	// "CODE" refers to the keycode value of the key. "NAME" and "PURPOSE" aren't actually required.
	"P1":
	{
		"LEFT"  : { "CODE" : 37, "NAME" : "Left Arrow",  "PURPOSE" : "Move Player 1 LEFT"},
		"RIGHT" : { "CODE" : 39, "NAME" : "Right Arrow", "PURPOSE" : "Move Player 1 RIGHT"},
		"FIRE"  : { "CODE" : 38, "NAME" : "Up Arrow",    "PURPOSE" : "Player 1 FIRE"},
	},
	"P2":
	{
		"LEFT"  : { "CODE" : 65, "NAME" : "A Key",       "PURPOSE" : "Move Player 2 LEFT"},
		"RIGHT" : { "CODE" : 68, "NAME" : "D Key",       "PURPOSE" : "Move Player 2 RIGHT"},
		"FIRE"  : { "CODE" : 87, "NAME" : "W Key",       "PURPOSE" : "Player 2 FIRE"},
	},
	"AS":
	{
		"FIRE"  : { "CODE" : 32, "NAME" : "Spacebar",    "PURPOSE" : "All Alien Ships FIRE"},
	},
	"AI":
	{
		"FIRE"  : { "CODE" : 17, "NAME" : "Control Key", "PURPOSE" : "All Alien Invaders FIRE"},
	}

};
// Holds the sprite sheet image.
var ship = new Image();
ship.src = 'images/invaders_1_.png';
// Holds the positions and dimensions of each sprite.
var spriteSheet = {
	"alienInvaders": {
		"type00": {
			"name": "",
			"frame1": {
				"x": "3",
				"y": "253",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "94",
				"y": "253",
				"w": "102",
				"h": "82"
			}
		},
		"type01": {
			"name": "",
			"frame1": {
				"x": "302",
				"y": "13",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "417",
				"y": "13",
				"w": "102",
				"h": "82"
			}
		},
		"type02": {
			"name": "",
			"frame1": {
				"x": "260",
				"y": "373",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "367",
				"y": "373",
				"w": "102",
				"h": "82"
			}
		},
		"type03": {
			"name": "",
			"frame1": {
				"x": "226",
				"y": "493",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "336",
				"y": "493",
				"w": "102",
				"h": "82"
			}
		},
		"type04": {
			"name": "",
			"frame1": {
				"x": "194",
				"y": "253",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "305",
				"y": "253",
				"w": "102",
				"h": "82"
			}
		},
		"type05": {
			"name": "",
			"frame1": {
				"x": "18",
				"y": "373",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "144",
				"y": "373",
				"w": "102",
				"h": "82"
			}
		},
		"type06": {
			"name": "",
			"frame1": {
				"x": "299",
				"y": "133",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "299",
				"y": "133",
				"w": "102",
				"h": "82"
			}
		},
		"type07": {
			"name": "",
			"frame1": {
				"x": "4",
				"y": "503",
				"w": "102",
				"h": "82"
			},
			"frame2": {
				"x": "114",
				"y": "503",
				"w": "102",
				"h": "82"
			}
		},
		"type08": {
			"frame1": {
				"name": "TITLE SCREEN",
				"x": "18",
				"y": "13",
				"w": "112",
				"h": "82"
			},
			"frame2": {
				"x": "164",
				"y": "13",
				"w": "112",
				"h": "82"
			}
		},
		"type09": {
			"name": "TITLE SCREEN",
			"frame1": {
				"x": "18",
				"y": "133",
				"w": "122",
				"h": "82"
			},
			"frame2": {
				"x": "159",
				"y": "133",
				"w": "122",
				"h": "82"
			}
		}
	},
	"alienShips": {
		"ship1": {
			"frame1": {
				"h": "59",
				"w": "125",
				"x": "19",
				"y": "634"
			},
			"frame2": {
				"h": "59",
				"w": "125",
				"x": "19",
				"y": "634"
			}
		}
	},
	"players": {
		"P1": {
			"frame1": {
				"x": "149",
				"y": "637",
				"w": "75",
				"h": "54"
			},
			"frame2": {
				"w": "75",
				"h": "54",
				"x": "149",
				"y": "637"
			}
		},
		"P2": {
			"frame1": {
				"x": "149",
				"y": "637",
				"w": "75",
				"h": "54"
			},
			"frame2": {
				"w": "75",
				"h": "54",
				"x": "149",
				"y": "637"
			}
		}
	},
	"misc": {
		"barrier1": {
			"frame1": {
				"x": "416",
				"y": "269",
				"w": "54",
				"h": "75"
			},
			"frame2": {
				"x": "491",
				"y": "270",
				"w": "54",
				"h": "75"
			}
		},
		"barrier2": {
			"frame1": {
				"x": "486",
				"y": "393",
				"w": "30",
				"h": "53"
			},
			"frame2": {
				"x": "486",
				"y": "393",
				"w": "30",
				"h": "53"
			}
		},
		"shot1": {
			"frame1": {
				"x": "486",
				"y": "393",
				"w": "30",
				"h": "53"
			},
			"frame2": {
				"x": "486",
				"y": "393",
				"w": "30",
				"h": "53"
			}
		},
		"shot2": {
			"frame1": {
				"x": "486",
				"y": "393",
				"w": "30",
				"h": "53"
			},
			"frame2": {
				"x": "486",
				"y": "393",
				"w": "30",
				"h": "53"
			}
		},
		"hit1": {
			"frame1": {
				"x": "240",
				"y": "633",
				"w": "107",
				"h": "63"
			},
			"frame2": {
				"x": "240",
				"y": "633",
				"w": "107",
				"h": "63"
			}
		},
		"hit2": {
			"frame2": {
				"x": "354",
				"y": "630",
				"w": "107",
				"h": "62"
			},
			"frame1": {
				"h": "62",
				"w": "107",
				"y": "630",
				"x": "354"
			}
		}
	}
};


var PLAYERSIZE_SMALL = { "W" : 50, "H" : 25 };
var PLAYERSIZE_LARGE = { "W" : 60, "H" : 20 };

// CANVAS dimensions.
var WIDTH = 500;
var HEIGHT = 500;

// Changable Game Elements
var R = 90;
var FPS = 15;					// Game Frames Per Second.
var CANVAS;						// Handle on the game's CANVAS.
var CONTEXT;					// Game canvas drawable CONTEXT.
var PLAYERS = [];				// Holds the objects for each player.
var PROJECTILES = [];			// Holds the objects for each projectile on screen.
var ALIENSHIPS = [];			// Holds the objects for each Alien ship on screen.
var ALIENINVADERS = [];			// Holds the objects for each Alien Invader on screen.
var PAUSED = false;				// Boolean for pause.
var KEYSTATE = [];				// Array that holds all keyboard keys that are pressed.

// Projectile Queue Counters.
var PROJECTILES_QUEUE_P1 = 0;
var PROJECTILES_QUEUE_P2 = 0;
var PROJECTILES_QUEUE_AS = 0;
var PROJECTILES_QUEUE_AI = 0;

// Utility functions that can be called from anywhere. All neatly contained within this object.
var UTILITYFUNCTIONS = {
	// FPS
	raiseFPS : function(){
		if(FPS<30){ FPS++; }
	},
	lowerFPS : function(){
		if(FPS>1){ FPS--; }
	},

	// Game Overrides
	newGameInit : function(){
		init();
	},
	pauseGame : function(){
		if(PAUSED==false){
			PAUSED=true;
			console.log("Game paused!");
		}
		else if(PAUSED==true){
			PAUSED=false;
			console.log("Game UNpaused!");
		}
	},

	// Players
	addPlayer : function(newPlayer){
		// Create the new Player.
		// x, y, width, height, control, color, playernum
		PLAYERS.push (
			new Player(
				newPlayer.pos.x,	// x
				newPlayer.pos.y,	// y
				newPlayer.size.w,	// width
				newPlayer.size.h,	// height
				newPlayer.control,	// control
				newPlayer.color,	// color
				newPlayer.playernum	// playernum
			)
		);
	},
	player_FIRE : function(thisPlayer){
		var origin = thisPlayer.playernum == 1 ? "P1" : "P2" ;
		var active_shots = 0;
		var max_active_shots = 1;

		// First determine how many total projectiles for THIS player currently exist on the field.
		for(var i=0; i<PROJECTILES.length; i++){
			if(PROJECTILES[i].origin==origin){
				active_shots++;
			}
		}
		// Second specify how many total projectiles for THIS player are allowed.
		// Third look at the matching player PROJECTILES_QUEUE and count how many are queued

		// Now, if we have max shots on the field then we are NOT allowed to fire and this fire is canceled.
		if(    active_shots < max_active_shots	// Less active shots than we are allowed at max.
			&& PLAYERS.length					// Of course course that we have active players.
			){

			// We can fire right now.
			var color;

			// A player has fired a shot! Configure a new projectile!
			if     (origin=="P1"){ color = "yellow"; }
			else if(origin=="P2"){ color = "orange"; }

			// Record this as a shot.
			thisPlayer.shotsFired ++;

			// Add the new projectile into the game.
			var newProjectile = {
				"pos"		: { "x" : thisPlayer.x+thisPlayer.width/2-3, "y" : thisPlayer.y-thisPlayer.height/2-3 },
				"size"		: { "w" : 15, "h" : 20 },
				"velocityy"	: 15  + Math.floor((Math.random() * 5) + 0),
				"color" 	: color,
				"origin"	: origin
			}

			UTILITYFUNCTIONS.addProjectile(newProjectile);
			return;
			//Set timer for when the Alien Ship should FIRE.
			setTimeout(
				function(){
					console.log(
				origin, "BEFORE.",
				"thisPlayer:", thisPlayer, "\n",
				"origin:", origin,
				"active_shots:", active_shots,
				"max_active_shots:", max_active_shots,
				"PROJECTILES_QUEUE_P1", PROJECTILES_QUEUE_P1,
				"PROJECTILES_QUEUE_P2", PROJECTILES_QUEUE_P2,
				"\n\n"
			);


					// Decrement the queue.
					origin == "P1" ? PROJECTILES_QUEUE_P1-- : PROJECTILES_QUEUE_P2-- ;
			console.log(
				origin, "AFTER.",
				"thisPlayer:", thisPlayer, "\n",
				"origin:", origin,
				"active_shots:", active_shots,
				"max_active_shots:", max_active_shots,
				"PROJECTILES_QUEUE_P1", PROJECTILES_QUEUE_P1,
				"PROJECTILES_QUEUE_P2", PROJECTILES_QUEUE_P2,
				"\n\n"
			);
			}, 250);
		}
		else {
		}
	},

	// Projectiles
	addProjectile : function(info){
		// pos, size, velocityy, color, origin
		PROJECTILES.push(
			new Projectile(
				info.pos,
				info.size,
				info.velocityy,
				info.color,
				info.origin
			)
		);
	},

	// Alien Ships
	removeAllAlienShips : function(){
		// Remove expired Alien Ships.
		ALIENSHIPS = []; //ALIENSHIPS.filter( function (value) { return ! value.removeThis; } );
	},
	addAlienShip		: function(newAS){
		ALIENSHIPS.push (
			new AlienShip(
				newAS.pos,			// pos
				newAS.size,			// size
				newAS.velocityx,	// velocityx
				newAS.color,		// color
				newAS.type			// Type (0-4);
			)
		);
	},
	addRandomAlienShip : function(){
		// Randomize the X, Y, Size, Velocity, Color, Type. We are going to get either a 0 or a 1.
		var random5050 = parseInt((( Math.random()*2 ) + 0), 10).toFixed(0) ;

		// Size
		var size = {
			// "w": Math.floor((Math.random() * 40) + 30),
			// "h": Math.floor((Math.random() * 12) + 8)
			"w": "50",
			"h": "20"
		};

		// Position.
		var maxY = 15;
		var pos = {
			"x" : 100, // Set properly later.
			"y" : Math.floor((Math.random() * maxY) + 5)
		};
		// Will appear on the left side.
		if     (random5050==0){
			pos.x = 1 ;
			pos.x = Math.max(1, Math.min(pos.x, WIDTH- size.w));
		}
		// Will appear on the right side.
		else if(random5050==1){
			pos.x = WIDTH-1 ;
			pos.x = Math.max(1, Math.min(pos.x, WIDTH- size.w));
		}
		pos.y = Math.max(1, Math.min(pos.y, maxY));

		// Velocity
		var velocityx = Math.floor(Math.random()*10) + 5;
		if     (random5050==0){ velocityx *= 1; }			// If on the left side then make it go RIGHT (Positive).
		else if(random5050==1){ velocityx *= -1; }			// If on the left side then make it go RIGHT (Positive).
		velocityx *= Math.floor(Math.random()*1) == 1 ? 1 : -1; // Make it negative 50% of the time.

		// Color
		var color_index	= Math.floor((Math.random() * 5) + 0) ;
		var colors = ["red", "green", "blue", "purple", "darkgray", "brown"];
		var color = colors[color_index];
		var type		= Math.floor((Math.random() * 4) + 0) ;

		// Create an Alien Ship.
		var newAlienShip = {
			"pos"		: { "x" : pos.x, "y" : pos.y },
			"size"		: { "w" : size.w, "h" : size.h },
			"velocityx"	: velocityx,
			"color"		: color,
			"type"		: type
		};
		console.log("newAlienShip.pos:", newAlienShip.pos, newAlienShip.color);
		UTILITYFUNCTIONS.addAlienShip(newAlienShip);
	},
	randomAlienShip_FIRE : function(){
		// Limit the number of projectiles from the Alien Ships that are active on the field.
		// How many projectiles from the Alien Ships are on the field?
		var max_projectiles_AS = 2;
		var projectiles_AS = 0;
		for(i=0; i<PROJECTILES.length; i++){
			if(PROJECTILES[i].origin=="AS"){ projectiles_AS++ ; }
		}

		// The Alien Ship can fire as long as it's max projectile count and max queue count is not reached.
		if(projectiles_AS < max_projectiles_AS && PROJECTILES_QUEUE_AS < max_projectiles_AS && ALIENSHIPS.length){
			// Choose an Alien Ship at random.
			var whichShip = Math.floor((Math.random() * ALIENSHIPS.length) + 0) ;

			// Determine how many seconds from now the ship should fire.
			var firingLatency = Math.floor((Math.random() * 4) + 1) ;
			// console.log("projectiles_AS:", projectiles_AS, "firingLatency:", firingLatency);
			PROJECTILES_QUEUE_AS++;

			//Set timer for when the Alien Ship should FIRE.
			setTimeout(
				function(){
					// FIRE!
					try{ ALIENSHIPS[whichShip].fire(); }
					catch(err){
						// console.log("Ship: '"+whichShip+"' was removed before it could fire.", err);
					}

					// Decrement from the queue counter.
					PROJECTILES_QUEUE_AS--;
				}, firingLatency * 1000
			);
		}
		// else { console.log(PROJECTILES.length, " is too many projectiles right now."); }
	},

	// Alien Invaders
	addAlienInvader : function(newAI){
		ALIENINVADERS.push (
			new AlienInvader(
				newAI.pos,			// pos
				newAI.size,			// size
				newAI.velocityx,	// velocityx
				newAI.color,		// color
				newAI.type			// Type (0-4);
			)
		);
	},
	createAlienInvadersGrid : function(){
		// Grid is 6 rows of 6 columns each.
		// There are 6 different types of Alien Invader.
		// There is only 1 unique Alien Invader type per row.
		// All Alien Invaders move on the X axis in unison.
		// All Alien Invaders move down on the Y axis in unison also.

		// var color = [ "#458ade", "#c71bba", "#3d7b8e", "#63b389", "#e6bc78", "#f31a0e" ];
		var color = [ "red", "purple", "orange", "green", "violet", "blue" ];
		var type = [ 0, 1, 2, 3, 4, 5 ];
		var size = 40;
		var Y;//=100;
		var X;//=100;

		for(var row=1; row<=6-0; row++){
			Y=0+(row*size)+15;
			for(var col=1; col<=6-0; col++){
				// console.log(X, Y, row, col, color[row-1]);
				X=(col*size/3);
				UTILITYFUNCTIONS.addAlienInvader( {
					"pos"		: { "x" : X+col*3*(size/3), "y" : Y+row*(size/3) },
					"size"		: { "w" : size, "h" : size },
					"velocityx"	: 15,
					"color"		: color[row-1],
					"type"		: type[row-1]
				});
			}

		}
	},
	drawAlienInvader_grid : function(){
		for(var i=0; i<ALIENINVADERS.length; i++){
			// Manual user input to make the Alien Invader fire.
			if (KEYSTATE[KEYBOARD_CONTROLS.AI.FIRE.CODE]) { ALIENINVADERS[i].fire(); }
				ALIENINVADERS[i].draw();
		}
	},
	moveAlienInvader_grid : function(){
		var changeDirections = false;

		// Do this for each Alien Invader in the grid.
		for(var i=0; i<ALIENINVADERS.length; i++){
			// SIDE BOUNDRY
			if ( ALIENINVADERS[i].pos.x <= 0
			   || ALIENINVADERS[i].pos.x + ALIENINVADERS[i].size.w >= WIDTH ) {
				// console.log("Bounce");

				// This Alien Invader hit a boundry. Which one did it hit or which direction was it moving?
				for(i=0; i<ALIENINVADERS.length; i++){
					ALIENINVADERS[i].velocityx *= -1 ;
					// Also, move the invader down on the Y.
					ALIENINVADERS[i].pos.y += 5 ;
				}
				for(i=0; i<ALIENINVADERS.length; i++){
					// Check if an invader reaches the bottom.
					// if(ALIENINVADERS[i].pos.y >= HEIGHT-ALIENINVADERS[i].size.h*2) {
					if(ALIENINVADERS[i].pos.y >= 410) {
						// ALIENINVADERS[i].pos.y = 100;
						// Erase all Alien Invaders.
						UTILITYFUNCTIONS.eraseAlienInvader_grid();
						// Redraw the Alien Invader grid.
						UTILITYFUNCTIONS.createAlienInvadersGrid();
						return;
					}
				}
				// console.log("breaking!");
				break;
			}
		}

		// Always do this.
		for(i=0; i<ALIENINVADERS.length; i++){

			// Change the frame if enough frames have passed by.
			if(ALIENINVADERS[i].frameslatency >= ALIENINVADERS[i].frameslatencymax){
				if     (ALIENINVADERS[i].framenum=="frame2"){ ALIENINVADERS[i].framenum="frame1"; }
				else if(ALIENINVADERS[i].framenum=="frame1"){ ALIENINVADERS[i].framenum="frame2"; }
				else                                        { ALIENINVADERS[i].framenum="frame1"; }
				ALIENINVADERS[i].frameslatency=0;

				// Move the Alien Invader on the X axis.
				ALIENINVADERS[i].pos.x += ALIENINVADERS[i].velocityx;

				// Make sure that the new x and y are valid and the Alien Invader cannot go out of bounds.
				ALIENINVADERS[i].pos.x = Math.max( 0, Math.min(ALIENINVADERS[i].pos.x, WIDTH - ALIENINVADERS[i].size.w) );

				// Bounce the Alien Invader on the Y axis.
				if     (ALIENINVADERS[i].jumpingY == 0){ ALIENINVADERS[i].pos.y += -4; }
				else if(ALIENINVADERS[i].jumpingY == 1){ ALIENINVADERS[i].pos.y +=  4; }
				ALIENINVADERS[i].jumpingY = ! ALIENINVADERS[i].jumpingY ;
			}

			if(ALIENINVADERS[i].frameslatency < ALIENINVADERS[i].frameslatencymax){
				ALIENINVADERS[i].frameslatency++;
			}
			else {
				// ALIENINVADERS[i].frameslatency++;

			}



		}
	},
	randomAlienInvader_FIRE : function(){
		// Limit the number of projectiles from the Alien Invaders that are active on the field.
		// How many projectiles from the Alien Ships are on the field?
		var max_projectiles_AI = 3;
		var projectiles_AI = 0;
		for(i=0; i<PROJECTILES.length; i++){
			if(PROJECTILES[i].origin=="AI"){ projectiles_AI++ ; }
		}

		// The Alien Ship can fire as long as it's max projectile count and max queue count is not reached.
		if(projectiles_AI < max_projectiles_AI && PROJECTILES_QUEUE_AI < max_projectiles_AI && ALIENINVADERS.length){
			// Choose an Alien Ship at random.
			var whichShip = Math.floor((Math.random() * ALIENINVADERS.length) + 0) ;

			// Determine how many seconds from now the ship should fire.
			var firingLatency = Math.floor((Math.random() * 4) + 1) ;
			// console.log("projectiles_AI:", projectiles_AI, "firingLatency:", firingLatency);
			PROJECTILES_QUEUE_AI++;

			//Set timer for when the Alien Ship should FIRE.
			setTimeout(
				function(){
					// FIRE!
					try{ ALIENINVADERS[whichShip].fire(); }
					catch(err){
						// console.log("Ship: '"+whichShip+"' was removed before it could fire.", err);
					}

					// Decrement from the queue counter.
					PROJECTILES_QUEUE_AI--;
				}, firingLatency * 1000
			);
		}
		// else { console.log(PROJECTILES.length, " is too many projectiles right now."); }
	},
	eraseAlienInvader_grid : function(){
		ALIENINVADERS = [];
	},

	// User Interface (keyboard/mouse)
	preventScroll : function(e){
		// space and arrow keys
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	},
	getKeyPress : function(e){
		KEYSTATE[e.keyCode] = true;
	},
	delKeyPress : function(e){
		delete KEYSTATE[e.keyCode];
	},
};

window.onload=function(){
	console.log("SPACE INVADERS!");

	// Prepare our game canvas.
	CANVAS = document.getElementById("mainGameCanvas");
	CANVAS.width = WIDTH;
	CANVAS.height = HEIGHT;
	CONTEXT = CANVAS.getContext("2d");

	// Output controls to the screen.
	var html = "GAME CONTROLS<BR>";
	Object.keys(KEYBOARD_CONTROLS).forEach(function(key) {
		html += "<b><u>"+ key+ "</u></b><br>";
		Object.keys(KEYBOARD_CONTROLS[key]).forEach(function(key2, value2) {
			html +=
				""+ KEYBOARD_CONTROLS[key][key2].NAME+ ", "+
				" = "+ KEYBOARD_CONTROLS[key][key2].PURPOSE+ " "+
				// "CODE: "+ KEYBOARD_CONTROLS[key][key2].CODE+ ", "+
				"<br>"
			;
		});
		html += "<br>";
	});
	document.getElementById('div_controls').innerHTML = html ;

	// Event listeners for game controls, options, and whatever.
	// Prevent the screen from scrolling when using the arrow keys to control the game.
	window.addEventListener("keydown", UTILITYFUNCTIONS.preventScroll, false);

	// Configure game controls - User Input (Mouse/Keyboard).
	document.addEventListener("keydown", UTILITYFUNCTIONS.getKeyPress );
	document.addEventListener("keyup", UTILITYFUNCTIONS.delKeyPress  );

	// Configure game controls - User Input Via DOM Clicks.
	document.getElementById("upFPS").addEventListener("click", UTILITYFUNCTIONS.raiseFPS );
	document.getElementById("dnFPS").addEventListener("click", UTILITYFUNCTIONS.lowerFPS );
	document.getElementById("newgame").addEventListener("click", UTILITYFUNCTIONS.newGameInit );
	document.getElementById("pause").addEventListener("click", UTILITYFUNCTIONS.pauseGame);
	document.getElementById("removeAllAS").addEventListener("click", UTILITYFUNCTIONS.removeAllAlienShips);
	document.getElementById("addAS").addEventListener("click", UTILITYFUNCTIONS.addRandomAlienShip);

	// Fix the heights - Top panel.
	var topPanelHeight = document.getElementById('gameAndControls').offsetHeight ;
	document.getElementById("game").style.height = topPanelHeight+"px" ;
	document.getElementById("modifiers").style.height = topPanelHeight+"px" ;
	document.getElementById("debug").style.height = topPanelHeight+"px" ;

	// Start the game!
	main();
};

function init(){
	// Blank out whatever is in the game element arrays.
	PLAYERS 		= [];
	PROJECTILES 	= [];
	ALIENSHIPS		= [];
	ALIENINVADERS	= [];

	// Create Player 1.
	newPlayer = {
		"pos"		: { "x" : WIDTH-WIDTH/4 - PLAYERSIZE_SMALL.W, "y" : HEIGHT - PLAYERSIZE_SMALL.H },
		"size"		: { "w" : PLAYERSIZE_SMALL.W, "h" : PLAYERSIZE_SMALL.H },
		"control"	: "H",
		"color"		: "red",
		"playernum"	: 1
	};
	UTILITYFUNCTIONS.addPlayer(newPlayer);

	// Create Player 2.
	var newPlayer = {
		"pos"		: { "x" : WIDTH/4 - PLAYERSIZE_SMALL.W, "y" : HEIGHT - PLAYERSIZE_SMALL.H },
		"size"		: { "w" : PLAYERSIZE_SMALL.W, "h" : PLAYERSIZE_SMALL.H },
		"control"	: "H",
		"color"		: "green",
		"playernum"	: 2
	};
	UTILITYFUNCTIONS.addPlayer(newPlayer);

	// Create a random Alien Ship.
	UTILITYFUNCTIONS.addRandomAlienShip();

	// Create a grid of Alien Invaders.
	UTILITYFUNCTIONS.createAlienInvadersGrid();
}

function main(){
	// Perform game element initialization.
	init();

	var updateGameDisplay = function() {
		// If NOT paused then request an animation frame and repeat the setTimeout.
		if(!PAUSED){
			window.requestAnimationFrame(loop, CANVAS);
			setTimeout(updateGameDisplay, 1000 / FPS);
		}
		else { setTimeout(updateGameDisplay, 1000 / FPS); }
	};

	// Game loop!
	var loop = function() {
		// Remove expired shots.
		PROJECTILES = PROJECTILES.filter( function (value) { return ! value.removeThis; } );

		// Remove expired Alien Ships.
		ALIENSHIPS = ALIENSHIPS.filter( function (value) { return ! value.removeThis; } );

		// Remove expired Alien Invaders.
		ALIENINVADERS = ALIENINVADERS.filter( function (value) { return ! value.removeThis; } );

		// Update positions.
		updatePositions();

		// Redraw the screen with the position updates.
		drawFrame();

		// Update the debug data.
		if(document.getElementById('chk_debug').checked){ updateDebugData(); }
		else { document.getElementById('debug_details').innerHTML = "Debug is off"; }
	};

	// Activate the initial game loop.
	setTimeout(updateGameDisplay, 1000 / FPS);
}

function updatePositions(){
	// Update PLAYER positions.
	for(var i=0; i<PLAYERS.length; i++){
		PLAYERS[i].updatePosition();
	}

	// Update PROJECTILE positions
	for(i=0; i<PROJECTILES.length; i++){
		PROJECTILES[i].updatePosition();
	}

	// Update ALIEN SHIP positions
	for(i=0; i<ALIENSHIPS.length; i++){
		ALIENSHIPS[i].updatePosition();
	}

	// Update ALIEN INVADER positions
	UTILITYFUNCTIONS.moveAlienInvader_grid();

	// Attach a timer that will make the Alien Ship shoot.
	// Make a random Alien Ship FIRE
	UTILITYFUNCTIONS.randomAlienShip_FIRE();

	// Set timer for when each Alien Invader should FIRE.
	UTILITYFUNCTIONS.randomAlienInvader_FIRE();
}

function drawFrame(){
	// Erase the canvas frame.
	CONTEXT.fillStyle = "black";
	CONTEXT.fillRect(0, 0, WIDTH, HEIGHT);

	// Draw the line where you lose if the Alien Invaders reach it.
	// Line 1
	CONTEXT.beginPath();
	CONTEXT.moveTo( 0, HEIGHT-35 ); CONTEXT.lineTo( WIDTH, HEIGHT-35);
	CONTEXT.closePath();
	CONTEXT.strokeStyle = 'blue'; CONTEXT.lineWidth = 2; CONTEXT.stroke();

	// Line2
	CONTEXT.beginPath();
	CONTEXT.moveTo( 0, HEIGHT-40 ); CONTEXT.lineTo( WIDTH, HEIGHT-40);
	CONTEXT.closePath();
	CONTEXT.strokeStyle = 'gray'; CONTEXT.lineWidth = 2; CONTEXT.stroke();

	// Draw the players
	for(var i=0; i<PLAYERS.length; i++){
		PLAYERS[i].draw();
	}

	// Draw all PROJECTILES from within the PROJECTILES array. MULTI-PROJECTILE!
	for(i=0; i<PROJECTILES.length; i++){
		PROJECTILES[i].draw();
	}

	// Draw all ALIENSHIPS from within the ALIENSHIPS array. MULTI-ALIENSHIPS!
	for(i=0; i<ALIENSHIPS.length; i++){
		ALIENSHIPS[i].draw();
	}

	// Draw all ALIENINVADERS from within the ALIENINVADERS array. MULTI-ALIENINVADERS!
	UTILITYFUNCTIONS.drawAlienInvader_grid();

	// Display the scores.
	document.getElementById('p1Score').innerHTML = "Player 1: "+PLAYERS[0].score;
	document.getElementById('p2Score').innerHTML = "Player 2: "+PLAYERS[1].score;
}

function updateDebugData(){
	var html = "";
	document.getElementById('debug_details').innerHTML = "Debug is ON";
	html +='<br><u>CHECKBOXES</u>:<br>';
	html+="chk_debug: " + document.getElementById('chk_debug').checked + "<br>"
	;

	html+='<br><u>GAME STATS</u>:<br>';
	for(var i=0; i<PLAYERS.length; i++){
		html +=
			"Player"+i+" -- (score: "+PLAYERS[i].score+"),  "+
			"Shots Fired: "+PLAYERS[i].shotsFired+", "+
			"Shots Made: "+PLAYERS[i].shotsMade+", "+
			"Accuracy: "+PLAYERS[i].accuracy+"%, "+
			"HIT: "+PLAYERS[i].timesHit+", "+
			"<br>"
		;
	}
	html += "FPS: " + FPS+ "<br>";
	html += "CANVAS: " + WIDTH+ " by "+HEIGHT+"<br>";
	html += "R: " + R + "<br>";
	html += "PROJECTILES_QUEUE_P1: " + PROJECTILES_QUEUE_P1 + "<br>";
	html += "PROJECTILES_QUEUE_P2: " + PROJECTILES_QUEUE_P2 + "<br>";
	html += "PROJECTILES_QUEUE_AS: " + PROJECTILES_QUEUE_AS + "<br>";
	html += "PROJECTILES_QUEUE_AI: " + PROJECTILES_QUEUE_AI + "<br>";


	html +='<br><u>ALIENINVADERS</u>:'+ALIENINVADERS.length+'<br>';
	html +="<div style='font-size:90%'>" ;
	for(var i=0; i<ALIENINVADERS.length; i++){
		html +=
			'ALIENINVADER:'+i+' '+
			", Shots Fired: "+ALIENINVADERS[i].shotsFired+
			", frameslatency: "+ALIENINVADERS[i].frameslatency +
			", velocityx: "+ ALIENINVADERS[i].velocityx+
			", X: "+ALIENINVADERS[i].pos.x +
			", Y: "+ALIENINVADERS[i].pos.y +
			// ", color: "+ALIENINVADERS[i].color +
			// ", HIDDEN: "+ ALIENINVADERS[i].hidden+
			// ", type: "+ALIENINVADERS[i].type +
			// ", jumpingY: "+ALIENINVADERS[i].jumpingY +
			"<br>"
		;
	}
	html +="</div>";

	html+='<br><u>PLAYERS</u> : '+PLAYERS.length+'<br>';
	for(var i=0; i<PLAYERS.length; i++){
		html +=
			"Player"+i+" -- "+
			" SIZE(W"+ PLAYERS[i].width +
			", H"+ PLAYERS[i].height+")"+
			", control: "+ PLAYERS[i].control+
			", color: "+ PLAYERS[i].color+
			", playernum: "+ PLAYERS[i].playernum+
			", POS(X"+PLAYERS[i].x +
			", Y"+parseInt(PLAYERS[i].y, 10) +")"+
			"<br>"
		;
	}

	var totalQueuedProjectiles =
		parseInt(PROJECTILES_QUEUE_P1, 10) +
		parseInt(PROJECTILES_QUEUE_P2, 10) +
		parseInt(PROJECTILES_QUEUE_AS, 10) +
		parseInt(PROJECTILES_QUEUE_AI, 10)
	;

	html +='<br><u>ACTIVE PROJECTILES</u> : '+PROJECTILES.length+' -- ';
	html +='<u>QUEUED PROJECTILES</u> : '+ totalQueuedProjectiles +	'<br>';

	for(var i=0; i<PROJECTILES.length; i++){
		html +=
			"Projectile"+i+" -- "+
			" Origin: "+PROJECTILES[i].origin +
			", velocityy: "+ PROJECTILES[i].velocityy+
			", POS(X"+PROJECTILES[i].pos.x +
			", Y"+PROJECTILES[i].pos.y +")"+
			"<br>"
		;
	}

	html +='<br><u>ALIENSHIPS</u> : '+ALIENSHIPS.length+'<br>';
	for(var i=0; i<ALIENSHIPS.length; i++){
		html +=
			"AlienShip"+i+"::"+
			", velocityx: "+ ALIENSHIPS[i].velocityx+
			", X: "+ALIENSHIPS[i].pos.x +
			", Y: "+ALIENSHIPS[i].pos.y +
			", color: "+ALIENSHIPS[i].color +
			", type: "+ALIENSHIPS[i].type +
			", jumpingY: "+ALIENSHIPS[i].jumpingY +
			"<br>"
		;
	}

	html +='<br><u>KEYS</u>:<br>';
	Object.keys(KEYSTATE).forEach(function(key, value) {
		html += "key: " + key + " value: "+value+"<br>";
	});

	document.getElementById('debug_details').innerHTML = html+"<br>";
	return;

	// Number of enemey alien invaders remaining.

	// Number of enemey alien ships invaders remaining.

	// Number of projectiles on screen right now.
		// Number of enemy projectiles.
		// Number of Player 1 projectiles.
		// Number of Player 2 projectiles.

	// Buttons pressed by Player 1
	// Buttons pressed by player 2

	// Game States (like pause status and checkbox values.)

	// Lowest position of alien alien invaders.
}

function Player(x, y, width, height, control, color, playernum) {
	console.log("New player created with values: ", x, y, width, height, control, color, playernum);
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.pos = { "x" : this.x, "y" : this.y };
	this.size = { "w" : this.width, "h" : this.height };
	this.control = control; // Can be 'H' or 'C'.
	this.color = color;
	this.playernum = playernum; // Accepts '1' or '2'
	this.score = 0;
	this.shotsFired = 0;
	this.shotsMade = 0;
	this.accuracy = 0;
	this.timesHit = 0;

	this.fire = function(){
		UTILITYFUNCTIONS.player_FIRE(this);
	};

	this.updateAccuracy = function(){
		if(this.shotsMade && this.shotsFired){
			this.accuracy = (this.shotsMade / this.shotsFired) * 100;
			this.accuracy = parseInt(this.accuracy, 10).toFixed(1);
		}
	};

	this.updatePosition = function() {
		// Check if a keycode is contained within KEYSTATE.
		if(this.playernum==1 && this.control=='H'){
			if (KEYSTATE[KEYBOARD_CONTROLS.P1.LEFT.CODE]) { this.x -= 7; }
			if (KEYSTATE[KEYBOARD_CONTROLS.P1.RIGHT.CODE]){ this.x += 7; }
			if (KEYSTATE[KEYBOARD_CONTROLS.P1.FIRE.CODE]) { this.fire(); }
		}

		if(this.playernum==2 && this.control=='H'){
			if (KEYSTATE[KEYBOARD_CONTROLS.P2.LEFT.CODE]) { this.x -= 7; }
			if (KEYSTATE[KEYBOARD_CONTROLS.P2.RIGHT.CODE]){ this.x += 7; }
			if (KEYSTATE[KEYBOARD_CONTROLS.P2.FIRE.CODE]) { this.fire(); }
		}

		// Make sure that the new x and y are valid and the Player ships cannot go out of bounds.
		this.x = Math.max(0, Math.min(this.x, WIDTH-this.width));
	};

	this.draw = function(){
		CONTEXT.fillStyle = this.color;
		CONTEXT.fillRect(this.x, this.y, this.width, this.height);

		var coords=spriteSheet.players.P1.frame1;
		CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.x, this.y,this.width,this.height);
		// return;
	};
}





function Projectile(pos, size, velocityy, color, origin){
	// console.log("New projectile created with values: ", pos, size, velocityy, color, origin);
	this.pos = pos;				// Position of projectile ( {"x":"", "y":""}
	this.size = size;			// Dimensions of projectile ( {"w":"", "h":""}
	this.velocityy = velocityy;	// The speed and direction of the projectile.
	this.color = color;			// CSS
	this.origin = origin;		// Could be "P1", "P2", "AI", "AS"
	this.removeThis = false;

	this.ALBB_CollisionCheck = function(target, projectile){
		// Pass this function the paddle and ball to see if they overlap.
		var ax = target.pos.x;		var ay = target.pos.y;
		var aw = target.size.w;		var ah = target.size.h;
		var bx = projectile.pos.x;	var by = projectile.pos.y;
		var bw = projectile.size.w;	var bh = projectile.size.h;

		// Axis Aligned Bounding Boxes (AABB). (Is a box overlapping another box?)
		// https://www.youtube.com/watch?v=ghqD3e37R7E
		return (
			ax < bx + bw && // Right edge of A is left edge of B
			ay < by + bh && // Bottom edge of A is above top edge of B
			bx < ax + aw && // Right edge of B is left edge of A
			by < ay + ah	// Bottom edge of B is above top edge of A
		);
	};

	// For Alien Ship to Player collisions.
	this.ALBB_CollisionCheck2 = function(target, projectile){
		// Pass this function the paddle and ball to see if they overlap.
		var ax = target.x;			var ay = target.y;
		var aw = target.width;		var ah = target.height;
		var bx = projectile.pos.x;	var by = projectile.pos.y;
		var bw = projectile.size.w;	var bh = projectile.size.h;

		// Axis Aligned Bounding Boxes (AABB). (Is a box overlapping another box?)
		// https://www.youtube.com/watch?v=ghqD3e37R7E
		return (
			ax < bx + bw && // Right edge of A is left edge of B
			ay < by + bh && // Bottom edge of A is above top edge of B
			bx < ax + aw && // Right edge of B is left edge of A
			by < ay + ah	// Bottom edge of B is above top edge of A
		);
	};


	// Collision check: Player shoots Alien Ship.
	this.playerShootsAlienShip = function(player){
		// Get list of Alien Ships and compare to see if this projectile overlaps one.
		var whichAS = false;
		var collision = false;
		for(var i=0; i<ALIENSHIPS.length; i++){
			if ( this.ALBB_CollisionCheck( ALIENSHIPS[i], this) )	{
				whichAS = i;
				collision = true;

				console.log();
				console.log("Alien Ship #", i, "has been hit by projectile fired by", this.origin, "\n",
				"Alien Ship:", ALIENSHIPS[i].pos, "\nProjectile:", this.pos, "\n",
				"check: ", this.ALBB_CollisionCheck( ALIENSHIPS[i], this)
				);
				break;
			}
		}
		if(collision){
			// Score points, update player stats.
			PLAYERS[player].shotsMade++ ;

			// Update the accuracy data.
			PLAYERS[player].updateAccuracy();

			// Update the player score.
			PLAYERS[player].score += ALIENSHIPS[whichAS].awardPoints() ;

			// Remove Alien Ship
			ALIENSHIPS[whichAS].removeThis=true;

			// Remove projectile
			this.removeThis=true;
		}
	};

	// Collision check: Alien Ship shoots Player.
	// FIX !!!
	this.alienShipShootsPlayer = function(){
		// Get list of Players and compare to see if this projectile overlaps one.
		var whichPlayer = false;
		var collision = false;
		for(var i=0; i<PLAYERS.length; i++){
			if ( this.ALBB_CollisionCheck2( PLAYERS[i], this) )	{
				whichPlayer = i;
				collision = true;
				break;
			}
		}
		if(collision){
			if     (this.origin == "AS"){
				// console.log("Alien Ship has landed a hit on Player", whichPlayer);
			}
			else if(this.origin == "AI"){
				// console.log("Alien Invader has landed a hit on Player", whichPlayer);
			}
			this.removeThis = true;
			PLAYERS[whichPlayer].timesHit++;
			return;
		}
	};

	// Collision check: Player shoots Alien Invader.
	this.playerShootsAlienInvader = function(player){
		// Get list of Alien Invaders and compare to see if this projectile overlaps one.
		var whichAS = false;
		var collision = false;
		for(var i=0; i<ALIENINVADERS.length; i++){
			if ( this.ALBB_CollisionCheck( ALIENINVADERS[i], this) )	{
				whichAS = i;
				collision = true;
				break;
			}
		}
		if(collision){
			// Score points, update player stats.
			PLAYERS[player].shotsMade++ ;

			// Update the accuracy data.
			PLAYERS[player].updateAccuracy();

			// Update the player score.
			PLAYERS[player].score += ALIENINVADERS[whichAS].awardPoints() ;

			// Remove Alien Ship
			ALIENINVADERS[whichAS].removeThis=true;
			// ALIENINVADERS[whichAS].hidden=true;

			// Remove projectile
			this.removeThis=true;
		}

	};

	// Collision check: Alien Invader shoots Player.
	this.alienInvaderShootsPlayer = function(){
		//
	};

	this.updatePosition = function(){
		// ** Handle projectile movements
		// Who fired this shot? Player1? Player2?

		if(this.origin == "P1" || this.origin == "P2"){
			// Which index in the PLAYERS array is this?
			var player;
			if     (this.origin=="P1"){ player=0; }
			else if(this.origin=="P2"){ player=1; }

			// ** Has this projectile reached the TOP of the canvas? Remove it.
			if(this.pos.y <= HEIGHT-HEIGHT){
				this.removeThis = true;
				// ** Also, the player missed. Re-assess accuracy data.
				PLAYERS[player].updateAccuracy();
				return;
			}
			else{
				// ** Move the projectile UP.
				this.pos.y-=this.velocityy;
			}

			// ** Handle projectile collisions.
			// Collision check: Player shoots Alien Ship.
			this.playerShootsAlienShip(player);

			// Collision check: Player shoots Alien Invader.
			this.playerShootsAlienInvader(player);
		}
		// Who fired this shot? Alien Invader? Alien Ship?
		else if(this.origin == "AI" || this.origin == "AS"){
			// ** Has this projectile reached the BOTTOM of the canvas? Remove it.
			if(this.pos.y >= HEIGHT){
				this.removeThis = true;
				return;
			}
			else{
				// ** Move the projectile DOWN.
				this.pos.y-=this.velocityy;
			}

			// ** Handle projectile collisions.
			// Collision check: Alien Invader shoots Player.
			this.alienInvaderShootsPlayer();

			// Collision check: Alien Ship shoots Player.
			this.alienShipShootsPlayer();
		}
	};

	this.draw = function(){

		var coords=spriteSheet.misc.shot1.frame1;
		// console.log("ship", ship, ship.data);
		CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.pos.x, this.pos.y,this.size.w,this.size.h);

		return;
		// Draw the projectile body.
		CONTEXT.fillStyle = this.color;
		CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		// first save the untranslated/unrotated context
		CONTEXT.save();

		// move the rotation point to the center of the rect
		// CONTEXT.translate(this.pos.x, this.pos.y);

		// Could be "P1", "P2", "AI", "AS"
		if(this.origin == "AI" || this.origin == "AS"){
			// console.log("enemy projectile!", this.pos.x+this.size.w/2, this.pos.y+this.size.w/2, this.size.w*1.5 , 0, 2*Math.PI);
			// CONTEXT.rotate(180*Math.PI/180);
			var X= this.pos.x + this.size.w/2;
			var Y= this.pos.y + this.size.h;
		}
		if(this.origin == "P1" || this.origin == "P2"){
			// console.log("player projectile!", this.pos.x+this.size.w/2, this.pos.y+this.size.w/2, this.size.w*1.5 , 0, 2*Math.PI);
			// CONTEXT.rotate(0*Math.PI/180);
			var X= this.pos.x + this.size.w/2;
			var Y= this.pos.y ;//- this.size.h/2;
		}

		// Draw the business end of the projectile.
		CONTEXT.beginPath();
			CONTEXT.arc(X, Y, this.size.w*1.5 , 0, 2*Math.PI);
		CONTEXT.closePath();
			CONTEXT.strokeStyle = this.color;
			CONTEXT.fillStyle = '#F00';
			CONTEXT.fill();
			CONTEXT.stroke();

		// restore the context to its untranslated/unrotated state
		CONTEXT.restore();



	};
}

function AlienShip(pos, size, velocityx, color, type){
	// console.log("New Alien Ship created with values: ", pos, size, velocityx, color, type);
	this.pos = pos ;				// Position of Alien Ship ( {"x":"", "y":""}
	this.size = size;				// Dimensions of Alien Ship ( {"w":"", "h":""}
	this.velocityx = velocityx ;	// Has X velocity.
	this.color = color ;			// Has color.
	this.type = type ;				// Has type. // Type (0-4);
	this.removeThis = false;
	this.shotsFired = 0;
	this.jumpingY = 0;

	this.fire = function(){
		// An Alien Ship has fired a shot! Configure a new projectile!
		this.shotsFired ++;

		var newProjectile = {
			"pos"		: { "x" : this.pos.x + this.size.w / 2, "y" : this.pos.y + this.size.h },
			"size"		: { "w" : 15, "h" : 20 },
			"velocityy"	: -5,
			"color" 	: 'greenyellow',
			"origin"		: "AS"
		};
		UTILITYFUNCTIONS.addProjectile(newProjectile);
	};

	this.awardPoints = function(){
		// Determine number of points awarded for a successful hit!
		switch (this.type) {
			case 0:	this.points = 100;	break;
			case 1:	this.points = 100;	break;
			case 2:	this.points = 100;	break;
			case 3:	this.points = 100;	break;
			case 4:	this.points = 100;	break;
			case 5:	this.points = 100;	break;
			default : this.points = 1;	break;
		}
		// console.log("type was:", this.type);
		return this.points;
	};

	this.updatePosition = function(){
		// Manual user input to make the Alien Ship fire.
		if (KEYSTATE[KEYBOARD_CONTROLS.AS.FIRE.CODE]) {
			this.fire();
		}

		// Determine if the Alien Ship needs to turn around.
		if      (this.pos.x <= 0               ) { velocityx *=-1; }
		else if (this.pos.x > WIDTH-this.size.w) { velocityx *=-1; }

		// Move the Alien Ship on the X axis.
		this.pos.x += velocityx;
		if     (this.jumpingY == 0){ this.pos.y += -2; }
		else if(this.jumpingY == 1){ this.pos.y += 2; }
		this.jumpingY = ! this.jumpingY ;

		// Make sure that the new x and y are valid and the Alien Ship cannot go out of bounds.
		this.pos.x = Math.max(0, Math.min(this.pos.x, WIDTH));
	};

	this.draw = function(){
		// Colored rectangle
		CONTEXT.fillStyle = this.color;
		// CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		var coords=spriteSheet.alienShips.ship1.frame1;
		// CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.pos.x, this.pos.y, this.size.w, this.size.h);
		CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.pos.x, this.pos.y, this.size.w, this.size.h);
	};
}

function AlienInvader(pos, size, velocityx, color, type){
	// console.log("New Alien Invader created with values: ", pos, size, velocityx, color, type);
	this.pos = pos ;				// Position of Alien Invader ( {"x":"", "y":""}
	this.size = size;				// Dimensions of Alien Invader ( {"w":"", "h":""}
	this.velocityx = velocityx ;	// Has X velocity.
	this.color = color ;			// Has color.
	this.type = type ;				// Has type. // Type (0-4);
	this.removeThis = false;
	this.shotsFired = 0;
	this.jumpingY = 0;
	this.hidden = false;			// Hidden happens when this Alien Invader is not visible... hard mode!!
	this.framenum = "frame1";				//
	this.frameslatency = 0;
	this.frameslatencymax = 5;

	this.fire = function(){
		// An Alien Invader has fired a shot! Configure a new projectile!
		this.shotsFired ++;

		var newProjectile = {
			"pos"		: { "x" : this.pos.x + this.size.w / 2, "y" : this.pos.y + this.size.h },
			"size"		: { "w" : 15, "h" : 20 },
			"velocityy"	: -5,
			"color" 	: 'skyblue',
			"origin"	: "AI"
		};
		UTILITYFUNCTIONS.addProjectile(newProjectile);
	};

	this.awardPoints = function(){
		// Determine number of points awarded for a successful hit!
		switch (this.type) {
			case 0:	this.points = 30;	break;
			case 1:	this.points = 25;	break;
			case 2:	this.points = 20;	break;
			case 3:	this.points = 10;	break;
			case 4:	this.points = 10;	break;
			case 5:	this.points = 10;	break;
			default :
				// console.log("default", this.points, this.color, this.type);
				this.points = 1;
			break;
		}

		return this.points;
	};

	// this.updatePosition = function(){
		// UTILITYFUNCTIONS.moveAlienInvader_grid();
	// };

	this.draw = function(){
		CONTEXT.fillStyle = this.color;
		CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		var coords;

		if(this.type == "0"){ coords=spriteSheet.alienInvaders.type00[this.framenum]; }
		if(this.type == "1"){ coords=spriteSheet.alienInvaders.type01[this.framenum]; }
		if(this.type == "2"){ coords=spriteSheet.alienInvaders.type02[this.framenum]; }
		if(this.type == "3"){ coords=spriteSheet.alienInvaders.type03[this.framenum]; }
		if(this.type == "4"){ coords=spriteSheet.alienInvaders.type04[this.framenum]; }
		if(this.type == "5"){ coords=spriteSheet.alienInvaders.type05[this.framenum]; }
		if(this.type == "6"){ coords=spriteSheet.alienInvaders.type06[this.framenum]; }
		if(this.type == "7"){ coords=spriteSheet.alienInvaders.type07[this.framenum]; }
		if(this.type == "8"){ coords=spriteSheet.alienInvaders.type08[this.framenum]; }
		if(this.type == "9"){ coords=spriteSheet.alienInvaders.type09[this.framenum]; }

		// var coords=spriteSheet.alienInvaders.type;
		// console.log("coords", coords, this.type, this.framenum);

		CONTEXT.drawImage(
			ship,
			coords.x,
			coords.y,
			coords.w,
			coords.h,
			this.pos.x,
			this.pos.y,
			this.size.w,
			this.size.h);
		// return;

	};
}

