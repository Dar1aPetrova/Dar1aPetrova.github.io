'use strict';

// Код валидации формы


function validateForm(obj) {
	var form = document.forms[obj.formId];
	form.addEventListener("blur", function checkElem(event){
		
		if(event.target.dataset.hasOwnProperty("required") && !event.target.value)
		{
			event.target.classList.add(obj.inputErrorClass);
		}
		if(event.target.dataset.hasOwnProperty("validator"))
		{
			switch(event.target.dataset.validator)
			{
				case "letters": 
					if(/[^a-zа-яё]/i.test(event.target.value)) // нашел левые символы
						event.target.classList.add(obj.inputErrorClass); 
					break;
					
				case "number":
					let max = event.target.dataset.validatorMax || Infinity;
					let min =  event.target.dataset.validatorMin || -Infinity;
					if(isNaN(event.target.value)||
					 +event.target.value < +min ||
					 +event.target.value > +max) 
							event.target.classList.add(obj.inputErrorClass)
					break;
								
				case "regexp":
					let regExp = event.target.dataset.validatorPattern;
					if (event.target.value.search(regExp)!=-1 || !event.target.value)break;
					event.target.classList.add(obj.inputErrorClass); 
			}
		}
	} , true);

	form.addEventListener("focus", function checkElem(event){
		event.target.classList.remove(obj.inputErrorClass);
		},true);

	form.addEventListener('submit', function(event){
		event.preventDefault();
	});
	form.addEventListener('submit', checkForm);
	form.addEventListener("click", function(event){
		if (event.target.tagName === 'BUTTON')checkForm();
	});

	function checkForm()
	{
		form.classList.remove(obj.formValidClass, obj.formInvalidClass);
		var elems = form.getElementsByTagName("input");

		for(var i=0; i<elems.length; i++) 
		{
			if (elems[i].dataset.hasOwnProperty("required") && !elems[i].value)
				elems[i].classList.add(obj.inputErrorClass);
		
			if (elems[i].classList.contains(obj.inputErrorClass)) 
				form.classList.add(obj.formInvalidClass);
		}

		if (!form.classList.contains(obj.formInvalidClass))
			form.classList.add(obj.formValidClass);
	}
}