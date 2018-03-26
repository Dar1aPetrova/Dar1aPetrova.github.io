var arr= ['0C', '0D', '0H', '0S', '2C', '2D','2H', '2S', '3C', '3D','3H', '3S', '4C', '4D','4H', '4S','5C', '5D','5H', '5S','6C', '6D', '6H', '6S', '7C', '7D','7H', '7S', '8C', '8D','8H', '8S', '9C', '9D','9H', '9S','AC', 'AD','AH', 'AS', 'JC', 'JD','JH', 'JS', 'QC', 'QD','QH', 'QS','KC', 'KD','KH', 'KS'];
var matchedCounter = 0;
var currentScore=0;

function setImages()
{
	arr.sort((a,b) => Math.random()-0.5 );
	let currentArr = arr.slice(0,9);
	currentArr= currentArr.concat(currentArr);
	currentArr.sort((a,b) => Math.random()-0.5 );

	let cards = field.querySelectorAll(".card-hidden");
	for(var i=0; i<cards.length; i++)
	{
		cards[i].style.background = "url(Cards/" +currentArr[i]+".png) 50% 50% / 100% 100% no-repeat white";
	}
}
function rotateCard(event)
{
	if(event.target.className == "wrapper")
	{
		event.target.classList.add("card-rotation","opened"); //поворачиваем карту 
		setTimeout(() => event.target.firstElementChild.style.display = 'block', 200); //делаем картинку видной
		soundCard();
		let cardOpened = field.querySelectorAll(".opened");
		if(cardOpened.length ==2) compareCards(); 
	}
}
function soundCard()
{
	var audioCard = new Audio();
	audioCard.src = 'Sounds/card.mp3';
	audioCard.autoplay = true;
}
function compareCards()
{
	let cardOpened = field.querySelectorAll(".opened");
	cardOpened[0].classList.remove("opened"); 
	cardOpened[1].classList.remove("opened");
	setTimeout( ()=> {	
		if(cardOpened[0].firstElementChild.style.background== cardOpened[1].firstElementChild.style.background) //совпадение
		{			
			cardOpened[0].classList.add('matched');  //убираем с поля
			cardOpened[1].classList.add('matched');
			matchedCounter ++;
			currentScore += 42*(9 - matchedCounter); //считаем баллы
			score.innerHTML = currentScore;
			if(matchedCounter == 9) gameOver();// если нашли пару для всех
		}
		else //разные
		{ 
			cardOpened[0].classList.remove("card-rotation"); //разворачиваем карту
			cardOpened[1].classList.remove("card-rotation");
			soundCard();
			setTimeout(() =>{
							 cardOpened[0].firstElementChild.style.display = 'none'; //скрываем картинку
							 cardOpened[1].firstElementChild.style.display = 'none'
							}, 200);
			
			currentScore -= 42 * matchedCounter; //считаем баллы
			score.innerHTML = currentScore;	
		} 
	},600);
}
function gameOver()
{
	finalScore.innerHTML = currentScore;
	modal.style.display = 'flex'
	if(currentScore>0)
	{
		soundWin();
		result.innerHTML = "Поздравляем!"
	}
	else 
	{
		soundFail();
		result.innerHTML = "Вы проиграли!"
	}
}
function soundWin()
{
	var audioWin = new Audio();
	audioWin.src = 'Sounds/win.mp3';
	audioWin.autoplay = true;
}
function soundFail()
{
	var audioFail = new Audio();
	audioFail.src = 'Sounds/fail.mp3';
	audioFail.autoplay = true;
}
function showAllCards()
{
	let cards = field.querySelectorAll(".wrapper");
	soundCard();
	for( let i=0; i<cards.length; i++)
	{
		cards[i].classList.add('card-rotation', 'opened'); //поворачиваем карту 
		setTimeout(() => cards[i].firstElementChild.style.display = 'block', 200); //делаем картинку видной
	}
}
function rotateAllCards()
{
	let cards = field.querySelectorAll(".wrapper");
		soundCard();
		for( let i=0; i<cards.length; i++)
		{
			cards[i].classList.remove('card-rotation', 'opened'); //поворачиваем карту
			
			setTimeout(() => cards[i].firstElementChild.style.display = 'none', 100); //скрываем картинку
			setTimeout(() => cards[i].classList.remove('matched'), 200); //добавляем на поле убранные ранее карты
		}
}
function restartGame()
{
	currentScore=0;
	score.innerHTML = 0;
	matchedCounter =0;	
	rotateAllCards();
	setTimeout(()=>{
					setImages();
					showAllCards();
	}, 250);
	setTimeout(rotateAllCards, 5250);	
}


field.addEventListener('click', rotateCard);
document.getElementsByClassName('restart')[0].addEventListener('click', restartGame);
document.getElementsByClassName('restart')[1].addEventListener('click', restartGame);
document.getElementsByClassName('restart')[1].addEventListener('click', ()=>modal.style.display = 'none');


setImages();
showAllCards();
setTimeout(rotateAllCards, 5000);
