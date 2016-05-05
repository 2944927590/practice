<?php
    $callback = $_REQUEST['callback'];
    $u = isset($_REQUEST['u']) ? $_REQUEST['u'] : 'aaa';
    $data = ['a', 'b', 'c', 'd'];
    $message = "hello world!";
    echo $callback."(".json_encode($data).", ".json_encode($message).", ".json_encode($u).")";
?>