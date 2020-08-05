	<!-- DEBUG DISPLAY -->
	<div id="debugDiv" class="borderRadius1">
		<div class="debugDivSection borderRadius1">
			<table class="debugTable1">
				<caption>INFO</caption>
				<tr> <th>Canvas mouse coords:</th> <td><span id="mouseCoordsDiv">(x:0, y:0)</span></td>   </tr>
				<tr> <th>Current FPS:</th>         <td><span id="currentFPS">FPS: 0 (0.00 ms)</span></td> </tr>
			</table>
			<br>

			<input class="debugButton1" type="button" onclick="FUNCS.pause();" value="FUNCS.pause();">
			<input class="debugButton1" type="button" onclick="FUNCS.demoEntities();" value="DEMO ENTITIES">
			<input class="debugButton1" type="button" onclick="FUNCS.startGameFromBeginning();" value="RESET">
			<br>

			<input class="debugButton1" type="button" onclick="DEBUG.lowerInvaders();" value="LOWER INVADERS">
			<input class="debugButton1" type="button" onclick="DEBUG.raiseInvaders();" value="RAISE INVADERS">
			<br>

			<input class="debugButton1" type="button" onclick="DEBUG.removeFirstInvader();" value="removeFirstInvader">
			<input class="debugButton1" type="button" onclick="DEBUG.removeLastInvader();" value="removeLastInvader">
			<br>

			<input class="debugButton1" type="button" onclick="GAMEVARS.gameover_bottom-=1;" value="gameover_bottom -=1">
			<input class="debugButton1" type="button" onclick="GAMEVARS.gameover_bottom+=1;" value="gameover_bottom +=1">
			<br>

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

			<input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P1', 'left' , true);" onmouseup="FUNCS.emulateKeypressByControls('P1', 'left' , false);" value='P1:left '>
			<input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P1', 'right', true);" onmouseup="FUNCS.emulateKeypressByControls('P1', 'right', false);" value='P1:right'>
			<input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P1', 'fire' , true);" onmouseup="FUNCS.emulateKeypressByControls('P1', 'fire' , false);" value='P1:fire '>
			<br>

			<input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P2', 'left' , true);" onmouseup="FUNCS.emulateKeypressByControls('P2', 'left' , false);" value='P2:left '>
			<input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P2', 'right', true);" onmouseup="FUNCS.emulateKeypressByControls('P2', 'right', false);" value='P2:right'>
			<input class="debugButton1" type="button" onmousedown="FUNCS.emulateKeypressByControls('P2', 'fire' , true);" onmouseup="FUNCS.emulateKeypressByControls('P2', 'fire' , false);" value='P2:fire '>
			<br>

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