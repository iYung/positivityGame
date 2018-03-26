var score = localStorage.getItem("postivityGame_positivityScore");
var user = localStorage.getItem("postivityGame_username");
var id = localStorage.getItem("postivityGame_userID");

//if user already logged in, remove buttons
if (id){
    var buttons = document.getElementById("buttons");
    buttons.parentNode.removeChild(buttons);
} else {
    document.getElementById("newUserButton").addEventListener("click",userCreate);
    document.getElementById("loginButton").addEventListener("click",login);
}

function userCreate() {
    var newUser = prompt("Enter your desired username below:");
}

function login() {
    var inputId = prompt("Enter your id below:");
}
