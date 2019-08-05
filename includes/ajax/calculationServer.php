<?php
	$displayLine= $_POST['displayLine']; // получаем пример
	$displayLine = preg_replace('/\s+/', '', $displayLine); // убираем пробелы
	$comma=preg_match_all('/[,]/', $displayLine); // количество запятых
	$pow=0; 

	if(preg_match('/^[0-9-+*\/\(\)\.,sqrtpow]*$/', $displayLine)){ // проверка на посторонние символы 
		$pow= preg_match_all('/pow/', $displayLine); // количество команд pow
	
		if($comma>$pow){ // проверка на лишние запятые и вывод ошибки если есть лишние
			$result=array(true, "SyntaxError: Unexpected token ','");
			$json_info=json_encode($result); // json 
			echo $json_info; // получаемое js
			exit();
		}

		eval('$resultCalculation = '.$displayLine.';'); // преобразование строки в код (для выполнения вычислений)

		$result=array(false, $resultCalculation);
	}
	else{
		$result= array(true, "SyntaxError: Unknown token.");
	}

 	$last_error = error_get_last(); // получает последнюю ошибку
	
	if( $last_error ){
		$result=array(true,"SyntaxError: Invalid or unexpected token.(NaN)");
	}

	$json_info=json_encode($result); // json 
	echo $json_info; // получаемое js
?>