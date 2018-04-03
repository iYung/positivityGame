var score = localStorage.getItem("postivityGame_positivityScore");
var user = localStorage.getItem("postivityGame_username");
var id = localStorage.getItem("postivityGame_userID");
var rank = localStorage.getItem("postivityGame_userRank");

if (id) {
    onLoginSuccessful();
} else {
    document.getElementById("newUserButton").addEventListener("click",userCreate);
}

function userCreate() {
    var newUser = prompt("Enter your desired username below:");
    //poll server
    localStorage.setItem("postivityGame_positivityScore", "0");
    localStorage.setItem("postivityGame_username", newUser);
    localStorage.setItem("postivityGame_userID", "adadaada23523");
    //waits for local storage to update variables before updating the popup with user info
    (function waitForLocalStorage(){
         if (localStorage.getItem("postivityGame_username") === newUser) {
            onLoginSuccessful();
         } else {
            setTimeout(waitForLocalStorage, 10);
         }
    })();
}

function onLoginSuccessful() {
    var buttons = document.getElementById("buttons");
    buttons.parentNode.removeChild(buttons);
    document.getElementById("userName").innerHTML = localStorage.getItem("postivityGame_username");
    document.getElementById("userScore").innerHTML = score;
}