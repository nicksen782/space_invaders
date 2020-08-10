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

	<!-- Record the debug flag. -->
	<?php
		// Determine if the debug flag is set and create a value for it in JavaScript.
		echo "<script>let DEBUGMODE=" . ($debugIsOn ? "true" : "false") . ";</script>\n";
	?>

	<!-- GAME JAVASCRIPT -->
	<script type="text/javascript" src="game.js"></script>

	<!-- GAME CSS -->
	<link rel="stylesheet" type="text/css" href="game.css">

	<?php
		// Determine if the debug flag is set and create a value for it in JavaScript.
		if($debugIsOn){
			echo "<!-- DEBUG JAVASCRIPT -->\n";
			echo "\t<script type='text/javascript' src='debug.js'></script>" ."\n";
			echo "\n";

			echo "\t";
			echo "<!-- DEBUG CSS -->\n";
			echo "\t<link rel='stylesheet' type='text/css' href='debug.css'>" ."\n";
		}
	?>

</head>

<body>
	<!--  -->
	<div id="entireBodyDiv"></div>

	<!-- MAIN DISPLAY -->
	<div id="mainDisplay" class=" <?php echo $debugIsOn ? "inlineBlock" : ""?>">

		<!-- GAME DIV -->
		<div id="game" class="borderRadius1">
			<!-- TITLE -->
			<div id="gametitle" class="borderRadius1">
				Space Invaders!
			</div>

			<!-- SCORES -->
			<div id="scores" class="borderRadius1">
				<!-- Player 1 -->
				<div id="p1Score">&nbsp;</div><div id="p2Score">&nbsp;</div>

				<div style="clear:both;"></div>

				<!-- Player 2 -->
				<div id="p1Accurracy">&nbsp;</div><div id="p2Accurracy">&nbsp;</div>
			</div>

			<!-- MAIN DISPLAY -->
			<div id="canvas1_div" class="borderRadius1">
				<!-- Game output canvas -->
				<canvas id="mainCanvas" width="240" height="240" class=""></canvas>

				<!-- User interaction needed div -->
				<div id="requestUserInteraction" class="hidden borderRadius1">
					Click anywhere on the
					<br>
					webpage to continue.

				</div>
			</div>

			<!-- CONTROLS -->
			<div id="controls" class="borderRadius1">
				<!-- Controls go here -->
				<div id="p1_area" class="borderRadius1 noSelect2">
					<div class="player_area_boxes pab1">
						<canvas id="joystick1_canvas" dir="idle" class="noSelect2 joystick_canvas"></canvas>
					</div>

					<div class="player_area_boxes pab2">
						<canvas id = "fire1_canvas" firing="false" class="noSelect2 fire_canvas"></canvas>
					</div>
				</div>

				<div id="p2_area" class="borderRadius1 noSelect2" style="display:none;">
					<div class="player_area_boxes pab1">
						<canvas id="joystick2_canvas" dir="idle" class="noSelect2 joystick_canvas"></canvas>
					</div>

					<div class="player_area_boxes pab2">
						<canvas id = "fire2_canvas" firing="false" class="noSelect2 fire_canvas"></canvas>
					</div>
				</div>

				<div style="clear:both;"></div>

				<div id="menu_div">
					<div id="menu_tab" class="borderRadius1" onclick="LOADER.toggleMenu();">CLICK TO OPEN MENU</div>
					<div id="menu" class="closed borderRadius1">
						<input type="button" onclick="FUNCS.demoEntities(); LOADER.toggleMenu();" value="Start Demo">
						<br>

						<div id="menu_player_size_div">
							<canvas id="menu_player_size_normal" onclick='GAMEVARS.PLAYERS[0].imgCacheKey="player"       ; LOADER.toggleMenu();'></canvas>
							<canvas id="menu_player_size_large"  onclick='GAMEVARS.PLAYERS[0].imgCacheKey="player_large" ; LOADER.toggleMenu();'></canvas>
							<canvas id="menu_player_size_larger" onclick='GAMEVARS.PLAYERS[0].imgCacheKey="player_larger"; LOADER.toggleMenu();'></canvas>
						</div>

					</div>
				</div>

			</div>

			<!-- <div id="debug_calcFPS">--&nbsp;</div> -->
		</div>

	</div>
	<?php
		// Include the DIV code if the $debugIsOn flag is set.
		if($debugIsOn){ echo "\n"; require_once "debug.php"; }
		else          { echo "\t<!-- DEBUG IS OFF -->\n";    }
	?>
</body>

</html>