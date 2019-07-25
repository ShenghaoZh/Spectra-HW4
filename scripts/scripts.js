function loadPage() {
	//getElementsByClassName得到的是数组所以之后要[i]
	//getElementById的到单体，注意Element区别上面Elements
	//querySelector('.progressbar')选中第一项
	var pbar = document.getElementsByClassName("progress-bar");
	var ptext = document.getElementsByClassName("progress-text");
	var width = 1;
	var timer = setInterval(frame, 10);
	function frame() {
		if (width >= 100) {
			clearInterval(timer);
		} else {
			width++; 
			for(let i = 0; i < pbar.length; i++) {	//因为getElementsByClassName得到的是array
				pbar[i].style.width = width + '%';
			}
			for(let i = 0; i < ptext.length; i++) {
				if(width < 100) ptext[i].innerHTML = width + "%";
				else ptext[i].innerHTML = "Finished"
			}

		}
	}
}
//<body onload="fn()"> 效果相似于jQuery的$(document).ready(fn());



// fetch("https://swapi.co/api/people")
// 	.then(response => response.json())
// 	.then(console.log);
let api = "https://swapi.co/api/people/?page=";
let people = [];
let count = 1;
													// 打印API时有next，可以不用for语句。
for(let i = 1; i <= 9; i++) {
	//console.log(api+i);
	fetch(api + i)
		.then(response => response.json())
		.then(function(data) {
			for(let j = 0; j < data.results.length; j++) {
				//console.log(data.results[j].name); 
													// 每一次打出来人名顺序不一样，但是总数都是87
				//console.log(count);
				//count++;
				people.push(data.results[j].name);
			}
			if(i == 9) loadTypeahead();
													// fetch需要时间，如果不放在then里，传递的people==[]
													// 测试setTimeout(loadTypeahead,1000)
		})
}
//console.log(people);								// 打印不出来people，原因见上
function loadTypeahead(){			
	let starWar = new Bloodhound({
													// 注意有个's'
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: people
	});
													//jQuery用
	$('.typeahead').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'character',
		source: starWar
	});
}

document.querySelector(".typeahead").addEventListener("keydown", function(){
	let inputName = document.querySelector(".typeahead");
	let tableName = document.querySelector(".people-name");
	let tableBirth = document.querySelector(".people-birth");
	console.log(inputName.value);
	fetch("https://swapi.co/api/people/?search=" + inputName.value)
		.then(response => response.json())
		.then(function(data) {
			if(inputName.value.toLowerCase().slice(0,2) == data.results[0].name.toLowerCase().slice(0,2)) {
				tableName.innerHTML = data.results[0].name;
				tableBirth.innerHTML = data.results[0].birth_year;
			}
			else{ 
				tableName.innerHTML = "null";
				tableBirth.innerHTML = "null";
			}
		});
});


let arr = [ 'CA', 'AZ', 'WA', 'NY', 'OR', 'TX', 'TS', 'ML', 'MX' ];
autocomplete=document.querySelector(".autocomplete")
autocomplete.addEventListener("input",function(){
	clearBlock();
	let context = this;
	let val = context.value;
	if(!val) return false;
	block = document.createElement("div");
	block.setAttribute("class", "extender")
	block.setAttribute("id", "extender-" + this.id);
	context.parentNode.appendChild(block);
													//处理相互关系
	for(let i = 0; i < arr.length; i++) {
		for(let j = 0; j< arr.length; j++) {
			if(val.toUpperCase() == arr[i].substr(j,val.length).toUpperCase()) {
				item=document.createElement("div");
				item.innerHTML = arr[i].substr(0, j) //加粗
				item.innerHTML += "<b>" + arr[i].substr(j,val.length) + "</b>";
				item.innerHTML += arr[i].substr(j+val.length);
				item.innerHTML += "<input type = 'hidden' value='" + arr[i] + "'>";
				item.addEventListener("click", function() {
					autocomplete.value = this.getElementsByTagName("input")[0].value;
					clearBlock();
				});
				block.appendChild(item);
			}
		}

	}
});
function clearBlock() {
	let items = document.getElementsByClassName("extender")
	for (let i = 0; i < items.length; i++) {
		items[i].parentNode.removeChild(items[i]);
	}
}

let score = 0;
let a,b,c;
function randomNum(int) {
	return Math.floor(Math.random() * int);
}
function randomM() {
	a = randomNum(8);
	b = randomNum(8);
	while(b == a) {
		b = randomNum(8);
	}
	c = randomNum(8);
	while(c == a || c == b) {
		c = randomNum(8);
	}
}

let cells = document.getElementsByClassName("cell");
let count2;
count2 = 0;

function sleep(numberMillis){
    var now = new Date(); 
    var exitTime = now.getTime() + numberMillis; 
    while (true) { 
        now = new Date(); 
        if (now.getTime() > exitTime) 
        return;
    }
}
let flag = 0;
for(let i = 0; i < cells.length; i++)
{
	cells[i].addEventListener("click", function(){
		if(flag == 0) {
			flag = 1;
			count2++;
			cells[i].style.backgroundColor = "rgb(0,220,50)"
			if(i == a || i == b || i == c) {
				cells[i].innerHTML = "M";
				score++;
				document.getElementsByClassName("score")[0].innerHTML = "<h1>Score: " + score + "</h1>";
			}
			randomM();
			setTimeout(function() {
				cells[i].style.backgroundColor = "rgb(0,110,50)"
				cells[i].innerHTML = "&nbsp";
				flag = 0;
			},500);
			setTimeout(function() {
				if(count2 == 9) {
					count2 = 0;
					alert("your score is:" + score);
					score = 0;
					document.getElementsByClassName("score")[0].innerHTML = "<h1>Score: " + score + "</h1>";
				}
			},503);
		}
		
		
		//sleep(1000);
		// cells[i].style.backgroundColor = "rgb(0,220,50)";
		// cells[i].innerHTML = "&nbsp";
		// randomM();
	});
	// cells[i].addEventListener("click", handleClick(i));
	// console.log("a" + i);
}
													//为什么引用方程，会在click没发生就运行一次 ???
													//code要写在引用的方程的return function(){ }里 !!!
// function handleClick(x) {
// 	console.log("b" + x);
// 	cells[x].style.backgroundColor = "rgb(0,110,50)";
// }








