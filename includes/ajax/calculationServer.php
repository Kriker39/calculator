<?php

	$displayLine= $_POST['displayLine'];
	$displayLine = preg_replace('/\s+/', '', $displayLine);

	$comma=preg_match_all('/[,]/', $displayLine);
	$pow=0;

	if(preg_match('/^[0-9-+*\/\(\)\.,sqrtpow]*$/', $displayLine)){
		$resultCalculation=0;
		$pow= preg_match_all('/pow/', $displayLine);
	
		if($comma>$pow){
			$result=array(true, "SyntaxError: Unexpected token ','");
			$json_info=json_encode($result); // json 
			echo $json_info; // получаемое js
			exit();
		}

		eval('$resultCalculation = '.$displayLine.';');

		$result=array(false, $resultCalculation, $displayLine );
	}
	else{
		$result= array(true, "SyntaxError: Unknown token.");
	}

 	$last_error = error_get_last();
	
	if( $last_error ){
		$result=array(true,"SyntaxError: Invalid or unexpected token.(NaN)");
	}

	$json_info=json_encode($result); // json 
	echo $json_info; // получаемое js

?>