<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Калькулятор</title>
	<link href="https://fonts.googleapis.com/css?family=Changa&display=swap&subset=latin-ext" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="style/style.css">
	<script type="text/javascript" src="scripts/lib/jquery-3.4.1.min.js"></script>
	<script type="text/javascript" src="scripts/lib/jquery.cookie.js"></script>
	<script type="text/javascript" src="scripts/functions.js"></script>
</head>
<body>
	<header class="container_menu">
		<nav class="menu">
			<div class="local">local</div> | 
			<div class="server">server</div> | 
			<div class="rules">rules</div>
		</nav>
	</header>

	<main class="calculator">
		<table class="panel">
			<tr>
				<td colspan="6"><input type="text" class="display" name="display"></td>
			</tr>
			<tr>
				<td colspan="6"><hr/></td>
			</tr>
			<tr>
				<td><button name="copy" title="The clipboard will be changed!">copy</button></td>
				<td><button name="1">1</button></td>
				<td><button name="2">2</button></td>
				<td><button name="3">3</button></td>
				<td><button name="CE" title="Delete all characters on the display.">CE</button></td>
				<td><button name="C" title="Delete last character on the display.">C</button></td>
			</tr>
			<tr>
				<td><button name="paste" title="Data in the clipboard will be read!">paste</button></td>
				<td><button name="4">4</button></td>
				<td><button name="5">5</button></td>
				<td><button name="6">6</button></td>
				<td><button name="+">+</button></td>
				<td><button name="-">-</button></td>
			</tr>
			<tr>
				<td><button name="root">&radic;a</button></td>
				<td><button name="7">7</button></td>
				<td><button name="8">8</button></td>
				<td><button name="9">9</button></td>
				<td><button name="*">*</button></td>
				<td><button name="/">/</button></td>
			</tr>
			<tr>
				<td><button name="power">a<sup>x</sup></button></td>
				<td><button name="," id="comma">,</button><button name="." id="dot">.</button></td>
				<td><button name="0">0</button></td>
				<td><button name="=">=</button></td>
				<td><button name="(">(</button></td>
				<td><button name=")">)</button></td>
			</tr>
		</table>
	</main>

	<aside class="history">
		<div class="title_history">History:</div>
		<textarea class="history_text" disabled="disabled" title="History is not saved after page refresh!"></textarea>
	</aside>

	<footer class="info">
		<a href="http://localhost/valeriisokolov.ua/">Create by Valerii Sokolov</a>
	</footer>

</body>
</html>