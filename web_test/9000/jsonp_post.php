<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Max-Age: 1000');
	if($_POST){
        $arr = array('name'=>$_POST['u'], 'age'=>$_POST['age']);
        echo json_encode($arr);
    }else {
        echo "no post";
    }

?>