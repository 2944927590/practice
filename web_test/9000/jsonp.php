<?php
	if($_POST){
        $arr = array('name'=>$_POST['u'], 'age'=>$_POST['age']);
        echo json_encode($arr);
    }else {
        echo "no post";
    }

?>