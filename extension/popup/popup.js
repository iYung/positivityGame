var score = localStorage.getItem("postivityGame_positivityScore");
var user = localStorage.getItem("postivityGame_username");
var id = localStorage.getItem("postivityGame_userID");
var rank = localStorage.getItem("postivityGame_userRank");

document.getElementById("resetButton").addEventListener("click",resetData);

if (id) {
    onLoginSuccessful();
} else {
    document.getElementById("newUserButton").addEventListener("click",userCreate);   
}

function userCreate() {
    var newUser = prompt("Enter your desired username below:");
    var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://positivity-game-iyung.c9users.io/api/create', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var response = JSON.parse(xhr.response);
                console.log(response);
                localStorage.setItem("postivityGame_positivityScore", "0");
                localStorage.setItem("postivityGame_username", newUser);
                localStorage.setItem("postivityGame_userID", "adadaada23523");
                localStorage.setItem("postivityGame_userRank", "No rank yet");
                //waits for local storage to update variables before updating the popup with user info
                (function waitForLocalStorage(){
                     if (localStorage.getItem("postivityGame_username") === newUser) {
                        onLoginSuccessful();
                     } else {
                        setTimeout(waitForLocalStorage, 10);
                     }
                })();
            }
        }
    var data = JSON.stringify({"username": newUser});
    xhr.send(data);
}

function resetData(){
    localStorage.removeItem("postivityGame_positivityScore");
    localStorage.removeItem("postivityGame_username");
    localStorage.removeItem("postivityGame_userID");
    localStorage.removeItem("postivityGame_userRank");
}

function onLoginSuccessful() {
    var buttons = document.getElementById("buttons");
    buttons.parentNode.removeChild(buttons);
    document.getElementById("userName").innerHTML = localStorage.getItem("postivityGame_username");
    document.getElementById("userScore").innerHTML = score;
    document.getElementById("userRank").innerHTML = rank;
}