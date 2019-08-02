<?php 
	$file= fopen("../../data/txt/rules.txt", "rt"); // открывает файл для чтения 
	
	if ($file) 
	{
		$text="";
	    while (!feof($file)) // Команда feof определяет, произведено ли чтение до конца файла
	    { 
		   $line = fgets($file); // достает строку текста из файла 

		   $coding=iconv_get_encoding($line); // получает кодировку полученого текста
		   $line=iconv($coding, "UTF-8", $line); // переводит текст из полученой кодировки в UTF-8
		   $text=$text.$line."<br>";
		}

		$json_info=json_encode($text);
		echo $json_info;
	}
	else{
		$json_info=json_encode("error");
		echo $json_info;
	}
?>