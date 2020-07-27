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

	<title>Space Invaders v3</title>

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


			<!--This is where the game display is..-->
			<div>
				<canvas id="mainGameCanvas" width="550" height="550"></canvas>
			</div>

			<!--Information-->
			<div id="infodiv">
				<div id="img_points">
					<!-- <img src="images/space_invaders01.jpg"> -->
					<!-- <img src="images/space_invaders02.png"> -->
				</div>


				<div id="infodivText">

					<div id="div_controls">GAME CONTROLS
P1
Left Arrow  = Move Player 1 LEFT
Right Arrow = Move Player 1 RIGHT
Up Arrow    = Player 1 FIRE

P2
A Key       = Move Player 2 LEFT
D Key       = Move Player 2 RIGHT
W Key       = Player 2 FIRE
					</div>

					<div id="instructions">
						<b>Instructions:</b><br>
						<div style="padding-left:1em;">
							Shoot them all before they shoot you!
							<br>
						</div>
					</div>

				</div>

			</div>

		</div>

		<div id="sideDiv" <?php echo !$debugIsOn ? "class='hidden'" : ""; ?>>

			<div id="modifiers">
				<label <?php echo $debugIsOn ? "" : 'style="display:none;"'; ?> ><input id="chk_debug" type="checkbox" <?php echo $debugIsOn ? "checked" : ""; ?> >Update the debug info.<br></label>
				<?php echo $debugIsOn ? "<br>" : ''; ?>
				<div>
					<b>Game Modifiers:</b><br>
					<div style="padding-left:1em;">
						<input id="newgame" type="button" value="RESET"><br>
						<input type="button" id="pause" value="PAUSE"><br>
						<input type="button" id="upFPS" value="Raise FPS"><br>
						<input type="button" id="dnFPS" value="Lower FPS"><br>
						<input type="button" id="addAS" value="Add Alien Ship"><br>
						<input type="button" id="removeAllAS" value="Remove All Alien Ships"><br>
						<input type="button" onclick="generateStarBackground1();" value="generateStarBackground1"><br>
						<input type="button" onclick="generateStarBackground2();" value="generateStarBackground2"><br>
						<!-- <input type="button" onclick="drawStarBackground1();"     value="drawStarBackground1"><br> -->
						<!-- <input type="button" onclick="drawStarBackground2();"     value="drawStarBackground2"><br> -->
						<input type="button" onclick="useStarBackground1();"     value="Use StarBackground1"><br>
						<input type="button" onclick="useStarBackground2();"     value="Use StarBackground2"><br>
						<br>
						<input type="button" onclick="DEBUG.removeFirstAlienInvader();"     value="removeFirstAlienInvader"><br>
						<input type="button" onclick="DEBUG.removeLastAlienInvader();"     value="removeLastAlienInvader"><br>
						<br>
						<input type="button" onclick="DEBUG.raiseInvaders();"     value="Raise Invaders"><br>
						<input type="button" onclick="DEBUG.lowerInvaders();"     value="Lower Invaders"><br>
						<br>
						<input type="button" onclick="UTILITYFUNCTIONS.enlargeRandomInvader();"     value="Enlarge 1 Invader"><br>
						<div id="mouseCoordsDiv"></div>
					</div>
				</div>

			</div>

			<div id="debug">
				<b>Game Elements/Stats (live):</b><br>
				<div style="padding-left:1em;">
					<!--The text in this div is output by Javascript.-->
					<div id="debug_details">
						Details are added here upon each drawn frame.<br>
						Check the debugging checkbox to activate this feature.
					</div>
				</div>
			</div>
		</div>

	</div>

	<script type="text/javascript" src="game.js"></script>

</body>

</html>