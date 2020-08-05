"use strict";

// For DEBUG.
let DEBUG = {
	//
	DOM : {
	},
	//
	populateDebugDOM : function(){
		// DEBUG
		DEBUG.DOM.currentFPS     = document.getElementById("currentFPS")     ;
		DEBUG.DOM.fps_select     = document.getElementById("fps_select")     ;
		DEBUG.DOM.chk_debug      = document.getElementById('chk_debug')      ;
		DEBUG.DOM.mouseCoordsDiv = document.getElementById("mouseCoordsDiv") ;
		DEBUG.DOM.debug_output1  = document.getElementById('debug_output1')  ;
		DEBUG.DOM.debug_output2  = document.getElementById('debug_output2')  ;
	},

	//
	showCanvasCursorCoords    : true,
	getCanvasMousePosition    : function(evt){
		if(!DEBUG.DOM.chk_debug.checked){ return; }

		let mouseCoordsDiv = DEBUG.DOM.mouseCoordsDiv;

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
	drawAllGraphics           : function(){
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
	drawPreCanvasToPostCanvas : function(){
		DOM.mainCanvas_ctx.drawImage(DOM.preMainCanvas, 0, 0);
	},

	// Adjust the FPS.
	adjustFPS                 : function(dir, newFPS=30){
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
		if(dir!=0){ DEBUG.DOM.fps_select.value=""; }
		DEBUG.DOM.currentFPS.innerText="FPS: " + GAMEVARS.fps + " ("+GAMEVARS.msPerFrame.toFixed(2)+" ms)";
	},

	//
	updateDebugData           : function(){
		// Table generators.
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

				cell_th.style["vertical-align"] = "top";

				// Dividers should be all black.
				if(d==" ")      {
					row.style["background-color"]="black";
					row.style["color"]="black";
					row.style["font-size"]="2px";

					// cell_th.style["background-color"]="black";
					// cell_th.style["color"]="black";
					// cell_th.style["font-size"]="2px";
					// cell_td.style["background-color"]="black";
					// cell_td.style["color"]="black";
					// cell_td.style["font-size"]="2px";

					cell_th.innerText = "-";
					cell_td.innerText = "-";
				}
				else{
					cell_th.innerText = d;
					cell_td.innerText = data[d];
				}

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
		// Data generators for the table generators.
		let shots             = function(){
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
		let players           = function(){
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
					"p"           : d.playernum   ,
					"origin"      : d.origin      ,
					"shots"       : d.shots       ,
					"hits"        : d.hits        ,
					"acc"         : d.accuracy    ,
					"score"       : d.score       ,
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
				"p"           ,
				"shots"       ,
				"hits"        ,
				"acc"         ,
				"score"       ,
			];

			let table3 = createTable_type2( headers, data["P1"], "Player (P1) ("+data["P1"].length+")", 275 );
			let table4 = createTable_type2( headers, data["P2"], "Player (P2) ("+data["P2"].length+")", 275 );

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
		let invaders          = function(){
			let dims = {
				"w": IMGCACHE["invader1"][0].width  ,
				"h": IMGCACHE["invader1"][0].height ,
				"spacing_x"  : GAMEVARS.invader_spacing_x  ,
				"spacing_y"  : GAMEVARS.invader_spacing_y  ,
				"shot_vely" : GAMEVARS.invader_shot_vely ,
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
					"shots"    : d.shots ,
					"dir"      : dir          ,
					"f"        : frame        ,
					"x"        : x            ,
					"y"        : y            ,
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
		let ships             = function(){
			let dims = {
				"w": IMGCACHE["ship"][0].width  ,
				"h": IMGCACHE["ship"][0].height ,
				"spacing_x"  : GAMEVARS.invader_spacing_x  ,
				"spacing_y"  : GAMEVARS.invader_spacing_y  ,
				"shot_vely" : GAMEVARS.invader_shot_vely ,
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
					"shots"    : d.shots ,
					"dir"      : dir          ,
					"f"        : frame        ,
					"x"        : x            ,
					"y"        : y            ,
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
				"dead",
				"fnum",
			];

			let data = GAMEVARS.SHIPS.map(mapFunction);

			let table1 = createTable_type2( headers, data, "Ships", 275 );

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			table1.classList.add("debugTable1");
			// table2.classList.add("debugTable1");
			div.appendChild(table1);
			// div.appendChild(table2);

			// Return the table.
			return {
				"div" : div ,
			};
		};
		// ERROR HERE (no dims.fmax)
		let barriers          = function(){
			let dims = {
				"w": IMGCACHE["barrier"][0].width  ,
				"h": IMGCACHE["barrier"][0].height ,
			};

			let mapFunction = function(d,i,a){
				// let dir = (Math.sign(d.dir) == 1 ? 'R' : 'L') ;
				let dir = d.dir;
				let frame = d.frameslatency + "/" + dims.fmax;
				let x = d.x;
				let y = d.y;

				return {
					"i"        : i            ,
					"x"        : x            ,
					"y"        : y            ,
					"type"     : d.type       ,
				};
			};

			let headers = [
				"i"    ,
				"x"    ,
				"y"    ,
				"type" ,
			];

			let data = GAMEVARS.BARRIERS.map(mapFunction);

			let table1 = createTable_type2( headers, data, "Barriers", 275 );

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			table1.classList.add("debugTable1");
			div.appendChild(table1);

			// Return the table.
			return {
				"div" : div ,
			};
		};
		let info              = function(){
			let sharedWidth=135;

			let table1 = createTable_type1(
				[
					"raf_id"                  ,
					// "last_raf_tstamp"         ,
					"paused"                  ,
					"pausedOnMenu"            ,
					"pagevisible"             ,
					"audiocanplay"            ,
					"fps"                     ,
					"msPerFrame"              ,
					"gamestate_main"          ,
					"gamestate_sub1"          ,
				],
				{
					"raf_id"                  : GAMEVARS.raf_id                           ,
					// "last_raf_tstamp"         : GAMEVARS.last_raf_tstamp                  ,
					"paused"                  : GAMEVARS.paused                           ,
					"pausedOnMenu"            : GAMEVARS.pausedOnMenu                     ,
					"pagevisible"             : GAMEVARS.pagevisible                      ,
					"audiocanplay"            : GAMEVARS.audiocanplay                     ,
					"fps"                     : GAMEVARS.fps                              ,
					"msPerFrame"              : GAMEVARS.msPerFrame.toFixed(2)            ,
					"gamestate_main"          : GAMEVARS.gamestate_main                   ,
					"gamestate_sub1"          : GAMEVARS.gamestate_sub1                   ,
				},
				"GAMEVARS (VARS)",
				sharedWidth
			);

			let table2 = createTable_type1(
				[
					"lastFire"       ,
					"nextFire"       ,
					"minWait"        ,
					"maxWait"        ,
					"maxProjectiles" ,
				],
				{
					"lastFire"       : GAMEVARS.invader_fire_info.lastFire       ,
					"nextFire"       : GAMEVARS.invader_fire_info.nextFire       ,
					"minWait"        : GAMEVARS.invader_fire_info.minWait        ,
					"maxWait"        : GAMEVARS.invader_fire_info.maxWait        ,
					"maxProjectiles" : GAMEVARS.invader_fire_info.maxProjectiles ,
				},
				"invader_fire_info",
				sharedWidth
			);

			let table3 = createTable_type1(
				[
					"lastFire"          ,
					"nextFire"          ,
					"minWait"           ,
					"maxWait"           ,
					"maxProjectiles"    ,
				],
				{
					"lastFire"          : GAMEVARS.ship_fire_info.lastFire          ,
					"nextFire"          : GAMEVARS.ship_fire_info.nextFire          ,
					"minWait"           : GAMEVARS.ship_fire_info.minWait           ,
					"maxWait"           : GAMEVARS.ship_fire_info.maxWait           ,
					"maxProjectiles"    : GAMEVARS.ship_fire_info.maxProjectiles    ,
				},
				"ship_fire_info",
				sharedWidth
			);

			let table4 = createTable_type1(
				[
					"invader_velx"     ,
					"invader_vely"     ,
					"invader_spacing_x",
					"invader_spacing_y",
					"invader_shot_vely",
					"invader_fmax"     ,
					"ship_velx"        ,
					"ship_shot_vely"   ,
					"player_xvel"      ,
					"player_shot_vely" ,
					"gameover_bottom"  ,
					"barrier_top"      ,
					"maxShots_PLAYERS" ,
				],
				{
					"invader_velx"      : GAMEVARS.invader_velx      ,
					"invader_vely"      : GAMEVARS.invader_vely      ,
					"invader_spacing_x" : GAMEVARS.invader_spacing_x ,
					"invader_spacing_y" : GAMEVARS.invader_spacing_y ,
					"invader_shot_vely" : GAMEVARS.invader_shot_vely ,
					"invader_fmax"      : GAMEVARS.invader_fmax      ,
					"ship_velx"         : GAMEVARS.ship_velx         ,
					"ship_shot_vely"    : GAMEVARS.ship_shot_vely    ,
					"player_xvel"       : GAMEVARS.player_xvel       ,
					"player_shot_vely"  : GAMEVARS.player_shot_vely  ,
					"gameover_bottom"   : GAMEVARS.gameover_bottom   ,
					"barrier_top"       : GAMEVARS.barrier_top       ,
					"maxShots_PLAYERS"  : GAMEVARS.maxShots_PLAYERS  ,
				},
				"GAMEVARS (CONSTS)",
				sharedWidth
			);

			let table5 = createTable_type1(
				[
					"P1" ,
					"P2" ,
					"AI" ,
					"AS" ,
				],
				{
					"P1" : GAMEVARS.shotCounts["P1"]      ,
					"P2" : GAMEVARS.shotCounts["P2"]      ,
					"AI" : GAMEVARS.shotCounts["AI"]      ,
					"AS" : GAMEVARS.shotCounts["AS"]      ,
				},
				"SHOT COUNTS",
				sharedWidth
			);


			// for(let key in GAMEVARS){
			// 	if(["object", "function"].indexOf( typeof GAMEVARS[key] ) == -1) {
			// 		console.log(key.padEnd(20, " "), "", typeof GAMEVARS[key]);
			// 	}
			// }

			table1.classList.add("debugTable1");
			table2.classList.add("debugTable1");
			table3.classList.add("debugTable1");
			table4.classList.add("debugTable1");
			table5.classList.add("debugTable1");

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			div.appendChild(table2);
			div.appendChild(table3);
			div.appendChild(table5);
			div.appendChild(table1);
			div.appendChild( document.createElement("br") );
			div.appendChild(table4);

			// Return the table.
			return { "div" : div };

		};

		let hits        = function(){
			// GAMEVARS.HITS

			let mapFunction = function(d,i,a){
				// let dir = (Math.sign(d.dir) == 1 ? 'R' : 'L') ;
				let x           = d.x;
				let y           = d.y;
				let hitType = d.hitType;
				let w           = IMGCACHE[d.hitType][0].width ;
				let h           = IMGCACHE[d.hitType][0].height ;
				let rep         = d.animationRepeat + "/" + d.animationRepeatsMax;
				let lat         = d.frameslatency + "/" + d.framesLatencyMax;
				let frame       = d.framenum;

				return {
					"i"           : i            ,
					"x"           : x            ,
					"y"           : y            ,
					"type"        : hitType  ,
					"w"           : w            ,
					"h"           : h            ,
					"rep"         : rep        ,
					"frame"       : frame        ,
					"lat"         : lat          ,
					"removeThis"  : d.removeThis ,
				};
			};

			let headers = [
				"i"           ,
				"x"           ,
				"y"           ,
				"type"        ,
				"w"           ,
				"h"           ,
				"rep"         ,
				"frame"       ,
				"lat"         ,
				"removeThis"  ,
			];

			let data = GAMEVARS.HITS.map(mapFunction);

			let table1 = createTable_type2( headers, data, "HITS", 275 );

			let div = document.createElement("div");
			div.classList.add("debugDiv_container");
			table1.classList.add("debugTable1");
			div.appendChild(table1);

			// Return the table.
			return {
				"div" : div ,
			};

		};

		let html_shots    = shots();
		let html_players  = players();
		let html_ships    = ships();
		let html_invaders = invaders();
		let html_info     = info();
		let html_barriers = barriers();
		let html_hits     = hits();

		DEBUG.DOM.debug_output1.innerHTML="";
		DEBUG.DOM.debug_output2.innerHTML="";

		DEBUG.DOM.debug_output1.appendChild(html_players.div);
		DEBUG.DOM.debug_output1.appendChild(html_invaders.div);
		DEBUG.DOM.debug_output1.appendChild(html_ships.div);
		DEBUG.DOM.debug_output1.appendChild(html_barriers.div);
		DEBUG.DOM.debug_output1.appendChild(html_hits.div);
		DEBUG.DOM.debug_output1.appendChild(html_shots.div);

		DEBUG.DOM.debug_output2.appendChild(html_info.div);
	},

	//
	lowerInvaders             : function(){
		// let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		for(let invader of GAMEVARS.INVADERS){
			if(invader.removeThis){ continue; }
			invader.y += Math.ceil(h/2);
		}
	},

	//
	raiseInvaders             : function(){
		// let w = IMGCACHE["invader1"][0].width  ;
		let h = IMGCACHE["invader1"][0].height ;
		for(let invader of GAMEVARS.INVADERS){
			if(invader.removeThis){ continue; }
			invader.y -= Math.ceil(h/2);
		}
	},

	//
	removeFirstInvader        : function(){
		for(let i=0; i<GAMEVARS.INVADERS.length; i+=1){
			let invader = GAMEVARS.INVADERS[i];
			if(invader.removeThis){ continue; }

			// Create new hit.
			let img = IMGCACHE[invader.imgCacheKey][invader.framenum];

			// Add the new hit into the game.
			GAMEVARS.HITS.push(
				new Hit(
					invader.x           , // "x"
					invader.y           , // "y"
					img.width           , // "w"
					img.height          , // "h"
					invader.hitType  // "hitType"
				)
			);

			// Set the invader to be removed.
			// invader.removeThis=true;
			invader.resetForRemoval();

			break;
		}
	},

	//
	removeLastInvader         : function(){
		for(let i=GAMEVARS.INVADERS.length-1; i>=0; i-=1){
			let invader = GAMEVARS.INVADERS[i];
			if(invader.removeThis){ continue; }

			// Create new hit.
			let img = IMGCACHE[invader.imgCacheKey][invader.framenum];

			// Add the new hit into the game.
			GAMEVARS.HITS.push(
				new Hit(
					invader.x           , // "x"
					invader.y           , // "y"
					img.width           , // "w"
					img.height          , // "h"
					invader.hitType  // "hitType"
				)
			);

			// Set the invader to be removed.
			// invader.removeThis=true;
			invader.resetForRemoval();

			break;
		}
	},

};