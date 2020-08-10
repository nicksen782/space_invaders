	<!-- DEBUG DISPLAY -->
	<div id="debugDiv" class="borderRadius1">
		<div class="debugDivSection borderRadius1">
			<table class="debugTable1">
				<caption>INFO</caption>
				<tr> <th>Coords: mainGameCanvas</th> <td><span id="mouseCoordsDiv"     ></span></td> </tr>
				<tr> <th>Coords: p1_js:</th>         <td><span id="mouseCoords_p1_js"  ></span></td> </tr>
				<tr> <th>Coords: p2_js:</th>         <td><span id="mouseCoords_p2_js"  ></span></td> </tr>
				<tr> <th>Coords: p1_fire:</th>       <td><span id="mouseCoords_p1_fire"></span></td> </tr>
				<tr> <th>Coords: p2_fire:</th>       <td><span id="mouseCoords_p2_fire"></span></td> </tr>
				<tr> <th>SetFPS:</th>                <td><span id="currentFPS"         ></span></td> </tr>
				<tr> <th>intervalDebug:</th>         <td><span id="currentIntervalDebug"></span></td> </tr>
			</table>

			<br>

			<input class="debugButton1" type="button" onclick="FUNCS.pause();" value="FUNCS.pause();">
			<input class="debugButton1" type="button" onclick="FUNCS.startGameFromBeginning();" value="RESET">
			<input class="debugButton1" type="button" onclick="FUNCS.demoEntities();" value="DEMO ENTITIES">
			<br>

			<input class="debugButton1" type="button" onclick="DEBUG.lowerInvaders();" value="LOWER INVADERS">
			<input class="debugButton1" type="button" onclick="DEBUG.raiseInvaders();" value="RAISE INVADERS">
			<input class="debugButton1" type="button" onclick="DEBUG.removeFirstInvader();" value="removeFirstInvader">
			<input class="debugButton1" type="button" onclick="DEBUG.removeLastInvader();" value="removeLastInvader">
			<br>

			<input class="debugButton1" type="button" onclick="GAMEVARS.gameover_bottom-=1;" value="gameover_bottom -=1">
			<input class="debugButton1" type="button" onclick="GAMEVARS.gameover_bottom+=1;" value="gameover_bottom +=1">
			<input class="debugButton1" type="button" onclick="GAMEVARS.barrier_top-=1;" value="barrier_top -=1">
			<input class="debugButton1" type="button" onclick="GAMEVARS.barrier_top+=1;" value="barrier_top +=1">
			<br>

			<!-- <input class="debugButton1" type="button" onclick="FUNCS.invaderShoot_random();" value="INVADER RANDOM SHOOT"> -->
			<!-- <input class="debugButton1" type="button" onclick="FUNCS.addPlayer(1);"                                     value="FUNCS.addPlayer(1);"> -->
			<!-- <input class="debugButton1" type="button" onclick="FUNCS.addPlayer(2);"                                     value="FUNCS.addPlayer(2);"> -->
			<!-- <input class="debugButton1" type="button" onclick="FUNCS.createInvaderGrid();"                              value="FUNCS.createInvaderGrid();"> -->
			<!-- <input class="debugButton1" type="button" onclick="DEBUG.drawPreCanvasToPostCanvas();" value="DEBUG.drawPreCanvasToPostCanvas();"> -->
			<!-- <input class="debugButton1" type="button" onclick="DEBUG.drawAllGraphics();"           value="DEBUG.drawAllGraphics();"> -->
			<!-- <br> -->

			<input class="debugButton1" type="button" onclick="DEBUG.adjustFPS(-1, 0);"            value="Decrease FPS by 1">
			<input class="debugButton1" type="button" onclick="DEBUG.adjustFPS(1 , 0);"            value="Increase FPS by 1">
			<select class="debugButton1" id="fps_select" onchange="if(this.value){ DEBUG.adjustFPS(0 , this.value ); }">
				<option value="">...Choose new FPS</option>
				<option value="1" >Set to 1 FPS</option>
				<option value="2" >Set to 2 FPS</option>
				<option value="3" >Set to 3 FPS</option>
				<option value="4" >Set to 4 FPS</option>
				<option value="5" >Set to 5 FPS</option>
				<option value="10">Set to 10 FPS</option>
				<option value="20">Set to 20 FPS</option>
				<option value="30">Set to 30 FPS</option>
				<option value="40">Set to 40 FPS</option>
				<option value="50">Set to 50 FPS</option>
				<option value="60">Set to 60 FPS</option>
			</select>
			<br>

			<input class="debugButton1" type="button" onclick="DEBUG.adjustDebugLatency(-100, false);" value="DEBUG latency -= 100">
			<input class="debugButton1" type="button" onclick="DEBUG.adjustDebugLatency(100 , false);" value="DEBUG latency += 100">
			<select class="debugButton1" id="debugLatency_select" onchange="if(this.value){ DEBUG.adjustDebugLatency(parseInt(this.value,10), true); }">
				<option value="">...New DEBUG Latency</option>
				<option value="100" >Set to 100 ms</option>
				<option value="200" >Set to 200 ms</option>
				<option value="300" >Set to 300 ms</option>
				<option value="400" >Set to 400 ms</option>
				<option value="500" >Set to 500 ms</option>
				<option value="600" >Set to 600 ms</option>
				<option value="700" >Set to 700 ms</option>
				<option value="800" >Set to 800 ms</option>
				<option value="900" >Set to 900 ms</option>
				<option value="1000">Set to 1000 ms</option>
				<option value="1100">Set to 1100 ms</option>
				<option value="1200">Set to 1200 ms</option>
				<option value="1300">Set to 1300 ms</option>
				<option value="1400">Set to 1400 ms</option>
				<option value="1500">Set to 1500 ms</option>
				<option value="1600">Set to 1600 ms</option>
				<option value="1700">Set to 1700 ms</option>
				<option value="1800">Set to 1800 ms</option>
				<option value="1900">Set to 1900 ms</option>
				<option value="2000">Set to 2000 ms</option>
			</select>
			<br>

			<br>

			<!-- <input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P1', 'left' , true);" onmouseup="FUNCS.emulateKeypressByControls('P1', 'left' , false);" value='P1:left '> -->
			<!-- <input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P1', 'right', true);" onmouseup="FUNCS.emulateKeypressByControls('P1', 'right', false);" value='P1:right'> -->
			<!-- <input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P1', 'fire' , true);" onmouseup="FUNCS.emulateKeypressByControls('P1', 'fire' , false);" value='P1:fire '> -->
			<!-- <br> -->

			<!-- <input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P2', 'left' , true);" onmouseup="FUNCS.emulateKeypressByControls('P2', 'left' , false);" value='P2:left '> -->
			<!-- <input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P2', 'right', true);" onmouseup="FUNCS.emulateKeypressByControls('P2', 'right', false);" value='P2:right'> -->
			<!-- <input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P2', 'fire' , true);" onmouseup="FUNCS.emulateKeypressByControls('P2', 'fire' , false);" value='P2:fire '> -->
			<!-- <br> -->

			<div id="debug_output2">
			</div>

		</div>

		<div class="debugDivSection borderRadius1">
			<label>
				<input id="chk_debug" type="checkbox" checked>
				Update the debug info.
				<br>
			</label>

			<div id="debug_output1">
			</div>
		</div>

	</div>