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
				<!-- <canvas id="mainGameCanvas" width="550" height="550"></canvas> -->
				<canvas id="mainGameCanvas" width="240" height="240"></canvas>
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
Left Arrow  = Move LEFT
Right Arrow = Move RIGHT
Up Arrow    = FIRE

P2
A Key       = Move LEFT
D Key       = Move RIGHT
W Key       = FIRE
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
						<input type="button" onclick="STARS.generateStarBackground1();" value="generateStarBackground1"><br>
						<input type="button" onclick="STARS.generateStarBackground2();" value="generateStarBackground2"><br>
						<!-- <input type="button" onclick="STARS.drawStarBackground1();"     value="drawStarBackground1"><br> -->
						<!-- <input type="button" onclick="STARS.drawStarBackground2();"     value="drawStarBackground2"><br> -->
						<input type="button" onclick="STARS.useStarBackground1();"     value="Use StarBackground1"><br>
						<input type="button" onclick="STARS.useStarBackground2();"     value="Use StarBackground2"><br>
						<br>
						<input type="button" onclick="DEBUG.removeFirstAlienInvader();"     value="removeFirstAlienInvader"><br>
						<input type="button" onclick="DEBUG.removeLastAlienInvader();"     value="removeLastAlienInvader"><br>
						<br>
						<input type="button" onclick="DEBUG.raiseInvaders();"     value="Raise Invaders"><br>
						<input type="button" onclick="DEBUG.lowerInvaders();"     value="Lower Invaders"><br>
						<br>
						<input type="button" onclick="UTILITYFUNCTIONS.enlargeRandomInvader();"     value="Enlarge 1 Invader"><br>

						<div id="mouseCoordsDiv">*</div>

						<!-- <br>
						<button title="alienShips" onclick='DEBUG.drawSprite(0 );'>0</button>
						<button title="alienShips" onclick='DEBUG.drawSprite(1 );'>1</button>
						<br>
						<br>

						<button onclick='DEBUG.drawSprite(2 );'>2</button>
						<button onclick='DEBUG.drawSprite(3 );'>3</button>
						<button onclick='DEBUG.drawSprite(4 );'>4</button>
						<button onclick='DEBUG.drawSprite(5 );'>5</button>
						<br>
						<br>

						<button onclick='DEBUG.drawSprite(6 );'>6</button>
						<button onclick='DEBUG.drawSprite(7 );'>7</button>
						<br>

						<button onclick='DEBUG.drawSprite(8 );'>8</button>
						<button onclick='DEBUG.drawSprite(9 );'>9</button>
						<br>

						<button onclick='DEBUG.drawSprite(10);'>10</button>
						<button onclick='DEBUG.drawSprite(11);'>11</button>
						<br>

						<button onclick='DEBUG.drawSprite(12);'>12</button>
						<button onclick='DEBUG.drawSprite(13);'>13</button>
						<br>

						<button onclick='DEBUG.drawSprite(14);'>14</button>
						<button onclick='DEBUG.drawSprite(15);'>15</button>
						<br>

						<button onclick='DEBUG.drawSprite(16);'>16</button>
						<button onclick='DEBUG.drawSprite(17);'>17</button>
						<br>

						<button onclick='DEBUG.drawSprite(18);'>18</button>
						<button onclick='DEBUG.drawSprite(19);'>19</button>
						<br>

						<button onclick='DEBUG.drawSprite(20);'>20</button>
						<button onclick='DEBUG.drawSprite(21);'>21</button>
						<br>

						<button onclick='DEBUG.drawSprite(22);'>22</button>
						<button onclick='DEBUG.drawSprite(23);'>23</button>
						<br>

						<button onclick='DEBUG.drawSprite(24);'>24</button>
						<button onclick='DEBUG.drawSprite(25);'>25</button>
						<br>
						<br>

						<button onclick='DEBUG.drawSprite(26);'>26</button>
						<button onclick='DEBUG.drawSprite(27);'>27</button>
						<br>

						<button onclick='DEBUG.drawSprite(28);'>28</button>
						<button onclick='DEBUG.drawSprite(29);'>29</button>
						<button onclick='DEBUG.drawSprite(30);'>30</button>
						<button onclick='DEBUG.drawSprite(31);'>31</button>
						<button onclick='DEBUG.drawSprite(32);'>32</button>
						<button onclick='DEBUG.drawSprite(33);'>33</button>
						<br>

						<button onclick='DEBUG.drawSprite(34);'>34</button>
						<button onclick='DEBUG.drawSprite(35);'>35</button>
						<button onclick='DEBUG.drawSprite(36);'>36</button>
						<button onclick='DEBUG.drawSprite(37);'>37</button> -->

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