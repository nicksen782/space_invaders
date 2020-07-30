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
	<div id="gameAndControls" <?php echo !$debugIsOn ? "class='centerMain'" : ""; ?>>
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
			<b>Last canvas mouse coords:</b> <span id="mouseCoordsDiv">(x:0, y:0)</span> <br>

			<label <?php echo $debugIsOn ? "" : 'style="display:none;"'; ?> ><input id="chk_debug" type="checkbox" <?php echo $debugIsOn ? "checked" : ""; ?> >Update the debug info.<br></label>
			<?php echo $debugIsOn ? "<br>" : ''; ?>

			<input type="button" onclick="FUNCS.pause();" value="FUNCS.pause();">
			<span id="pauseState">--</span>
			<br>
			<br>

			<input type="button" onclick="DEBUG.drawPreCanvasToPostCanvas();" value="DEBUG.drawPreCanvasToPostCanvas();"><br>
			<br>

			<input type="button" onclick="DEBUG.drawAllGraphics();" value="DEBUG.drawAllGraphics();"><br>
			<br>

			<input type="button" onclick="FUNCS.addPlayer(1);" value="FUNCS.addPlayer(1);">
			<input type="button" onclick="GAMEVARS.PLAYERS[0].draw();" value="GAMEVARS.PLAYERS[0].draw();">
			<br>

			<input type="button" onclick="FUNCS.addPlayer(2);" value="FUNCS.addPlayer(2);">
			<input type="button" onclick="GAMEVARS.PLAYERS[1].draw();" value="GAMEVARS.PLAYERS[1].draw();">
			<br>

			<div id="debug_output">
			</div>

		</div>

	</div>

	<script type="text/javascript" src="game.js"></script>

</body>

</html>