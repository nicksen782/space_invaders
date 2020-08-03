<!doctype html>
<html lang="en">

<?php $debugIsOn=isset($_GET['debug']) ? true : false ; ?>

<head>
	<!--https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html-->
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Gaming with JavaScript and Canvas.">
	<meta name="author" content="Nickolas Andersen (nicksen782)">

	<link rel="icon" href="data:;base64,iVBORwOKGO=" />

	<title>Space Invaders v4</title>

	<!-- Basic styling, centering the canvas -->
	<link rel="stylesheet" type="text/css" href="game.css">
	<script>
		<?php
			if($debugIsOn){ echo "let DEBUGMODE=true;\n"; }
			else          { echo "let DEBUGMODE=false;\n"; }
		?>
	</script>
</head>

<body>

	<!--
		UTILITYFUNCTIONS.playSound('player_shoot');
		UTILITYFUNCTIONS.playSound('player_hit');
		UTILITYFUNCTIONS.playSound('alien_ship_shoot');
		UTILITYFUNCTIONS.playSound('alien_ship_hit');
		UTILITYFUNCTIONS.playSound('alien_invader_shoot');
		UTILITYFUNCTIONS.playSound('alien_invader_hit');
	-->

	<!--Game, modifiers, debug stats-->
	<div id="gameAndControls" class="centerMain">
		<div id="game">
			<div id="gametitle">
				Space Invaders!
			</div>

			<div id="scores">
				<div id="p1Score">&nbsp;</div><div id="p2Score">&nbsp;</div>
				<div style="clear:both;"></div>
				<div id="p1Accurracy">&nbsp;</div><div id="p2Accurracy">&nbsp;</div>
			</div>

			<!--This is where the game display is.-->
			<div id="canvas1_div">
				<canvas id="mainCanvas" width="240" height="240"></canvas>
				<div id="requestUserInteraction" class="hidden">
					Click anywhere on the
					<br>
					webpage to continue.
				</div>
			</div>

		</div>

		<div id="sideDiv" <?php echo !$debugIsOn ? "class='hidden'" : ""; ?>>
			<label <?php echo $debugIsOn ? "" : 'style="display:none;"'; ?> ><input id="chk_debug" type="checkbox" <?php echo $debugIsOn ? "checked" : ""; ?> >Update the debug info.<br></label>
			<?php echo $debugIsOn ? "<br>" : ''; ?>

			<div id="debug_output1">
			</div>
		</div>

		<div id="sideDiv2" <?php echo !$debugIsOn ? "class='hidden'" : ""; ?>>
			<b>Last canvas mouse coords:</b> <span id="mouseCoordsDiv">(x:0, y:0)</span> <br>

			<input type="button" onclick="FUNCS.pause();" value="FUNCS.pause();"><span id="pauseState"> --</span><br>

			<!-- <input type="button" onclick="FUNCS.addPlayer(1);"                                     value="FUNCS.addPlayer(1);"> -->
			<!-- <input type="button" onclick="FUNCS.addPlayer(2);"                                     value="FUNCS.addPlayer(2);"> -->
			<!-- <input type="button" onclick="FUNCS.createInvaderGrid();"                              value="FUNCS.createInvaderGrid();"> -->
			<input type="button" onclick="DEBUG.demoEntities();" value="DEMO ENTITIES">
			<input type="button" onclick="FUNCS.startGameFromBeginning();" value="RESET">
			<br>

			<input type="button" onclick="DEBUG.lowerInvaders();" value="LOWER INVADERS">
			<input type="button" onclick="DEBUG.raiseInvaders();" value="RAISE INVADERS">
			<input type="button" onclick="DEBUG.removeFirstInvader();" value="removeFirstInvader">
			<input type="button" onclick="DEBUG.removeLastInvader();" value="removeLastInvader">
			<!-- <input type="button" onclick="FUNCS.invaderShoot_random();" value="INVADER RANDOM SHOOT"> -->
			<br>
			<input type="button" onclick="GAMEVARS.gameover_bottom-=1;" value="gameover_bottom -=1">
			<input type="button" onclick="GAMEVARS.gameover_bottom+=1;" value="gameover_bottom +=1">
			<input type="button" onclick="GAMEVARS.barrier_top-=1;" value="barrier_top -=1">
			<input type="button" onclick="GAMEVARS.barrier_top+=1;" value="barrier_top +=1">
			<br>

			<!-- <input type="button" onclick="DEBUG.drawPreCanvasToPostCanvas();" value="DEBUG.drawPreCanvasToPostCanvas();"><br> -->
			<!-- <input type="button" onclick="DEBUG.drawAllGraphics();"           value="DEBUG.drawAllGraphics();"><br> -->
			<!-- <br> -->

			<span id="currentFPS">--</span>
			<!-- <br> -->
			<input type="button" onclick="DEBUG.adjustFPS(-1, 0);"            value="Decrease FPS by 1">
			<input type="button" onclick="DEBUG.adjustFPS(1 , 0);"            value="Increase FPS by 1">
			<select id="fps_select" onchange="if(this.value){ DEBUG.adjustFPS(0 , this.value ); }">
				<option value="">...Choose</option>
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
			<br>

			<div id="debug_output2">
			</div>

		</div>

	</div>

	<script type="text/javascript" src="game.js"></script>

</body>

</html>