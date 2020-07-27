"use strict";


let STARS = {
	flag_useStarBackground1 : true ,
	flag_useStarBackground2 : false ,
	starfield1              : [] ,
	starfield2              : [] ,

	useStarBackground1 : function(){
		STARS.flag_useStarBackground1=true;
		STARS.flag_useStarBackground2=false;
	},
	useStarBackground2 : function(){
		STARS.flag_useStarBackground1=false;
		STARS.flag_useStarBackground2=true;
	},

	getRandom : function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	generateStarBackground1 : function(){
		let stars = 250;
		STARS.starfield1=[];
		for (let i = 0; i < stars; i++) {
			let x = Math.floor(Math.random() * CONTEXT.canvas.offsetWidth)  ;
			let y = Math.floor(Math.random() * CONTEXT.canvas.offsetHeight) ;
			let radius = Math.random() * 1.25;

			STARS.starfield1.push({
				"x"      : x      ,
				"y"      : y      ,
				"radius" : radius ,
			});
		}
	},
	drawStarBackground1 : function(){
		let stars = STARS.starfield1.length;
		for (let i = 0; i < stars; i++) {
			let x      = STARS.starfield1[i].x;
			let y      = STARS.starfield1[i].y;
			let radius = STARS.starfield1[i].radius;
			CONTEXT.beginPath();
			CONTEXT.arc(x, y, radius, 0, 360);
			CONTEXT.fillStyle = "hsla(200,100%,50%,0.8)";
			CONTEXT.fill();
		}
	},
	generateStarBackground2 : function(){
		let stars = 250;
		let colorrange = [0,60,240];
		STARS.starfield2=[];
		for (let i = 0; i < stars; i++) {
			let x = Math.floor(Math.random() * CONTEXT.canvas.offsetWidth)  ;
			let y = Math.floor(Math.random() * CONTEXT.canvas.offsetHeight) ;
			let radius = Math.random() * 1.25;
			let hue    = colorrange[STARS.getRandom(0,colorrange.length - 1)];
			let sat    = STARS.getRandom(75,100);

			STARS.starfield2.push({
				"x"      : x      ,
				"y"      : y      ,
				"radius" : radius ,
				"hue"    : hue    ,
				"sat"    : sat    ,
			});
		}
	},
	drawStarBackground2 : function(){
		let stars = STARS.starfield2.length;

		for (let i = 0; i < stars; i++) {
			let x      = STARS.starfield2[i].x;
			let y      = STARS.starfield2[i].y;
			let radius = STARS.starfield2[i].radius;
			let hue    = STARS.starfield2[i].hue;
			let sat    = STARS.starfield2[i].sat;

			CONTEXT.beginPath();
			CONTEXT.arc(x, y, radius, 0, 360);
			CONTEXT.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
			CONTEXT.fill();
		}
	},
};

// GLOBAL STUFF
// Constants
let KEYBOARD_CONTROLS = {
	// "CODE" refers to the keycode value of the key. "NAME" and "PURPOSE" aren't actually required.
	"P1":{
		"LEFT"  : { "CODE" : 37, "NAME" : "Left Arrow",  "PURPOSE" : "Move Player 1 LEFT"},
		"RIGHT" : { "CODE" : 39, "NAME" : "Right Arrow", "PURPOSE" : "Move Player 1 RIGHT"},
		"FIRE"  : { "CODE" : 38, "NAME" : "Up Arrow",    "PURPOSE" : "Player 1 FIRE"},
	},
	"P2":{
		"LEFT"  : { "CODE" : 65, "NAME" : "A Key",       "PURPOSE" : "Move Player 2 LEFT"},
		"RIGHT" : { "CODE" : 68, "NAME" : "D Key",       "PURPOSE" : "Move Player 2 RIGHT"},
		"FIRE"  : { "CODE" : 87, "NAME" : "W Key",       "PURPOSE" : "Player 2 FIRE"},
	},
	"AS":{
		"FIRE"  : { "CODE" : 32, "NAME" : "Spacebar",    "PURPOSE" : "All Alien Ships FIRE"},
	},
	"AI":{
		"FIRE"  : { "CODE" : 17, "NAME" : "Control Key", "PURPOSE" : "All Alien Invaders FIRE"},
	}

};

// Holds the sprite sheet image.
let ship = new Image();
ship.src = 'images/invaders_1_.png';
// Holds the positions and dimensions of each sprite.
let spriteSheet = {
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

let PLAYERSIZE_SMALL = { "W" : 50, "H" : 25 };
let PLAYERSIZE_LARGE = { "W" : 60, "H" : 20 };

// CANVAS dimensions.
let WIDTH  ;
let HEIGHT ;

// Changable Game Elements
let CANVAS        ;            // Handle on the game's CANVAS.
let CONTEXT       ;            // Game canvas drawable CONTEXT.
let CANVAS_post;
let CONTEXT_post;
let FPS               = 30;    // Game Frames Per Second.
let PLAYERS           = [];    // Holds the objects for each player.
let PROJECTILES       = [];    // Holds the objects for each projectile on screen.
let ALIENSHIPS        = [];    // Holds the objects for each Alien ship on screen.
let ALIENINVADERS     = [];    // Holds the objects for each Alien Invader on screen.
let PAUSED            = false; // Boolean for pause.
let KEYSTATE          = [];    // Array that holds all keyboard keys that are pressed.
let BOTTOM_ENDGAME    = 0 ;    // DEFINED IN WINDOW.ONLOAD.
let INVADER_W         = 32;    //
let INVADER_H         = 32;    //
let INVADER_SPACING_X = Math.ceil(INVADER_W/1.2);
let INVADER_SPACING_Y = Math.ceil(INVADER_H/1.2);

// Projectile Queue Counters.
let PROJECTILES_QUEUE_P1 = 0;
let PROJECTILES_QUEUE_P2 = 0;

let showCanvasCursorCoords_ON = false;
let AUDIOCANPLAY = false;

let PAGEVISIBLE = true;

let STO_ID;
let RAF_ID;

let DEBUG = {
	updateDebugData : function (){
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

			// Create the headers.
			// let row = table.insertRow(table.rows.length);

			// headers.forEach(function(d,i,a){
			// 	// let cell = row.insertCell(i);
			// 	let cell = document.createElement("th");
			// 	cell.innerText = d;
			// 	row.appendChild(cell);
			// });

			// // Create the data row.
			// row = table.insertRow(table.rows.length);
			// headers.forEach(function(d,i,a){
			// 	let cell = document.createElement("td");
			// 	cell.innerText = data[d];
			// 	row.appendChild(cell);
			// });

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

		let flagsAndVars        = function(){
			let table1 = createTable_type1(
				[
					"AUDIOCANPLAY",
					"FPS",
					"PROJECTILES_QUEUE_P1",
					"PROJECTILES_QUEUE_P2",
				],
				{
					"AUDIOCANPLAY"        : AUDIOCANPLAY        ,
					"FPS"                 : FPS                 ,
					"PROJECTILES_QUEUE_P1": PROJECTILES_QUEUE_P1,
					"PROJECTILES_QUEUE_P2": PROJECTILES_QUEUE_P2,
				},
				"flagsAndVars",
				200
			);

			table1.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			div.appendChild(table1);

			// Return the table.
			return { "div" : div };
		};
		let firingStats_enemies = function(){
			let table1 = createTable_type2(Object.keys(UTILITYFUNCTIONS.alienShips_info)   , [UTILITYFUNCTIONS.alienShips_info]   , "alienShips_info"   , 300);
			let table2 = createTable_type2(Object.keys(UTILITYFUNCTIONS.alienInvaders_info), [UTILITYFUNCTIONS.alienInvaders_info], "alienInvaders_info", 300);

			table1.classList.add("debugTable1");
			table2.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			div.appendChild(table1);div.appendChild( document.createElement("br"));
			div.appendChild(table2);div.appendChild( document.createElement("br"));

			return {
				"div" : div ,
			};
		};
		let alienShips          = function(){
			let table1 = createTable_type2(
				[
					"i",
					"shots",
					"type",
					"velocityx",
				],

				ALIENSHIPS.map(function(d,i,a){
					return {
						"i"         : i            ,
						"shots"     : d.shotsFired ,
						"type"      : d.type       ,
						"velocityx" : d.velocityx  ,
					};
				}),
				"alienShips",
				200
			);

			table1.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			div.appendChild(table1);

			// Return the table.
			return { "div" : div };
		};
		let alienInvaders       = function(){
			let mapFunction = function(d,i,a){
				let dir = (Math.sign(d.velocityx) == 1 ? 'R' : 'L') ;
				let frame = d.frameslatency + "/" + d.frameslatencymax ;
				let x = d.pos.x;
				let y = d.pos.y;

				return {
					"i"     : i            ,
					"shots" : d.shotsFired ,
					"dir"   : dir          ,
					"frame" : frame        ,
					"x"     : x            ,
					"y"     : y            ,
				};
			};

			let headers = [
				"i",
				"shots",
				"dir"  ,
				"frame",
				"x"    ,
				"y"    ,
			];

			let data = ALIENINVADERS.map(mapFunction);

			let len = data.length;
			let data1 = data.splice(0, len/2);
			let data2 = data.splice(0, len/2);

			let table1 = createTable_type2( headers, data1, "Alien Invaders (group 1)", 200 );
			let table2 = createTable_type2( headers, data2, "Alien Invaders (group 2)", 200 );

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
		let projectiles         = function(){
			let data = {
				"AI" : [],
				"AS" : [],
				"P1" : [],
				"P2" : [],
			};
			PROJECTILES.forEach(function(d,i,a){
				let newRec = {
					"i"         : i         ,
					"x"         : d.pos.x   ,
					"y"         : d.pos.y   ,
					"w"         : d.size.w  ,
					"h"         : d.size.h  ,
					"velocityy" : d.velocityy ,
					"origin"    : d.origin    ,
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
				"i"         ,
				"x"         ,
				"y"         ,
				"w"         ,
				"h"         ,
				"velocityy" ,
				"origin"    ,
			];

			let table1 = createTable_type2( headers, data["AI"], "Projectiles (AI)", 200 );
			let table2 = createTable_type2( headers, data["AS"], "Projectiles (AS)", 200 );
			let table3 = createTable_type2( headers, data["P1"], "Projectiles (P1)", 200 );
			let table4 = createTable_type2( headers, data["P2"], "Projectiles (P2)", 200 );

			table1.classList.add("debugTable1");
			table2.classList.add("debugTable1");
			table3.classList.add("debugTable1");
			table4.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			div.appendChild(table1);
			div.appendChild(table2);
			div.appendChild( document.createElement("br"));
			div.appendChild(table3);
			div.appendChild(table4);

			// Return the table.
			return {
				"div" : div ,
			};
		};
		let inputs              = function(){};

		let html_flagsAndVars        = flagsAndVars();
		let html_firingStats_enemies = firingStats_enemies();
		let html_alienInvaders       = alienInvaders();
		let html_alienShips          = alienShips();
		let html_projectiles         = projectiles();
		let html_inputs              = inputs();

		let div = document.createElement("div");
		div.appendChild(html_flagsAndVars.div);
		div.appendChild(html_firingStats_enemies.div);
		div.appendChild(html_alienShips.div);
		div.appendChild(html_alienInvaders.div);
		div.appendChild(html_projectiles.div);
		// div.appendChild(html_inputs);

		// console.log(div);
		DOM.debug_details.innerHTML="";
		DOM.debug_details.appendChild(div);
	},
	raiseInvaders : function(){
		for(let i=0; i<ALIENINVADERS.length; i++){
			ALIENINVADERS[i].pos.y -= ALIENINVADERS[i].size.h;
		}
	},
	lowerInvaders : function(){
		for(let i=0; i<ALIENINVADERS.length; i++){
			ALIENINVADERS[i].pos.y += ALIENINVADERS[i].size.h;
		}
	},
	removeLastAlienInvader : function(){
		if( ALIENINVADERS.length ) {
			ALIENINVADERS[ALIENINVADERS.length-1].removeThis=true ;
		}
	},
	removeFirstAlienInvader : function(){
		if( ALIENINVADERS.length ) {
			ALIENINVADERS[0].removeThis=true ;
		}
	},

};

// Utility functions that can be called from anywhere. All neatly contained within this object.
let UTILITYFUNCTIONS = {
	enlargeRandomInvader : function(){
		// let min=0;
		// let max=ALIENINVADERS.length-1;
		// let index = Math.floor(Math.random() * (max - min + 1)) + min;

		// // ALIENINVADERS[index].size.w *= 2;
		// // ALIENINVADERS[index].size.h *= 2;
		// ALIENINVADERS[index].enlarged=true;

	},

	// Wrap the native DOM audio element play function and handle any autoplay errors
	adjustAudioPlayPrototype : function(){
		Audio.prototype.play = (function(play) {
			// https://stackoverflow.com/a/56279295
			return function () {
				let audio   = this;
				let args    = arguments;
				let promise = play.apply(audio, args);


				if (promise !== undefined) {
					promise
					.then(function(e){
						if(!AUDIOCANPLAY){
							// console.log("audio is ready.");
							AUDIOCANPLAY=true;
						}
					})
					.catch(_ => {
						// console.log("audio is NOT ready.");
						AUDIOCANPLAY=false;
					});
				}
			};
		})(Audio.prototype.play);
	},

	//
	addUserInteractionRestriction    : function(){
		CONTEXT.fillStyle = "black";
		CONTEXT.fillRect(0,0,CANVAS.width, CANVAS.height);

		CONTEXT.font = "36px Arial";
		CONTEXT.fillStyle = "white";
		CONTEXT.fillText("Click anywhere on the", 90, 250);
		CONTEXT.fillText(" webpage to continue.", 90, 300);

		// Draw from the non-DOM-attached canvas to the real canvas.
		CONTEXT_post.drawImage(CANVAS, 0, 0);

		document.addEventListener   ('keydown'    , UTILITYFUNCTIONS.removeUserInteractionRestriction, false);
		document.addEventListener   ('keyup'      , UTILITYFUNCTIONS.removeUserInteractionRestriction, false);
		document.addEventListener   ('mousedown'  , UTILITYFUNCTIONS.removeUserInteractionRestriction, false);
		document.addEventListener   ('mouseup'    , UTILITYFUNCTIONS.removeUserInteractionRestriction, false);
		document.addEventListener   ('touchstart' , UTILITYFUNCTIONS.removeUserInteractionRestriction, false);
		document.addEventListener   ('touchend'   , UTILITYFUNCTIONS.removeUserInteractionRestriction, false);
	},
	removeUserInteractionRestriction : function(){
		document.removeEventListener('keydown'     , UTILITYFUNCTIONS.removeUserInteractionRestriction);
		document.removeEventListener('keyup'       , UTILITYFUNCTIONS.removeUserInteractionRestriction);
		document.removeEventListener('mousedown'   , UTILITYFUNCTIONS.removeUserInteractionRestriction);
		document.removeEventListener('mouseup'     , UTILITYFUNCTIONS.removeUserInteractionRestriction);
		document.removeEventListener('touchstart'  , UTILITYFUNCTIONS.removeUserInteractionRestriction);
		document.removeEventListener('touchend'    , UTILITYFUNCTIONS.removeUserInteractionRestriction);

		AUDIOCANPLAY=true;

		main();
	},

	// Sound effects
	sounds         : {
		"player_shoot"        : { "src":"sounds/shoot5.mp3", "elem":undefined } ,
		"alien_ship_shoot"    : { "src":"sounds/shoot2.mp3", "elem":undefined } ,
		"alien_invader_shoot" : { "src":"sounds/shoot4.mp3", "elem":undefined } ,
		"player_hit"          : { "src":"sounds/hit1.mp3", "elem":undefined } ,
		"alien_ship_hit"      : { "src":"sounds/hit1.mp3", "elem":undefined } ,
		"alien_invader_hit"   : { "src":"sounds/hit1.mp3", "elem":undefined } ,
	},
	loadSoundFiles : function(){
		// UTILITYFUNCTIONS.loadSoundFiles()
		// Create the sound if it is not already cached.
		let keys = Object.keys(UTILITYFUNCTIONS.sounds);
		keys.forEach(function(d,i,a){
			let key = d;
			let value = UTILITYFUNCTIONS.sounds[key];
			if(!value.elem){
				let elem;
				elem = document.createElement("audio");
				elem.src = value.src;
				elem.setAttribute("preload", "auto");
				elem.setAttribute("controls", "none");
				elem.style.display = "none";
				UTILITYFUNCTIONS.sounds[key].elem = elem;
				elem.load();

				// console.log("loaded:", key, UTILITYFUNCTIONS.sounds[key]);
			}
		});
	},
	playSound      : function(src){
		// EXAMPLES:

		// Check if the index provided is set. If not, then just return.
		if(!UTILITYFUNCTIONS.sounds[src]){ console.log("sound not registered."); return ; }

		// Use cached copy of the sound file.
		let elem = UTILITYFUNCTIONS.sounds[src].elem;

		//
		// console.log( UTILITYFUNCTIONS.sounds[src], src );
		// elem.pause();
		elem.currentTime = 0;
		// console.log("can play:", elem.canPlayType('audio/mpeg')); // "maybe"
		// elem.play().then(function(e){ console.log("success", e); }.catch(function(e){ console.log("fail", e); }));

		elem.volume=0.025;
		elem.play();
	},

	// FPS
	raiseFPS : function(){
		if(FPS<60){ FPS++; }
	},
	lowerFPS : function(){
		if(FPS>1){ FPS--; }
	},

	// Game Overrides
	newGameInit : function(){
		// init();
		clearTimeout(STO_ID);
		window.cancelAnimationFrame(RAF_ID);
		main();
	},
	pauseGame   : function(){
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
	addPlayer   : function(newPlayer){
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
		let origin = thisPlayer.playernum == 1 ? "P1" : "P2" ;
		let active_shots = 0;
		let max_active_shots = 1;

		// First determine how many total projectiles for THIS player currently exist on the field.
		for(let i=0; i<PROJECTILES.length; i++){
			if(PROJECTILES[i].origin==origin){
				active_shots++;
			}
		}
		// Second specify how many total projectiles for THIS player are allowed.
		// Third look at the matching player PROJECTILES_QUEUE and count how many are queued

		// Now, if we have max shots on the field then we are NOT allowed to fire and this fire is canceled.
		if(
			active_shots < max_active_shots && // Less active shots than we are allowed at max.
			PLAYERS.length                     // Of course course that we have active players.
		){
			// We can fire right now.
			let color;

			// A player has fired a shot! Configure a new projectile!
			if     (origin=="P1"){ color = PLAYERS[0].color ; } // "blue"; }
			else if(origin=="P2"){ color = PLAYERS[1].color ; } // "red"; }

			// Record this as a shot.
			thisPlayer.shotsFired ++;

			// Add the new projectile into the game.
			let newProjectile = {
				"pos"		: { "x" : thisPlayer.x+thisPlayer.width/2-3, "y" : thisPlayer.y-thisPlayer.height/2-3 },
				"size"		: { "w" : 15, "h" : 20 },
				// "velocityy"	: 15  + Math.floor((Math.random() * 5) + 0),
				"velocityy"	: 15 ,
				"color" 	: color,
				"origin"	: origin
			};

			UTILITYFUNCTIONS.addProjectile(newProjectile);
		}
	},

	// Projectiles
	addProjectile : function(info){
		// Play sound!
		switch(info.origin){
			case "AS" : { UTILITYFUNCTIONS.playSound('alien_ship_shoot');    break; }
			case "AI" : { UTILITYFUNCTIONS.playSound('alien_invader_shoot'); break; }
			case "P1" : { UTILITYFUNCTIONS.playSound('player_shoot');        break; }
			case "P2" : { UTILITYFUNCTIONS.playSound('player_shoot');        break; }
			default   : {  break; }
		}

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
	enemyFires    : function(){
		// Now.
		let now = Math.floor(performance.now());

		// Get a count of active projectiles, separated by origin.
		let projectileCounts = UTILITYFUNCTIONS.countProjectiles();

		// Alien Ships - Fire tests.
		let AS_test1 = (projectileCounts.AS ? projectileCounts.AS : 0) < UTILITYFUNCTIONS.alienShips_info.maxProjectiles ;
		let AS_test2 = ALIENSHIPS.length ? true : false;
		let AS_test3 = now - UTILITYFUNCTIONS.alienShips_info.lastFire >= UTILITYFUNCTIONS.alienShips_info.nextFire ? true : false;

		// Can the Alien Ship fire?
		if( AS_test1 && AS_test2 && AS_test3 ){
			// Choose an Alien Ship at random.
			let whichShip = Math.floor((Math.random() * ALIENSHIPS.length) + 0) ;
			ALIENSHIPS[whichShip].fire();

			// Record the last fire time.
			UTILITYFUNCTIONS.alienShips_info.lastFire=now;

			// Determine the next shot time.
			let min = UTILITYFUNCTIONS.alienShips_info.minWait ;
			let max = UTILITYFUNCTIONS.alienShips_info.maxWait ;
			let numSeconds =  Math.floor(Math.random() * max) + min;
			UTILITYFUNCTIONS.alienShips_info.nextFire=numSeconds*1000;
		}

		// Alien Invaders - Fire tests.
		let AI_test1 = (projectileCounts.AI ? projectileCounts.AI : 0) < UTILITYFUNCTIONS.alienInvaders_info.maxProjectiles ;
		let AI_test2 = ALIENINVADERS.length ? true : false;
		let AI_test3 = now - UTILITYFUNCTIONS.alienInvaders_info.lastFire >= UTILITYFUNCTIONS.alienInvaders_info.nextFire ? true : false;

		// Can an Alien Invader fire?
		if( AI_test1 && AI_test2 && AI_test3 ){
			// Choose an Alien Invader at random.
			let whichShip = Math.floor((Math.random() * ALIENINVADERS.length) + 0) ;
			ALIENINVADERS[whichShip].fire();

			// Record the last fire time.
			UTILITYFUNCTIONS.alienInvaders_info.lastFire=now;

			// Determine the next shot time.
			let min = UTILITYFUNCTIONS.alienInvaders_info.minWait ;
			let max = UTILITYFUNCTIONS.alienInvaders_info.maxWait ;
			let numSeconds =  Math.floor(Math.random() * max) + min;
			UTILITYFUNCTIONS.alienInvaders_info.nextFire=numSeconds*1000;
		}
	},

	// Alien Ships
	alienShips_info     : {
		"lastFire"       : 0    , // The last fire.
		"nextFire"       : 7000 , // milliseconds since lastFire before the next fire can be made.
		"minWait"        : 3    , // Min time between fires (in seconds.)
		"maxWait"        : 6    , // Max time between fires (in seconds.)
		"maxProjectiles" : 1    , // Max number of projectiles allowed for Alien Ships.
	},
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
	addRandomAlienShip  : function(){
		// Randomize the X, Y, Size, Velocity, Color, Type. We are going to get either a 0 or a 1.
		let random5050 = parseInt((( Math.random()*2 ) + 0), 10).toFixed(0) ;

		// Size
		let size = {
			"w": 50,
			"h": 20
		};

		// Position.
		let maxY = 15;
		let pos = {
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
		// let velocityx = Math.floor(Math.random()*10) + 5;
		let velocityx = 5;
		if     (random5050==0){ velocityx *=  1; }              // If on the left side then make it go RIGHT (Positive).
		else if(random5050==1){ velocityx *= -1; }              // If on the left side then make it go RIGHT (Positive).
		// velocityx *= Math.floor(Math.random()*1) == 1 ? 1 : -1; // Make it negative 50% of the time.

		// Color
		let color_index = Math.floor((Math.random() * 5) + 0) ;
		let colors      = ["red", "green", "cornflowerblue", "rebeccapurple", "darkgray", "brown"];
		let color       = colors[color_index];
		let type        = Math.floor((Math.random() * 4) + 0) ;

		// Create an Alien Ship.
		let newAlienShip = {
			"pos"		: { "x" : pos.x , "y" : pos.y  },
			"size"		: { "w" : size.w, "h" : size.h },
			"velocityx"	: velocityx,
			"color"		: color,
			"type"		: type
		};

		// console.log("newAlienShip.pos:", newAlienShip.pos, newAlienShip.color);
		UTILITYFUNCTIONS.addAlienShip(newAlienShip);
	},

	// Alien Invaders
	alienInvaders_info      : {
		"lastFire"       : 0    , // The last fire.
		"nextFire"       : 3000 , // milliseconds since lastFire before the next fire can be made.
		"minWait"        : 1    , // Min time between fires (in seconds.)
		"maxWait"        : 3    , // Max time between fires (in seconds.)
		"maxProjectiles" : 5    , // Max number of projectiles allowed for Alien Invaders.
	},
	addAlienInvader         : function(newAI){
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

		// let color = [ "#458ade", "#c71bba", "#3d7b8e", "#63b389", "#e6bc78", "#f31a0e" ];
		let color = [ "red", "rebeccapurple", "orange", "green", "violet", "cornflowerblue" ];
		let type  = [ 0, 1, 2, 3, 4, 5 ];
		// let size  = 40;
		let w  = INVADER_W; // 20; // 40;
		let h  = INVADER_H; // 20; // 40;
		let Y;
		let X;
		let velocityx = 8 ;
		let xoffset = INVADER_SPACING_X ; // Math.ceil(w/1.2);
		let yoffset = INVADER_SPACING_Y ; // Math.ceil(w/1.2);

		for(let row=1; row<=6; row++){
			// Y = 0 + (row*h) + (row*h)/4 ;
			Y = 0 + (row*h) + yoffset*(row-1);

			// Offset for the whole row.
			Y+=20;

			for(let col=1; col<=6; col++){
				// X is the col times the invader height + col times invader height divided by 4.
				X = ((col-1)*w)  + xoffset*(col-1);

				// Offset for the whole col.
				X+=80;

				UTILITYFUNCTIONS.addAlienInvader( {
					"pos"		: { "x" : X, "y" : Y },
					"size"		: { "w" : w, "h" : h },
					"velocityx"	: velocityx,
					"color"		: color[row-1],
					"type"		: type[row-1]
				});
			}

		}
	},
	drawAlienInvader_grid   : function(){
		for(let i=0; i<ALIENINVADERS.length; i++){
			// Manual user input to make the Alien Invader fire.
			if (KEYSTATE[KEYBOARD_CONTROLS.AI.FIRE.CODE]) { ALIENINVADERS[i].fire(); }

			//
			ALIENINVADERS[i].draw();
		}
	},
	moveAlienInvader_grid   : function(){
		let reached_x_boundary=false;
		let check_x_boundary=function(){
			// First, determine if an invader would hit a x boundry on the next move.
			for(let i=0; i<ALIENINVADERS.length; i++){
				// Which way is the invader going?
				let dir = (Math.sign(ALIENINVADERS[i].velocityx) == 1 ? 'R' : 'L');

				let onRightBoundary = (ALIENINVADERS[i].pos.x      + ALIENINVADERS[i].size.w) >= WIDTH-ALIENINVADERS[i].size.w/2;
				let onLeftBoundary  = (ALIENINVADERS[i].pos.x <= 0 + ALIENINVADERS[i].size.w/2);

				// Do boundary collision detection based on direction.
				if(dir=="R"){
					// coord starts in the upper-left of square. Need to be aware of the width of the square.
					if( onRightBoundary ){ reached_x_boundary=true; break; }
				}
				else if(dir=="L"){
					// coord starts in the upper-left of square.
					if( onLeftBoundary ){ reached_x_boundary=true; break; }
				}

			}
		};

		let moveInvaders=function(){
			// Change the displayed invader frame, move on x, bounce on y, adjust frameslatency.
			for(let i=0; i<ALIENINVADERS.length; i++){
				// Change the frame if enough frames have passed by.
				if(ALIENINVADERS[i].frameslatency >= ALIENINVADERS[i].frameslatencymax){
					if     (ALIENINVADERS[i].framenum=="frame2"){ ALIENINVADERS[i].framenum="frame1"; }
					else if(ALIENINVADERS[i].framenum=="frame1"){ ALIENINVADERS[i].framenum="frame2"; }
					else                                        { ALIENINVADERS[i].framenum="frame1"; }
					ALIENINVADERS[i].frameslatency=0;
					// ALIENINVADERS[i].frameslatency=-50;

					// Move the Alien Invader on the X axis.
					ALIENINVADERS[i].pos.x += ALIENINVADERS[i].velocityx;

					// Make sure that the new x and y are valid and the Alien Invader cannot go out of bounds.
					ALIENINVADERS[i].pos.x = Math.max( 0, Math.min(ALIENINVADERS[i].pos.x, WIDTH - ALIENINVADERS[i].size.w) );

					// Bounce the Alien Invader on the Y axis.
					if     (ALIENINVADERS[i].jumpingY == 0){ ALIENINVADERS[i].pos.y += -3; }
					else if(ALIENINVADERS[i].jumpingY == 1){ ALIENINVADERS[i].pos.y +=  3; }
					ALIENINVADERS[i].jumpingY = ! ALIENINVADERS[i].jumpingY ;
				}
				// Not enough frames passed? Increase frameslatency for this invader.
				else{
					ALIENINVADERS[i].frameslatency++;
				}
			}
		};

		let changeDirectionsOrLose=function(){
			let gameover=false;
			for(let i=0; i<ALIENINVADERS.length; i++){
				// Check if this invader has reached the bottom.
				if(ALIENINVADERS[i].pos.y + ALIENINVADERS[i].size.w/2 + ALIENINVADERS[i].size.h >= BOTTOM_ENDGAME) {
					// GAME OVER?
					gameover=true;

					//
					ALIENINVADERS.forEach(function(d,i,a){
						d.pos.y += d.size.w/2 ;
					});
					ALIENINVADERS[i].color="black";
					ALIENINVADERS[i].draw();

					if(DOM.chk_debug.checked){ window.requestAnimationFrame(DEBUG.updateDebugData); }

					UTILITYFUNCTIONS.newGameInit();

					// clearTimeout(STO_ID);
					// window.cancelAnimationFrame(RAF_ID);

					// // Erase all Alien Invaders.
					// UTILITYFUNCTIONS.eraseAlienInvader_grid();

					// // Redraw the Alien Invader grid.
					// UTILITYFUNCTIONS.createAlienInvadersGrid();

					//
					return ;

					// Break out of this loop.
					break;
				}
				else{
					// Continue the loop.

					// // Move this invader down on y.
					ALIENINVADERS[i].pos.y += ALIENINVADERS[i].size.w/2 ;

					// Change the x direction.
					ALIENINVADERS[i].velocityx *= -1 ;

					// Move the Alien Invader on the X axis.
					// ALIENINVADERS[i].pos.x += ALIENINVADERS[i].velocityx;

					// Reset the latency counter.
					ALIENINVADERS[i].frameslatency=-5;
				}
			}
		};

		//
		check_x_boundary();

		if(reached_x_boundary){ changeDirectionsOrLose(); }
		else                  { moveInvaders(); }
	},
	countProjectiles        : function(){
		let projectiles_counts = {};
		let origin;
		for(let i=0; i<PROJECTILES.length; i++){
			origin=PROJECTILES[i].origin;
			if(undefined == projectiles_counts[origin]){ projectiles_counts[origin]=0; }
			projectiles_counts[origin]++;
		}

		return projectiles_counts;
	},
	eraseAlienInvader_grid  : function(){
		ALIENINVADERS = [];
	},

	// User Interface (keyboard/mouse)
	preventScroll : function(e){
		// space and arrow keys
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	},
	getKeyPress   : function(e){
		KEYSTATE[e.keyCode] = true;
	},
	delKeyPress   : function(e){
		delete KEYSTATE[e.keyCode];
	},
};

let DOM={};
window.onload=function(){
	console.log("SPACE INVADERS!");

	// Cache DOM handles.
	DOM.chk_debug      = document.getElementById('chk_debug')      ;
	DOM.mainGameCanvas = document.getElementById("mainGameCanvas") ;
	DOM.upFPS          = document.getElementById("upFPS")          ;
	DOM.dnFPS          = document.getElementById("dnFPS")          ;
	DOM.newgame        = document.getElementById("newgame")        ;
	DOM.pause          = document.getElementById("pause")          ;
	DOM.removeAllAS    = document.getElementById("removeAllAS")    ;
	DOM.addAS          = document.getElementById("addAS")          ;
	DOM.mouseCoordsDiv = document.getElementById("mouseCoordsDiv") ;
	DOM.p1Score        = document.getElementById('p1Score')        ;
	DOM.p2Score        = document.getElementById('p2Score')        ;
	DOM.p1Accurracy    = document.getElementById('p1Accurracy')    ;
	DOM.p2Accurracy    = document.getElementById('p2Accurracy')    ;
	DOM.debug_details  = document.getElementById('debug_details')  ;

	// Prepare our game canvas.

	// The attached to DOM canvas. (used by drawFrame);
	CANVAS_post         = DOM.mainGameCanvas ;
	CONTEXT_post        = CANVAS_post.getContext("2d") ;
	CONTEXT_post.imageSmoothingEnabled       = false; //
	CONTEXT_post.oImageSmoothingEnabled      = false; //
	CONTEXT_post.webkitImageSmoothingEnabled = false; //
	CONTEXT_post.msImageSmoothingEnabled     = false; //

	//
	WIDTH          = CANVAS_post.width  ;
	HEIGHT         = CANVAS_post.height ;
	BOTTOM_ENDGAME = CANVAS_post.height-60 ;

	// The non-DOM-attached canvas.
	CANVAS        = document.createElement("canvas");
	CANVAS.width  = WIDTH;
	CANVAS.height = HEIGHT;
	CONTEXT       = CANVAS.getContext("2d") ;
	CONTEXT.imageSmoothingEnabled       = false; //
	CONTEXT.oImageSmoothingEnabled      = false; //
	CONTEXT.webkitImageSmoothingEnabled = false; //
	CONTEXT.msImageSmoothingEnabled     = false; //

	// Prevent the screen from scrolling when using the arrow keys to control the game.
	window.addEventListener("keydown"  , UTILITYFUNCTIONS.preventScroll, false);

	// Configure game controls - User Input (Mouse/Keyboard).
	document.addEventListener("keydown", UTILITYFUNCTIONS.getKeyPress );
	document.addEventListener("keyup"  , UTILITYFUNCTIONS.delKeyPress  );

	// Configure game controls - User Input Via DOM Clicks.
	DOM.upFPS      .addEventListener("click", UTILITYFUNCTIONS.raiseFPS );
	DOM.dnFPS      .addEventListener("click", UTILITYFUNCTIONS.lowerFPS );
	DOM.newgame    .addEventListener("click", UTILITYFUNCTIONS.newGameInit );
	DOM.pause      .addEventListener("click", UTILITYFUNCTIONS.pauseGame);
	DOM.removeAllAS.addEventListener("click", UTILITYFUNCTIONS.removeAllAlienShips);
	DOM.addAS      .addEventListener("click", UTILITYFUNCTIONS.addRandomAlienShip);

	// Change the Audio.prototype.play function.
	UTILITYFUNCTIONS.adjustAudioPlayPrototype();

	// Load sound files.
	UTILITYFUNCTIONS.loadSoundFiles();

	// Handle window blur/focus.
	window.addEventListener('focus', function() { PAGEVISIBLE = true;  }, false );
	window.addEventListener('blur' , function() { PAGEVISIBLE = false; }, false );

	// Trigger the audio test. (silent mp3 file and volume 0.)
	let audio = document.createElement("audio");
	audio.src="data:audio/mpeg;base64,/+MQxAAHUjnwAABHif+8AEY/5LA8YxuQ3G4x5FoTu4AhbvEJPRAiTgBmlf+T+sQqkTP4+f/jEsQJB+H2CAAAR4HfeOzEatSORAYLGQYcKQypcLcFB0DCtfys/jn+2yjhiTpEUUjULlVU/+MQxBEHWc4MAABHhQgkdJEQJCEtr6Vl9Ir/9GpGu3sQqHD9XVidC6VWZhcgKleSkaHf1P/jEMQaCFpaBAAAR4AHGxy+rApSdcoZQ8q+VCPhMmNSal5RqTU1/hqCJjUm1JYKCoKCkUL/4xDEHwgKPdQAAEeFqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
	audio.volume=0;
	audio.play();

	// Give the audio a moment to play and trigger a change on AUDIOCANPLAY and then continue.
	setTimeout(function(){
		// If the audio is ready then start the game.
		if(AUDIOCANPLAY){ main(); }

		// Otherwise, inform the user that they must click on the page.
		else{ UTILITYFUNCTIONS.addUserInteractionRestriction(); }
	}, 250);

};

function init(){
	// DEBUG - Setup the mousemove listener for hovering over the canvas.
	if(!showCanvasCursorCoords_ON){
		CANVAS.addEventListener('mousemove', function(evt){
			let mouseCoordsDiv = DOM.mouseCoordsDiv;

			function getMousePos(canvas, evt) {
				let rect = canvas.getBoundingClientRect();
				return {
					x: Math.floor(evt.clientX - rect.left),
					y: Math.floor(evt.clientY - rect.top )
				};
			}

			let mousePos = getMousePos(CANVAS, evt);
			let message = '(x:' + mousePos.x + ', y:' + mousePos.y + ')';
			mouseCoordsDiv.innerText = message;
		}, false);
		showCanvasCursorCoords_ON=true;
	}

	// Blank out whatever is in the game element arrays.
	PLAYERS 		= [];
	PROJECTILES 	= [];
	ALIENSHIPS		= [];
	ALIENINVADERS	= [];

	// Create Player 1.
	let newPlayer = {
		"pos"		: { "x" : WIDTH/4 - PLAYERSIZE_SMALL.W, "y" : HEIGHT - PLAYERSIZE_SMALL.H },
		"size"		: { "w" : PLAYERSIZE_SMALL.W, "h" : PLAYERSIZE_SMALL.H },
		"control"	: "H",
		"color"		: "red",
		"playernum"	: 1
	};
	UTILITYFUNCTIONS.addPlayer(newPlayer);

	// Create Player 2.
	// newPlayer = {
		// "pos"		: { "x" : WIDTH-WIDTH/4 - PLAYERSIZE_SMALL.W, "y" : HEIGHT - PLAYERSIZE_SMALL.H },
	// 	"size"		: { "w" : PLAYERSIZE_SMALL.W, "h" : PLAYERSIZE_SMALL.H },
	// 	"control"	: "H",
	// 	"color"		: "green",
	// 	"playernum"	: 2
	// };
	// UTILITYFUNCTIONS.addPlayer(newPlayer);

	// Create a random Alien Ship.
	UTILITYFUNCTIONS.addRandomAlienShip();

	// Create a grid of Alien Invaders.
	UTILITYFUNCTIONS.createAlienInvadersGrid();

	// Generate the static starfield.
	STARS.generateStarBackground1();
	STARS.generateStarBackground2();
}

function main(){
	// Perform game element initialization.
	init();

	// Game loop!
	let updateGameDisplay = function() {
		// If NOT paused then request an animation frame and repeat the set Timeout.
		if(!PAUSED && PAGEVISIBLE){
			// Remove expired shots.
			PROJECTILES   = PROJECTILES.filter  ( function (value) { return ! value.removeThis; } );

			// Remove expired Alien Ships.
			ALIENSHIPS    = ALIENSHIPS.filter   ( function (value) { return ! value.removeThis; } );

			// Remove expired Alien Invaders.
			ALIENINVADERS = ALIENINVADERS.filter( function (value) { return ! value.removeThis; } );

			// Remove expired players.
			//

			// Update positions.
			updatePositions();

			// Redraw the screen with the position updates.
			drawFrame();

			// Update the debug data.
			if(DOM.chk_debug.checked){ window.requestAnimationFrame(DEBUG.updateDebugData); }
			else { DOM.debug_details.innerHTML = "Debug is off"; }

			// window.requestAnimationFrame(updateGameDisplay);
			// setTimeout(updateGameDisplay, 1000 / FPS);
			STO_ID = setTimeout(function(){ RAF_ID = window.requestAnimationFrame(updateGameDisplay); }, 1000 / FPS);
		}
		else {

			// window.requestAnimationFrame(updateGameDisplay);
			// setTimeout(updateGameDisplay, 1000 / FPS);
			STO_ID = setTimeout(function(){ RAF_ID = window.requestAnimationFrame(updateGameDisplay); }, 1000 / FPS);
		}
	};

	// Activate the initial game loop.
	updateGameDisplay();
}

function updatePositions(){
	// let now = performance.now();

	// Update PLAYER positions.
	for(let i=0; i<PLAYERS.length; i++){
		PLAYERS[i].updatePosition();
	}

	// Update PROJECTILE positions
	for(let i=0; i<PROJECTILES.length; i++){
		PROJECTILES[i].updatePosition();
	}

	// Update ALIEN SHIP positions
	for(let i=0; i<ALIENSHIPS.length; i++){
		ALIENSHIPS[i].updatePosition();
	}
	// Handle enemies firing.
	UTILITYFUNCTIONS.enemyFires();

	// Update ALIEN INVADER positions
	UTILITYFUNCTIONS.moveAlienInvader_grid();

}

function drawFrame(){
	// Erase the canvas frame.
	CONTEXT.fillStyle = "black";
	CONTEXT.fillRect(0, 0, WIDTH, HEIGHT);

	// Draw background stars.
	if     (STARS.flag_useStarBackground1){ STARS.drawStarBackground1(); }
	else if(STARS.flag_useStarBackground2){ STARS.drawStarBackground2(); }

	// Draw the line where you lose if the Alien Invaders reach it.
	// Line 1
	CONTEXT.beginPath();
	CONTEXT.moveTo( 0, HEIGHT-35 ); CONTEXT.lineTo( WIDTH, HEIGHT-35);
	CONTEXT.closePath();
	CONTEXT.strokeStyle = 'blue'; CONTEXT.lineWidth = 2; CONTEXT.stroke();

	// Line2
	CONTEXT.beginPath();
	CONTEXT.moveTo( 0, HEIGHT-40 ); CONTEXT.lineTo( WIDTH, HEIGHT-40 );
	CONTEXT.closePath();
	CONTEXT.strokeStyle = 'gray'; CONTEXT.lineWidth = 2; CONTEXT.stroke();

	// Line3
	CONTEXT.beginPath();
	CONTEXT.moveTo( 0, BOTTOM_ENDGAME ); CONTEXT.lineTo( WIDTH, BOTTOM_ENDGAME);
	CONTEXT.closePath();
	CONTEXT.strokeStyle = 'yellow'; CONTEXT.lineWidth = 1; CONTEXT.stroke();

	// Draw the players
	for(let i=0; i<PLAYERS.length; i++){
		PLAYERS[i].draw();
	}

	// Draw all ALIENSHIPS from within the ALIENSHIPS array. MULTI-ALIENSHIPS!
	for(let i=0; i<ALIENSHIPS.length; i++){
		ALIENSHIPS[i].draw();
	}

	// Draw all ALIENINVADERS from within the ALIENINVADERS array. MULTI-ALIENINVADERS!
	UTILITYFUNCTIONS.drawAlienInvader_grid();

	// Draw all PROJECTILES from within the PROJECTILES array. MULTI-PROJECTILE!
	for(let i=0; i<PROJECTILES.length; i++){
		PROJECTILES[i].draw();
	}

	//
	// Display the scores.
	if(PLAYERS[0]){ DOM.p1Score.innerHTML = "P1: "+PLAYERS[0].score; }
	if(PLAYERS[1]){ DOM.p2Score.innerHTML = "P2: "+PLAYERS[1].score; }

	// Display the accuracies.
	if(PLAYERS[0]){ DOM.p1Accurracy.innerHTML = "SHOTS: "+PLAYERS[0].shotsMade+"/"+PLAYERS[0].shotsFired+" ("+PLAYERS[0].accuracy+")"; }
	if(PLAYERS[1]){ DOM.p2Accurracy.innerHTML = "SHOTS: "+PLAYERS[1].shotsMade+"/"+PLAYERS[1].shotsFired+" ("+PLAYERS[1].accuracy+")"; }

	// Draw from the non-DOM-attached canvas to the real canvas.
	CONTEXT_post.drawImage(CANVAS, 0, 0);
}


// PROTOTYPES

function Player(x, y, width, height, control, color, playernum) {
	// console.log("New player created with values: ", x, y, width, height, control, color, playernum);
	this.x          = x;
	this.y          = y;
	this.width      = width;
	this.height     = height;
	this.pos        = { "x" : this.x, "y" : this.y };
	this.size       = { "w" : this.width, "h" : this.height };
	this.control    = control; // Can be 'H' or 'C'.
	this.color      = color;
	this.playernum  = playernum; // Accepts '1' or '2'
	this.score      = 0;
	this.shotsFired = 0;
	this.shotsMade  = 0;
	this.accuracy   = "0%";
	this.timesHit   = 0;

	this.fire = function(){
		UTILITYFUNCTIONS.player_FIRE(this);
	};

	this.updateAccuracy = function(){
		if(this.shotsMade && this.shotsFired){
			this.accuracy = (this.shotsMade / this.shotsFired) * 100;
			this.accuracy = parseInt(this.accuracy, 10).toFixed(1) + "%";
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
		// Draw the player's background.
		// CONTEXT.fillStyle = this.color;
		// CONTEXT.fillRect(this.x, this.y, this.width, this.height);

		let coords=spriteSheet.players.P1.frame1;
		CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.x, this.y,this.width,this.height);
		// return;
	};
}

function Projectile(pos, size, velocityy, color, origin){
	// console.log("New projectile created with values: ", pos, size, velocityy, color, origin);
	this.pos        = pos      ; // Position of projectile ( {"x":"", "y":""}
	this.size       = size     ; // Dimensions of projectile ( {"w":"", "h":""}
	this.velocityy  = velocityy; // The speed and direction of the projectile.
	this.color      = color    ; // CSS
	this.origin     = origin   ; // Could be "P1", "P2", "AI", "AS"
	this.removeThis = false    ;

	this.ALBB_CollisionCheck = function(target, projectile){
		// Check for overlap.
		let ax = target.pos.x;      let ay = target.pos.y;
		let aw = target.size.w;     let ah = target.size.h;
		let bx = projectile.pos.x;  let by = projectile.pos.y;
		let bw = projectile.size.w; let bh = projectile.size.h;

		// Axis Aligned Bounding Boxes (AABB). (Is a box overlapping another box?)
		// https://www.youtube.com/watch?v=ghqD3e37R7E
		return (
			ax < bx + bw && // Right edge of A is left edge of B
			ay < by + bh && // Bottom edge of A is above top edge of B
			bx < ax + aw && // Right edge of B is left edge of A
			by < ay + ah	// Bottom edge of B is above top edge of A
		);
	};

	// For Alien Ship and Invader to Player collisions.
	this.ALBB_CollisionCheck2 = function(target, projectile){
		// Check for overlap.
		let ax = target.x;          let ay = target.y;
		let aw = target.width;      let ah = target.height;
		let bx = projectile.pos.x;  let by = projectile.pos.y;
		let bw = projectile.size.w; let bh = projectile.size.h;

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
		let whichAS = false;
		let collision = false;
		for(let i=0; i<ALIENSHIPS.length; i++){
			if ( this.ALBB_CollisionCheck( ALIENSHIPS[i], this) )	{
				whichAS = i;
				collision = true;

				// console.log(
				// 	"Alien Ship #", i, "has been hit by projectile fired by", this.origin, "\n",
				// 	"Alien Ship:", ALIENSHIPS[i].pos, "\nProjectile:", this.pos, "\n",
				// 	"check: ", this.ALBB_CollisionCheck( ALIENSHIPS[i], this)
				// );

				break;
			}
		}

		if(collision){
			// Score points, update player stats.
			PLAYERS[player].shotsMade++ ;

			// Update the accuracy data.
			PLAYERS[player].updateAccuracy();

			// Update the player score.
			let newPoints = ALIENSHIPS[whichAS].awardPoints() ;
			// console.log("Player", player+1, "has scored", newPoints.toString().padStart(3, " "), "points by hitting an Alien Ship");
			PLAYERS[player].score += newPoints;

			// Remove Alien Ship
			ALIENSHIPS[whichAS].removeThis=true;

			// Remove projectile
			this.removeThis=true;

			UTILITYFUNCTIONS.playSound('alien_ship_hit');
		}
	};

	// Collision check: Alien Ship or Invader shoots Player.
	// FIX !!!
	this.alienShipShootsPlayer = function(){
		// Get list of Players and compare to see if this projectile overlaps one.
		let whichPlayer = false;
		let collision = false;
		for(let i=0; i<PLAYERS.length; i++){
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

			UTILITYFUNCTIONS.playSound('player_hit');
		}
	};

	// Collision check: Player shoots Alien Invader.
	this.playerShootsAlienInvader = function(player){
		// Get list of Alien Invaders and compare to see if this projectile overlaps one.
		let whichAI = false;
		let collision = false;
		for(let i=0; i<ALIENINVADERS.length; i++){
			if ( this.ALBB_CollisionCheck( ALIENINVADERS[i], this) )	{
				whichAI = i;
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
			let newPoints = ALIENINVADERS[whichAI].awardPoints() ;
			// console.log("Player", player+1, "has scored", newPoints.toString().padStart(3, " "), "points by hitting an Alien Invader");
			PLAYERS[player].score += newPoints;

			// Remove Alien Invader
			ALIENINVADERS[whichAI].removeThis=true;
			// ALIENINVADERS[whichAI].hidden=true;

			// Remove projectile
			this.removeThis=true;

			UTILITYFUNCTIONS.playSound('alien_invader_hit');
		}

	};

	// Collision check: Alien Invader shoots Player.
	// this.alienInvaderShootsPlayer = function(){
	// 	UTILITYFUNCTIONS.playSound('player_hit');
	// };

	this.updatePosition = function(){
		// ** Handle projectile movements
		// Who fired this shot? Player1? Player2?
		this.pos.x = Math.floor(this.pos.x);
		this.pos.y = Math.floor(this.pos.y);

		if(this.origin == "P1" || this.origin == "P2"){
			// Which index in the PLAYERS array is this?
			let player;
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
			}
			else{
				// ** Move the projectile DOWN.
				this.pos.y-=this.velocityy;
			}

			// ** Handle projectile collisions.
			// Collision check: Alien Invader shoots Player.
			// this.alienInvaderShootsPlayer();

			// Collision check: Alien Ship shoots Player.
			this.alienShipShootsPlayer();
		}
	};

	this.draw = function(){
		let coords=spriteSheet.misc.shot1.frame1;
		// console.log("ship", ship, ship.data);

		// Draw background of the projectile.
		// CONTEXT.fillStyle = this.color;
		// CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		// Draw the projectile.
		CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.pos.x, this.pos.y,this.size.w,this.size.h);

		return;
		// // Draw the projectile body.
		// CONTEXT.fillStyle = this.color;
		// CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		// // first save the untranslated/unrotated context
		// CONTEXT.save();

		// // move the rotation point to the center of the rect
		// // CONTEXT.translate(this.pos.x, this.pos.y);

		// // Could be "P1", "P2", "AI", "AS"
		// if(this.origin == "AI" || this.origin == "AS"){
		// 	// console.log("enemy projectile!", this.pos.x+this.size.w/2, this.pos.y+this.size.w/2, this.size.w*1.5 , 0, 2*Math.PI);
		// 	// CONTEXT.rotate(180*Math.PI/180);
		// 	let X= this.pos.x + this.size.w/2;
		// 	let Y= this.pos.y + this.size.h;
		// }
		// if(this.origin == "P1" || this.origin == "P2"){
		// 	// console.log("player projectile!", this.pos.x+this.size.w/2, this.pos.y+this.size.w/2, this.size.w*1.5 , 0, 2*Math.PI);
		// 	// CONTEXT.rotate(0*Math.PI/180);
		// 	let X= this.pos.x + this.size.w/2;
		// 	let Y= this.pos.y ;//- this.size.h/2;
		// }

		// // Draw the business end of the projectile.
		// CONTEXT.beginPath();
		// 	CONTEXT.arc(X, Y, this.size.w*1.5 , 0, 2*Math.PI);
		// CONTEXT.closePath();
		// 	CONTEXT.strokeStyle = this.color;
		// 	CONTEXT.fillStyle = '#F00';
		// 	CONTEXT.fill();
		// 	CONTEXT.stroke();

		// // restore the context to its untranslated/unrotated state
		// CONTEXT.restore();



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

		let x = this.pos.x + this.size.w / 2;
		let y = this.pos.y + this.size.h ;

		let newProjectile = {
			"pos"		: { "x" : x, "y" : y },
			"size"		: { "w" : 15, "h" : 20 },
			"velocityy"	: -5,
			"color" 	: 'green',
			"origin"	: "AS"
		};

		UTILITYFUNCTIONS.addProjectile(newProjectile);
	};

	this.awardPoints = function(){
		// Determine number of points awarded for a successful hit!
		switch (this.type) {
			case 0:	this.points = 200;	break;
			case 1:	this.points = 200;	break;
			case 2:	this.points = 200;	break;
			case 3:	this.points = 200;	break;
			case 4:	this.points = 200;	break;
			case 5:	this.points = 200;	break;
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
		if      (this.pos.x <= 0               ) { this.velocityx *=-1; }
		else if (this.pos.x > WIDTH-this.size.w) { this.velocityx *=-1; }

		// Move the Alien Ship on the X axis.
		this.pos.x += this.velocityx;

		// Bounce.
		// if     (this.jumpingY == 0){ this.pos.y += -1; }
		// else if(this.jumpingY == 1){ this.pos.y +=  1; }
		// this.jumpingY = ! this.jumpingY ;

		// Make sure that the new x and y are valid and the Alien Ship cannot go out of bounds.
		this.pos.x = Math.max(0, Math.min(this.pos.x, WIDTH));
	};

	this.draw = function(){
		// Colored rectangle
		// CONTEXT.fillStyle = this.color;
		// CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		let coords=spriteSheet.alienShips.ship1.frame1;
		// CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.pos.x, this.pos.y, this.size.w, this.size.h);
		CONTEXT.drawImage(ship,coords.x,coords.y,coords.w,coords.h, this.pos.x, this.pos.y, this.size.w, this.size.h);
	};
}

function AlienInvader(pos, size, velocityx, color, type){
	// console.log("New Alien Invader created with values: ", pos, size, velocityx, color, type);
	this.pos              = pos       ; // Position of Alien Invader ( {"x":"", "y":""}
	this.size             = size      ; // Dimensions of Alien Invader ( {"w":"", "h":""}
	this.velocityx        = velocityx ; // Has X velocity.
	this.color            = color     ; // Has color.
	this.type             = type      ; // Has type. // Type (0-4);
	this.removeThis       = false     ;
	this.shotsFired       = 0         ;
	this.jumpingY         = 0         ;
	this.hidden           = false     ; // Hidden happens when this Alien Invader is not visible... hard mode!!
	this.framenum         = "frame1"  ; //
	this.frameslatency    = 0;
	this.frameslatencymax = 5;

	this.fire = function(){
		// An Alien Invader has fired a shot! Configure a new projectile!
		this.shotsFired ++;

		let x = this.pos.x + this.size.w / 2;
		let y = this.pos.y + this.size.h;
		let newProjectile = {
			"pos"		: { "x" : x , "y" : y },
			"size"		: { "w" : 15, "h" : 20 }, // 15 , 20
			"velocityy"	: -5,
			"color" 	: 'darkgoldenrod',
			"origin"	: "AI"
		};

		UTILITYFUNCTIONS.addProjectile(newProjectile);
	};

	this.awardPoints = function(){
		// Determine number of points awarded for a successful hit!
		switch (this.type) {
			case 0:	this.points = 30;	break; // 30
			case 1:	this.points = 25;	break; // 25
			case 2:	this.points = 20;	break; // 20
			case 3:	this.points = 15;	break; // 15
			case 4:	this.points = 10;	break; // 10
			case 5:	this.points = 5;	break; // 5
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
		// this.pos.x = Math.ceil(this.pos.x);
		// this.pos.y = Math.ceil(this.pos.y);

		let coords;

		switch(this.type){
			case 0 : { coords=spriteSheet.alienInvaders.type00[this.framenum]; break; }
			case 1 : { coords=spriteSheet.alienInvaders.type01[this.framenum]; break; }
			case 2 : { coords=spriteSheet.alienInvaders.type02[this.framenum]; break; }
			case 3 : { coords=spriteSheet.alienInvaders.type03[this.framenum]; break; }
			case 4 : { coords=spriteSheet.alienInvaders.type04[this.framenum]; break; }
			case 5 : { coords=spriteSheet.alienInvaders.type05[this.framenum]; break; }
			// case 6 : { coords=spriteSheet.alienInvaders.type06[this.framenum]; break; }
			// case 7 : { coords=spriteSheet.alienInvaders.type07[this.framenum]; break; }
			// case 8 : { coords=spriteSheet.alienInvaders.type08[this.framenum]; break; }
			// case 9 : { coords=spriteSheet.alienInvaders.type09[this.framenum]; break; }
			default : { return; break; }
		}

		// Draw background of invader.
		// CONTEXT.fillStyle = this.color;
		// CONTEXT.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		// Draw invader.
		CONTEXT.drawImage(
			ship,
			coords.x,
			coords.y,
			coords.w,
			coords.h,
			this.pos.x,
			this.pos.y,
			this.size.w,
			this.size.h
		);

	};
}

