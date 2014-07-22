<?php

echo dirname(__FILE__).'/array.json';
var_dump($_FILES);
$tmp_name = $_FILES["thefile"]["tmp_name"];
move_uploaded_file( $tmp_name , dirname(__FILE__).'/array.json' );

?>