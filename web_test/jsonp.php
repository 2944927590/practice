<?php 
	$callback = $_REQUEST['callback'];
	$data = ['a', 'b', 'c', 'd'];
	$message = "hello world!";
	echo $callback."(".json_encode($data).", ".json_encode($message).");";
?>