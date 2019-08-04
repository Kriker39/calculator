var returnValueGlobal=[true,"SyntaxError: Invalid or unexpected token.(NaN)"];

jQuery('document').ready(function(){
	typeCalculation();

	workCalculator();

	rules();
});

function workCalculator(){// основная часть работы калькулятора
	var saveDisplayLine="empty",
		typeCalculation;

	jQuery('.panel button').on("click", function(){// событие клика на кнопку на панеле
		var displayLine= jQuery('.display').val(), // текст на дисплее
			buttonOption= jQuery(this).attr("name"), // команда кнопки
			errorMsg="false";

			if(buttonOption=="=") // кнопка `равно`
			{
				saveDisplayLine=displayLine;

				typeCalculation= jQuery.cookie('typeCalculation');
				if(typeCalculation==null){
					typeCalculation= "local";
				}

				if(typeCalculation=="local"){
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
				else if(typeCalculation=="server"){
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
				
				if(displayLine.replace(" ","").length!=0){
					navigator.clipboard.writeText(displayLine).catch(err => {
						errorMsg=err;
					});
				}
				else{
					errorMsg="Data could not be copied because input field is empty.";
				}
			}
			else if(buttonOption=="paste"){ // кнопка `вставить`
				navigator.clipboard.readText().then(text => {
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
			else{ // кнопка `0`-`9`, `+`, `-`, `*`, `/`, `.`, `(`, `)`
				displayLine+= buttonOption;
			}
			
			setTimeout(function(){
				jQuery('.display').val(displayLine); // вывод отредактированого текста на дисплей
				history(buttonOption, saveDisplayLine, errorMsg);
				returnValueGlobal=[true,"SyntaxError: Invalid or unexpected token.(NaN)"];
			}, 30);
	});
}

function history(buttonOption, saveDisplayLine, errorMsg){

	var history= jQuery('.history_text').val(),
	firstLine,
	numFirstLine,
	displayLine=jQuery(".display").val();

	while(true){
		if(history){
			firstLine= history.split("\n")[0];
			numFirstLine= firstLine.split(" | ")[0];

			if(parseInt(numFirstLine)>=0){
				if (buttonOption!="=" && buttonOption!="copy" && buttonOption!="paste"){
					history= numFirstLine+" | "+displayLine+history.replace(firstLine, "");
				}
				else if(buttonOption=="="){
					if (errorMsg=="false"){
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | "+saveDisplayLine+" = "+displayLine+ history.replace(firstLine, "");
					}
					else{
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [equals to][error] -> "+errorMsg+ history.replace(firstLine, "");
					}
				}
				else if(buttonOption=="copy"){
					if(errorMsg=="false"){
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [copy] -> "+displayLine+ history.replace(firstLine, "");
					}
					else{
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [copy][error] -> "+errorMsg+ history.replace(firstLine, "");
					}
				}
				else if(buttonOption=="paste"){
					if(errorMsg=="false"){
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [paste] -> "+displayLine+ history.replace(firstLine, "");
					}
					else{
						history=(+numFirstLine+1)+" | "+displayLine+"\n"+numFirstLine+" | [paste][error] -> "+errorMsg+ history.replace(firstLine, "");
					}
				}
				break;
			}
			else{
				history= history.split("\n")[1];
			}	
		}
		else{
			history= "0 | ";
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

	jQuery('.history_text').val(history);
	return errorMsg="false";
}

function calculationLocal(displayLine){
	displayLine=displayLine.replace(/\s+/g,""); // удаление пробелов

	var comma=displayLine.match(/[,]/g)!=null ? displayLine.match(/[,]/g).length : 0,
		pow=0;

	if(/^[0-9-+*/().,sqrtpow]*$/.test(displayLine)){
		var resultCalculation=0;

		if (/pow/g.test(displayLine)){
			pow= displayLine.match(/(pow)/g).length;
			displayLine=displayLine.replace(/pow/g, "Math.pow");
		}
		if (/sqrt/g.test(displayLine)){
			displayLine=displayLine.replace(/sqrt/g,"Math.sqrt");
		}

		try{
			if(comma>pow){throw "SyntaxError: Unexpected token ','"}
			resultCalculation=eval(displayLine);
		}
		catch(err){
			returnValueGlobal[0]=true;
			returnValueGlobal[1]=err+'.';
			return;
		}

		if(isNaN(resultCalculation)){
			returnValueGlobal[0]=true;
			returnValueGlobal[1]="SyntaxError: Invalid or unexpected token.(NaN)";
		}
		else{
			returnValueGlobal[0]=false;
			returnValueGlobal[1]=resultCalculation;
		}
	}
	else{
		returnValueGlobal[0]=true;
		returnValueGlobal[1]="SyntaxError: Unknown token.";
	}
}

function calculationServer(displayLine){
	jQuery.ajax({
		type: "POST",
		url: "includes/ajax/calculationServer.php",
		data: "displayLine="+encodeURIComponent(displayLine),
		dataType: 'json',
		cache: false,
		success: function(resultCalculation){
			returnValueGlobal[0]=resultCalculation[0];
			returnValueGlobal[1]=resultCalculation[1];
			
		}
	});
}

function rules(){
	jQuery('.rules').on("click",function(e){
		jQuery('body').prepend("<div class='background_rules'><div class='container_rules'><div class='title_rules'>RULES</div><div class='close_rules'>close</div><hr/></div></div>");
		jQuery('.close_rules').bind("click", function(){
			jQuery(this).unbind("click");
			jQuery('.background_rules').remove();
		});

		jQuery.ajax({
			type: "POST",
			url: "includes/ajax/readRules.php",
			dataType: 'json',
			cache: false,
			success: function(text){
				var htmlInfoProject="File not found.";

				if (text!="error"){
					htmlInfoProject = "<div class='text_rules'>"+text+"</div>";
				}

				jQuery('.container_rules').prepend(htmlInfoProject);
			}
		});

	});
}

function typeCalculation(){
	jQuery('.local, .server').on("click", function(){
		var type=jQuery.cookie('typeCalculation');
		if(type!=this.className)
		{
			if(this.className=='server'){
				jQuery.cookie('typeCalculation','server');
				jQuery('.local').css("text-shadow","none");
				jQuery('.server').css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
			}
			else{
				jQuery.cookie('typeCalculation','local');
				jQuery('.server').css("text-shadow","none");
				jQuery('.local').css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
			}
			
		}
	});

	if(jQuery.cookie('typeCalculation')!=null){
		jQuery('.'+jQuery.cookie('typeCalculation')).css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
	}
	else{
		jQuery.cookie('typeCalculation', 'local');
		jQuery('.local').css("text-shadow","3px 3px 20px green, -3px 3px 20px green, 3px -3px 20px green, -3px -3px 20px green");
	}
}