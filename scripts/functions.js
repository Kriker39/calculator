jQuery('document').ready(function(){
	typeCalculation();

	workCalculator();


	rules();
	
});

function workCalculator(){// основная часть работы калькулятора
	var saveDisplayLine="empty",
		resultCalculation=["bool error","msg/result"];

	jQuery('.panel button').on("click", function(){// событие клика на кнопку на панеле
		var displayLine= jQuery('.display').val(), // текст на дисплее
			buttonOption= jQuery(this).attr("name"), // команда кнопки
			errorMsg="false";

			if(buttonOption=="=") // кнопка `равно`
			{
				saveDisplayLine=displayLine;
				resultCalculation=clculationDisplayLine(displayLine);
				if(resultCalculation[0]==true){
					errorMsg=resultCalculation[1];
				}
				else{
					displayLine=resultCalculation[1];
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
			}, 5);
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

function clculationDisplayLine(displayLine){
	displayLine=displayLine.replace(/\s+/g,""); // удаление пробелов

	var returnValue=["bool error","msg/result"],
		comma=displayLine.match(/[,]/g)!=null ? displayLine.match(/[,]/g).length : 0,
		pow=0;

	if(/^[0-9-+*/().,sqrtpow]*$/.test(displayLine)){
		var resultCalculation=0;

		if (/pow/g.test(displayLine)){
			pow= displayLine.match(/(pow)/g).length;

			var p= displayLine.match(/[p]/g)!=null ? displayLine.match(/[p]/g).length : 0,
				o= displayLine.match(/[o]/g)!=null ? displayLine.match(/[o]/g).length : 0,
				w= displayLine.match(/[w]/g)!=null ? displayLine.match(/[w]/g).length : 0;

			if(pow==p && pow==o && pow==w){
				displayLine=displayLine.replace(/(pow)+/g, "Math.pow");
			}
		}
		if (/sqrt/g.test(displayLine)){
			var sqrt= displayLine.match(/(sqrt)/g).length,
				s= displayLine.match(/s/g)!=null ? displayLine.match(/[s]/g).length : 0,
				q= displayLine.match(/q/g)!=null ? displayLine.match(/[q]/g).length : 0,
				r= displayLine.match(/r/g)!=null ? displayLine.match(/[r]/g).length : 0,
				t= displayLine.match(/t/g)!=null ? displayLine.match(/[t]/g).length : 0;
			if(sqrt==s && sqrt==r && sqrt==r && sqrt==t){
				displayLine=displayLine.replace(/sqrt/g,"Math.sqrt");
			}
		}

		try{
			if(comma>pow){throw "SyntaxError: Unexpected token ','"}
			resultCalculation=eval(displayLine);
		}
		catch(err){
			returnValue[0]=true;
			returnValue[1]=err+'.';
			return returnValue;
		}

		if(isNaN(resultCalculation)){
			returnValue[0]=true;
			returnValue[1]="SyntaxError: Invalid or unexpected token.(NaN)";
		}
		else{console.log("3");
			returnValue[0]=false;
			returnValue[1]=resultCalculation;
		}
	}
	else{
		returnValue[0]=true;
		returnValue[1]="SyntaxError: Unknown token.";
	}

	return returnValue;
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
		jQuery('.local').css("text-shadow","0 0 20px green");
	}
}