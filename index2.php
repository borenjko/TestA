<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Test Red Cube</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="http://code.jquery.com/ui/1.11.0/jquery-ui.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>


<div data-init="<?php echo file_get_contents('array.json') ?>">
	<div></div><div></div><div></div>
	<div></div><div></div><div></div>
	<div></div><div></div><div></div>

	<input type="button" value="Send to server" disabled="disabled" />

</div>




<script type="text/javascript" src="scripts.js"></script>




</body>


</html>