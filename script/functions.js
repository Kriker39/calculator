jQuery('document').ready(function(){
	jQuery('.panel button').on('click', function(e){
		var gotValue=e.target.value;
		if(gotValue=='CE'){
			setVOD("0");
		}
		else if (gotValue=='C') {
			if (getVOD() != 0 && getVOD().length<=1){
				setVOD("0");
			}
			else if(getVOD().length>1){
				setVOD(getVOD().substr(0, getVOD().length-1));
			}
		}
		else if (rules(gotValue)){
			if (gotValue=='('  && getVOD().length>=1 && +lastValue()==lastValue() || lastValue()==')')
			{
				setVOD(getVOD()+'*'+gotValue);	
			}
			else
			{
				setVOD(getVOD()+gotValue);
			}	
		}
		else if(gotValue=='='){
			try
			{
				setVOD(eval(getVOD()));
			}
			catch(e){
				jQuery(".display").select();
			}
		}
	});

	jQuery('.panel a').on('click', function(e){ // ф-ия для копирования
		var gotValue=e.target.name;
		if (gotValue=='copy')
		{
			var warning = confirm("Данные в буфере обмена будут измененны! Уверенны что хотите скопировать данные? ");
			if (warning==true){
				navigator.clipboard.writeText(getVOD()).then(()=> {
					alert("Данные скопированны.");
				})
				.catch(err => {
					alert("ERROR. Не удалост скопировать данные." + err);
				});
			}
		}
	});
});
function getVOD(){ //getValueOnDisplay
	jQuery('.display').focus();
	return jQuery('.display').val();
};
function setVOD(value)
{
	jQuery('.display').val(value);
}

function rules(value)
{
	var fullLastValue=getVOD().substr(findLIAS()+1), // последняя цифра на дисплее
	sumDot=findAllSymbol(fullLastValue, '.'); // количество точек в цифре

	if (((+lastValue()!=lastValue() && +value!=value) && (value!='(' && lastValue()!=')')) || // запрет на 2 знака подряд(+2 исключения на скобки)
		value=='=' || // запрет на знак =
		((+preLastValue()!=preLastValue() && preLastValue()!='.') && lastValue()==0 && value==0) || // ограничение для ввода двух 0 при дробовых числах
		(sumDot==1 && value=='.') // запрет на >1 точек в цифре
		)
	{
		return false;
	}
	else
	{
		if ((preLastValue()==0 && +value==value && getVOD().length<=1)||
			((value=='(' || value==')') && preLastValue()==0 && getVOD().length<=1)
			)
		{
			setVOD("");
		}
		return true;
	}
}


function findLIAS(){ // findLastIndexArithmeticSymbol - возвращает последний индекс арифметического символа
	arr=[symbolLIAS('+'), symbolLIAS('-'), symbolLIAS('*'), symbolLIAS('/')];  
	return Math.max(arr[0],arr[1],arr[2],arr[3]);
}

function symbolLIAS(sym){ // возвращает последний индекс указаного символа
	var  i=0, num=0, ind;
	while (num!=-1){
		ind=num;
		num= getVOD().indexOf(sym, i);
		i=num+1;
	}
	return ind;
}

function findAllSymbol(str,sym){ // возвращает количество указаного символа
	var  i=0, num=0, sum=0;
	while (num!=-1){
		sum++;
		num= str.indexOf(sym, i);
		i=num+1;
	}
	return sum-1;
}

function lastValue(){ // возвращает последний символ на дисплее
	return getVOD().substr(getVOD().length-1); 

}

function preLastValue(){ // возвращает предпоследний символ на дисплее(если символ всего 1, то вернет этот единственный символ)
	return getVOD().substr(getVOD().length-2,1); 
}