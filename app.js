var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var users = new Array();
var upMove;
var downMove;
var leftMove;
var rightMove;
var node;
var tmpnode;
var tmpnode_2;
var textnode;
var numberOfBalls;
var fivePointballColour;
var fifteenPointballColour;
var TwentyfivePointvallColour;
var gameDuration;
var numOfGhosts;

$(document).ready(function() {
	context = canvas.getContext("2d");
	openHome();
	//default values//
	users[0] = ["k","k"];
	upMove = 38;
	downMove = 40;
	leftMove = 37;
	rightMove = 39;
	numberOfBalls = 70;
	gameDuration = 100;

});

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 25 ; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 20; j++) {
			if (
				(i == 0) || (j==0) ||
				(i == 24) || (j == 19) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 25);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[upMove]) {
		return 1;
	}

	if (keysDown[downMove]) {
		return 2;
	}
	if (keysDown[leftMove]) {
		return 3;
	}
	if (keysDown[rightMove]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 25; i++) {
		for (var j = 0; j < 20; j++) {
			var center = new Object();
			center.x = i * 40 + 30;
			center.y = j * 40 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "white"; //color
				context.fill();
			} else if (board[i][j] == 4) {

				wall_img = new Image(10,10);
				wall_img.src = "./images/wall.png";
				context.drawImage(wall_img,center.x-35, center.y-35, 50, 50);

			}
		}
	}
}

function roundedRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + height - radius);
	ctx.arcTo(x, y + height, x + radius, y + height, radius);
	ctx.lineTo(x + width - radius, y + height);
	ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
	ctx.lineTo(x + width, y + radius);
	ctx.arcTo(x + width, y, x + width - radius, y, radius);
	ctx.lineTo(x + radius, y);
	ctx.arcTo(x, y, x, y + radius, radius);
	ctx.stroke();
  }

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 19 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 24 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("menu").style.top = "0";
  } else {
    document.getElementById("menu").style.top = "-50px";
  }
}

function openHome(){
	document.getElementById("register_div").style.display = "none";
	document.getElementById("login_page").style.display = "none";
	document.getElementById("setting_page").style.display = "none";
	document.getElementById("about_page").style.display = "none";
	document.getElementById("GameOn").style.display = "none";
	document.getElementById("home_div").style.display = "block";
	

}

function registerpage(){
	clear_submition();
	document.getElementById("login_page").style.display = "none";
	document.getElementById("home_div").style.display = "none";
	document.getElementById("setting_page").style.display = "none";
	document.getElementById("about_page").style.display = "none";
	document.getElementById("GameOn").style.display = "none";
	document.getElementById("register_div").style.display = "block";
	

}

function clear_submition(){
	document.getElementById("username_input").value = "Enter user name";
	document.getElementById("password_input").value = "Enter Password";
	document.getElementById("fullname_input").value = "Enter Full name";
	document.getElementById("email_input").value = "Enter E-mail";
	document.getElementById("birthday_input").value = "1990-01-01";
}

function submit(){
	const regExp_letter = /.*[a-zA-Z].*/;
	const regExp_number = /.*[0-9].*/;
	const regExp_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	if ($("#username_input").val() == "Enter user name" || $("#username_input").val() == '' ||
	$("#password_input").val() == "Enter Password" || $("#password_input").val() == '' ||
	$("#fullname_input").val() == "Enter Full name" || $("#fullname_input").val() == '' ||
	$("#email_input").val() == "Enter E-mail" || $("#email_input").val() == '')
	{
		window.alert("One or More details was not entered.");
		return;
	}

	if ($("#password_input").val().length < 6 || !regExp_letter.test($("#password_input").val()) || !regExp_number.test($("#password_input").val()))
	{
		window.alert("the password is in correct. the password should contain at least one letter and at least one number and the password must be at least 6 characters.");
		return;
	}

	if (regExp_number.test($("#fullname_input").val()))
	{
		window.alert("the full name shouldn't contain numbers.");
		return;
	}

	if (!regExp_email.test($("#email_input").val()))
	{
		window.alert("The E-mail is not vaild.");
		return;
	}

	for (i = 0 ; i < users.length ; i++){
		if (users[i][0] == $("#username_input").val()){
			window.alert("this username is already in use");
			return;
		}
	}

	users.push([$("#username_input").val(), $("#password_input").val()]);
	
	window.alert("submition succesful");
}

function loginpage(){
	document.getElementById("home_div").style.display = "none";
	document.getElementById("register_div").style.display = "none";
	document.getElementById("setting_page").style.display = "none";
	document.getElementById("about_page").style.display = "none"
	document.getElementById("GameOn").style.display = "none";
	document.getElementById("login_page").style.display = "block";

}

function login(){
	for (i = 0; i < users.length ; i++){
		if (users[i][0] == $("#username_login_input").val()){
			if (users[i][1] == $("#password_login_input").val())
				settingpage();
				return;
		}
	}

	window.alert("this user is not exist.");
}

function settingpage(){
	document.getElementById("login_page").style.display = "none";
	document.getElementById("home_div").style.display = "none";
	document.getElementById("register_div").style.display = "none";
	document.getElementById("editKey").style.display = "none";
	document.getElementById("saveMessage").style.display = "none";
	document.getElementById("about_page").style.display = "none";
	document.getElementById("GameOn").style.display = "none";
	document.getElementById("setting_page").style.display = "block";
}

function chooseKeyBoard(e, text){
	$("#inputKeyBoard").val("Please enter your key...");
	removeAllChildren(document.getElementById("saveMessage"));
	document.getElementById("editKey").style.display = "block";
	switch (text){
		case 'up':
			document.getElementById("inputKeyBoard").onkeydown = editKeyUp;
			tmp_nodes();
			break;
		case 'down':
			document.getElementById("inputKeyBoard").onkeydown = editKeyDown;
			tmp_nodes();
			break;
		case 'left':
			document.getElementById("inputKeyBoard").onkeydown = editKeyLeft;
			tmp_nodes();
			break;
		case 'right':
			document.getElementById("inputKeyBoard").onkeydown = editKeyRight;
			tmp_nodes();
			break;
	}
}

function tmp_nodes(){
	node = document.createElement("h4");
	node.setAttribute("id", "node_h4");
	tmpnode = document.createElement("p");
	tmpnode.setAttribute("id", "tmpnode");
	node.appendChild(tmpnode);
	document.getElementById("saveMessage").appendChild(node);
}

function editKeyUp(e){
	upMove = e.keyCode;

	let tmpval = checkArrow(e.keyCode);
	if (tmpval != '')
		tmpnode_2 = document.createTextNode("The key "+ tmpval + " saved.");
	else
		tmpnode_2 = document.createTextNode("The key "+String.fromCharCode((96 <= upMove && upMove <= 105) ? upMove-48 : upMove) + " saved.");

	node.replaceChild(tmpnode_2,tmpnode);
	tmpnode = tmpnode_2;
	document.getElementById("saveMessage").appendChild(node);
	document.getElementById("saveMessage").style.display = "block";
	$("#inputKeyBoard").val('');
}

function editKeyDown(e){
	downMove = e.keyCode;

	let tmpval = checkArrow(e.keyCode);
	if (tmpval != '')
		tmpnode_2 = document.createTextNode("The key "+ tmpval + " saved.");
	else
		tmpnode_2 = document.createTextNode("The key "+  String.fromCharCode((96 <= downMove && downMove <= 105) ? downMove-48 : downMove) + " saved.");

	node.replaceChild(tmpnode_2,tmpnode);
	tmpnode = tmpnode_2;
	document.getElementById("saveMessage").appendChild(node);
	document.getElementById("saveMessage").style.display = "block";
	$("#inputKeyBoard").val('');
}

function editKeyLeft(e){
	leftMove = e.keyCode;

	let tmpval = checkArrow(e.keyCode);
	if (tmpval != '')
		tmpnode_2 = document.createTextNode("The key "+ tmpval + " saved.");
	else
		tmpnode_2 = document.createTextNode("The key "+ String.fromCharCode((96 <= leftMove && leftMove <= 105) ? leftMove-48 : leftMove) + " saved.");

	node.replaceChild(tmpnode_2,tmpnode);
	tmpnode = tmpnode_2;
	document.getElementById("saveMessage").appendChild(node);
	document.getElementById("saveMessage").style.display = "block";
	$("#inputKeyBoard").val('');
}

function editKeyRight(e){
	rightMove = e.keyCode;

	let tmpval = checkArrow(e.keyCode);
	if (tmpval != '')
		tmpnode_2 = document.createTextNode("The key "+ tmpval + " saved.");
	else
		tmpnode_2 = document.createTextNode("The key "+ String.fromCharCode((96 <= rightMove && rightMove <= 105) ? rightMove-48 : rightMove) + " saved.");

	node.replaceChild(tmpnode_2,tmpnode);
	tmpnode = tmpnode_2;
	document.getElementById("saveMessage").appendChild(node);
	document.getElementById("saveMessage").style.display = "block";
	$("#inputKeyBoard").val('');
}

function removeAllChildren(element) {
	while (element.firstChild) {
	  element.removeChild(element.firstChild)
	}
  }
function chooseNumberBalls(val) {

	document.getElementById("numberballs").innerHTML = val;  
	document.getElementById("numberballs").display = "block";
	
}

function chooseTimeGame(val) {

	document.getElementById("timeGame").innerHTML = val;  
	document.getElementById("timeGame").display = "block";
	
}

function chooseGhosts(val) {

	document.getElementById("ghosts").innerHTML = val;  
	document.getElementById("ghosts").display = "block";
	
}

function startGame(){
	//save here all elements we need.
	numberOfBalls = $("#inputScaleBalls").val();
	fivePointballColour = $("#ball5").val();
 	fifteenPointballColour = $("#ball15").val();
 	TwentyfivePointvallColour = $("#ball25").val();
	gameDuration = $("#inputTimeGame").val();
	numOfGhosts = $("#inputGhost").val();
	document.getElementById("login_page").style.display = "none";
	document.getElementById("home_div").style.display = "none";
	document.getElementById("register_div").style.display = "none";
	document.getElementById("editKey").style.display = "none";
	document.getElementById("saveMessage").style.display = "none";
	document.getElementById("about_page").style.display = "none"
	document.getElementById("setting_page").style.display = "none";
	document.getElementById("GameOn").style.display = "block";

	

	if (checkArrow(upMove) == 'up')
		document.getElementById("arrowup_s").innerHTML = 'up';
	else
		document.getElementById("arrowup_s").innerHTML = String.fromCharCode((96 <= upMove && upMove <= 105) ? upMove-48 : upMove);

	if (checkArrow(downMove) == 'down')
		document.getElementById("arrowdown_s").innerHTML = 'down';
	else
		document.getElementById("arrowdown_s").innerHTML = String.fromCharCode((96 <= downMove && downMove <= 105) ? downMove-48 : downMove);

	if (checkArrow(rightMove) == 'right')
		document.getElementById("arrowright_s").innerHTML = 'right';
	else
		document.getElementById("arrowright_s").innerHTML = String.fromCharCode((96 <= rightMove && rightMove <= 105) ? rightMove-48 : rightMove);

	if (checkArrow(leftMove) == 'left')
		document.getElementById("arrowleft_s").innerHTML = 'left';
	else
		document.getElementById("arrowleft_s").innerHTML = String.fromCharCode((96 <= leftMove && leftMove <= 105) ? leftMove-48 : leftMove);

	$("#inputScaleBalls_s").val(numberOfBalls);
	$("#numberballs_s").val(numberOfBalls);
	$("#ball5_s").val(fivePointballColour);
	
	$("#ball15_s").val(fifteenPointballColour);

	$("#ball25_s").val(TwentyfivePointvallColour);

	$("#inputTimeGame_s").val(gameDuration);
	$("#timeGame_s").val(gameDuration);
	
	$("#inputGhost_s").val(numOfGhosts);
	$("#ghosts_s").val(numOfGhosts);

	Start();
}

function aboutPage(){
	document.getElementById("about_page").style.display = "block";
	

	//click X
	(document.getElementsByClassName("close")[0]).onclick = function() {
		document.getElementById("about_page").style.display = "none";
	}
	// click outside dialog


	var dialog = document.getElementsByTagName('dialog')[0];
    dialog.showModal();
    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
          && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
			document.getElementById("about_page").style.display = "none";
			dialog.close();
			return;
        }
    });


	// click ESC
	window.addEventListener('keydown', function (event) {
	if (event.key === 'Escape') {
		document.getElementById("about_page").style.display = "none";

		return;
	}
	})

}

function checkArrow(val){
	
	if (val == 38)
		return 'up';
	else if (val == 40)
		return 'down';
	else if (val == 39)
		return 'right';
	else if (val == 37)
		return 'left';
	else 
		return '';

}

function randonDetails(){

	let num_balls = getRndInteger(50,90);
	$("#inputScaleBalls").val(num_balls);
	$("#numberballs").val(num_balls);

	let five_colour = '#' + Math.floor(Math.random()*16777215).toString(16);
	$("#ball5").val(five_colour);

	let fifteen_colour = '#' + Math.floor(Math.random()*16777215).toString(16);
	$("#ball15").val(fifteen_colour);

	let Twentyfive_colour = '#' + Math.floor(Math.random()*16777215).toString(16);
	$("#ball25").val(Twentyfive_colour);

	let game_dur = getRndInteger(60,180);
	$("#inputTimeGame").val(game_dur);
	$("#timeGame").val(game_dur);
	
	let num_ghost = getRndInteger(1,4);
	$("#inputGhost").val(num_ghost);
	$("#ghosts").val(num_ghost);

	numberOfBalls = $("#inputScaleBalls").val();
	fivePointballColour = $("#ball5").val();
 	fifteenPointballColour = $("#ball15").val();
 	TwentyfivePointvallColour = $("#ball25").val();
	gameDuration = $("#inputTimeGame").val();
	numOfGhosts = $("#inputGhost").val();
}

function contact(){

	aboutPage();

}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
