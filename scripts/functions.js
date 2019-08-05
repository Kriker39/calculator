var returnValueGlobal=[true,"SyntaxError: Invalid or unexpected token.(NaN)"]; // обьявление массива который принимает решение или ошибку(1 значение- есть ли ошибка, 2 значение - решение или текст ошибки)

jQuery('document').ready(function(){
	typeCalculation();
	workCalculator();
	rules();
});

function workCalculator(){// основная часть работы калькулятора
	var saveDisplayLine="empty",
		typeCalculation;

	jQuery('.panel button').on("click", function(){ // событие клика на кнопку на панеле
		var displayLine= jQuery('.display').val(), // текст на дисплее
			buttonOption= jQuery(this).attr("name"), // за что отвечает нажатая кнопка
			errorMsg="false"; // текст ошибки для кнопок

		if(buttonOption=="="){ // кнопка `равно`
			saveDisplayLine=displayLine; // бэкап примера на дисплее 
			typeCalculation= jQuery.cookie('typeCalculation'); // узнаем как делать вычисления(local|server) с помощью cookie

			if(typeCalculation==null){typeCalculation= "local";} // если куки пустой, значение по умолчанию(local)

			if(typeCalculation=="local"){ // запуск локального вычисления
				calculationLocal(displayLine);
				setTimeout(function(){
					if(returnValueGlobal[0]==true){
						errorMsg=returnValueGlobal[1];
					}
					else{
						displayLine=returnValueGlobal[1];
					}
				},20);
			}
			else if(typeCalculation=="server"){ // запуск серверного вычисления
				calculationServer(displayLine);
				setTimeout(function(){
					if(returnValueGlobal[0]==true){
						errorMsg=returnValueGlobal[1];
					}
					else{
						displayLine=returnValueGlobal[1];
					}
				},20);
			}
		}
		else if(buttonOption=="copy"){ // кнопка `копировать`
			if(displayLine.replace(/\s/g,"").length!=0){ // проверка пустой ли дисплей
				navigator.clipboard.writeText(displayLine).catch(err => { // запись текста на дисплее в буфер обмена и отлов ошибки
					errorMsg=err; 
				}); 
			}
			else{ // ошибка если дисплей пустой
				errorMsg="Data could not be copied because input field is empty.";
			}
		}
		else if(buttonOption=="paste"){ // кнопка `вставить`
			navigator.clipboard.readText().then(text => { // чтение буфера обмена и отлов ошибки
			    displayLine=text;
			}).catch(err => {
			    errorMsg=err;
			});
		}
		else if(buttonOption=="C"){ // кнопка `стереть последний символ`
			displayLine= displayLine.slice(0,-1);
		}
		else if(buttonOption=="CE"){ // кнопка `стереть все`
			displayLine= "";
		}
		else if(buttonOption=="root"){ // кнопка `корень`
			displayLine+= "sqrt(";
		}
		else if(buttonOption=="power"){ // кнопка `степень`
			displayLine+= "pow(";
		}
		else{ // кнопки `0`-`9`, `+`, `-`, `*`, `/`, `.`, `(`, `)`
			displayLine+= buttonOption;
		}
		
		setTimeout(function(){ // таймаут нужен для работы серверного вычисления. без таймаута, эта функция завершается быстрей чем приходит ответ от сервера
			jQuery('.display').val(displayLine); // вывод отредактированого текста на дисплей
			history(buttonOption, saveDisplayLine, errorMsg); // запуск работы истории(консоли)
			returnValueGlobal=[true,"SyntaxError: Invalid or unexpected token.(NaN)"]; // возвращение стандратного значения(для php)
		}, 30);
	});
}

function history(buttonOption, saveDisplayLine, errorMsg){
	var history= jQuery('.history_text').val(), // весь текст из истории
		firstLine,
		numFirstLine,
		displayLine=jQuery(".display").val(); // текст на дисплее

	while(true){ // цикл нужен чтобы останавливать работу в нужный момент
		if(history){ // если история не пустая 
			firstLine= history.split("\n")[0]; // первая строка истории
			numFirstLine= firstLine.split(" | ")[0]; // номер первой строки истории

			if(parseInt(numFirstLine)>=0){ // если номер первой строки есть
				if (buttonOption!="=" && buttonOption!="copy" && buttonOption!="paste"){ 
					history= numFirstLine+" | "+displayLine+history.replace(firstLine, ""); // изминение первой строки при '0-9 . , * / + - ( )' 
				}
				else if(buttonOption=="="){
					if (errorMsg=="false"){ // добавление в историю примера и его решения 
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | "+saveDisplayLine+" = "+displayLine+ history.replace(firstLine, "");
					}
					else{ // вывод в историю ошибки вычисления
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [equals to][error] -> "+errorMsg+ history.replace(firstLine, "");
					}
				}
				else if(buttonOption=="copy"){
					if(errorMsg=="false"){ // вывод в историю сообщения удачного копирования
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [copy] -> "+displayLine+ history.replace(firstLine, "");
					}
					else{ // вывод в историю ошибки копирования
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [copy][error] -> "+errorMsg+ history.replace(firstLine, "");
					}
				}
				else if(buttonOption=="paste"){
					if(errorMsg=="false"){ // вывод в историю сообщения удачной вставки
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [paste] -> "+displayLine+ history.replace(firstLine, "");
					}
					else{ // вывод в историю ошибки вставки
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [paste][error] -> "+errorMsg+ history.replace(firstLine, "");
					}
				}
				break;
			}
			else{ // если номера первой строки нет
				history= history.split("\n")[1]; // удаление первой строки истории
			}	
		}
		else{ // если история пустая
			history= "0 | "; // логические операторы ниже отвечают за все тоже что и выше, но только чтобы начинались с 0
			if (buttonOption!="=" && buttonOption!="copy" && buttonOption!="paste"){
				history+= displayLine;
			}
			else if(buttonOption=="="){
				if (errorMsg=="false"){
					history="1 | "+displayLine+"\n0 | "+saveDisplayLine+" = "+displayLine;
				}
				else{
					history="1 | "+displayLine+"\n0 | [equals to][error] -> "+errorMsg;
				}
			}
			else if(buttonOption=="copy"){
				if(errorMsg=="false"){
					history="1 | "+displayLine+"\n0 | [copy] -> "+displayLine;
				}
				else{
					history="1 | "+displayLine+"\n0 | [copy][error] -> "+errorMsg;
				}
			}
			else if(buttonOption=="paste"){
				if(errorMsg=="false"){
					history="1 | "+displayLine+"\n0 | [paste] -> "+displayLine;
				}
				else{
					history="1 | "+displayLine+"\n0 | [paste][error] -> "+errorMsg;
				}
			}
			break;
		}
	}

	jQuery('.history_text').val(history); // запись истории
	return errorMsg="false"; // сброс текста ошибки для кнопок
}

function calculationLocal(displayLine){ // локальные вычисления
	displayLine=displayLine.replace(/\s+/g,""); // удаление пробелов

	var comma=displayLine.match(/[,]/g)!=null ? displayLine.match(/[,]/g).length : 0, // количество запятых
		pow=0;

	if(/^[0-9-+*/().,sqrtpow]*$/.test(displayLine)){ // проверка на лишние символы
		var resultCalculation=0;

		if (/pow/g.test(displayLine)){ // замена команды pow на Math.pow
			pow= displayLine.match(/(pow)/g).length;
			displayLine=displayLine.replace(/pow/g, "Math.pow");
		}
		if (/sqrt/g.test(displayLine)){ // замена команды sqrt на Math.sqrt
			displayLine=displayLine.replace(/sqrt/g,"Math.sqrt");
		}

		try{
			if(comma>pow){throw "SyntaxError: Unexpected token ','"} // отлов ошибки при лишних запятых
			resultCalculation=eval(displayLine); // преобразование строки в код (для выполнения вычислений)
		}
		catch(err){
			returnValueGlobal[0]=true;
			returnValueGlobal[1]=err+'.';
			return;
		}

		if(isNaN(resultCalculation)){ // отлов ошибки если результат NaN
			returnValueGlobal[0]=true;
			returnValueGlobal[1]="SyntaxError: Invalid or unexpected token.(NaN)";
		}
		else{ // присвоение returnValueGlobal результата
			returnValueGlobal[0]=false;
			returnValueGlobal[1]=resultCalculation;
		}
	}
	else{
		returnValueGlobal[0]=true;
		returnValueGlobal[1]="SyntaxError: Unknown token.";
	}
}

function calculationServer(displayLine){ // серверные вычисления
	jQuery.ajax({
		type: "POST",
		url: "includes/ajax/calculationServer.php",
		data: "displayLine="+encodeURIComponent(displayLine), // POST отправка текста на дисплее с кодировкой некоторых символов  
		dataType: 'json',
		cache: false,
		success: function(resultCalculation){
			returnValueGlobal[0]=resultCalculation[0];
			returnValueGlobal[1]=resultCalculation[1];
		}
	});
}

function rules(){ // выполняет работу блока отвечающего за правила 
	jQuery('.rules').on("click",function(e){ // при клике на кнопку 'rules' добавит блоки
		jQuery('body').prepend("<div class='background_rules'><div class='container_rules'><div class='title_rules'>RULES</div><div class='close_rules'>close</div><hr/></div></div>");
		jQuery('.close_rules').bind("click", function(){ // кнопка 'close'
			jQuery(this).unbind("click");
			jQuery('.background_rules').remove();
		});

		jQuery.ajax({
			type: "POST",
			url: "includes/ajax/readRules.php",
			dataType: 'json',
			cache: false,
			success: function(text){
				var htmlInfoProject="<div class='text_rules'>[error] -> File not found.</div>";

				if (text!="error"){
					htmlInfoProject = "<div class='text_rules'>"+text+"</div>";
				}

				jQuery('.container_rules').prepend(htmlInfoProject); // вывод текста полученого из txt файла
			}
		});

	});
}

function typeCalculation(){ // тип вычислений (local|server) 
	jQuery('.local, .server').on("click", function(){ // при клике на server или local
		var type=jQuery.cookie('typeCalculation'); // получения типа вычислений из cookie

		if(type!=this.className){ // если полученый тип не равен нажатой кнопке
			if(this.className=='server'){ // если нажатая кнопка server
				jQuery.cookie('typeCalculation','server'); 
				jQuery('.local').css("text-shadow","none"); 
				jQuery('.server').css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
			}
			else{  // если нажатая кнопка local
				jQuery.cookie('typeCalculation','local');
				jQuery('.server').css("text-shadow","none");
				jQuery('.local').css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
			}
		}
	});

	if(jQuery.cookie('typeCalculation')!=null){ // при запуске страницы проверяет какой тип вычислений должен выполнятся
		jQuery('.'+jQuery.cookie('typeCalculation')).css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
	}
	else{
		jQuery.cookie('typeCalculation', 'local');
		jQuery('.local').css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
	}
}