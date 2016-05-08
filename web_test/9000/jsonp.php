<?php
    $callback = $_GET['callback'];
    $arr = array("name"=>"alsy", "age"=>"20");
    echo $callback."(". json_encode($arr) .");";
?>