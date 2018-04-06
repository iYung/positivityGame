document.getElementById("resetButton").addEventListener("click",resetData);

var userData =  browser.storage.local.get("postivityGameData", data => {
    console.log(data.postivityGameData);
    if (data.postivityGameData) {
        onLoginSuccessful();
    } else {
        document.getElementById("newUserButton").addEventListener("click",userCreate);   
    }
});

function userCreate() {
    var newUser = prompt("Enter your desired username below:");
    if (newUser == null || newUser == "") {
        return;
    }
    var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://positivity-game-iyung.c9users.io/api/create', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var response = JSON.parse(xhr.response);
                var postivityGameData = {score: 0, username: newUser, id: response.userId, rank: "No rank yet"};
                browser.storage.local.set({ postivityGameData }).then(onLoginSuccessful);              
            }
        }
    var data = JSON.stringify({"username": newUser});
    xhr.send(data);
}

function resetData(){
    browser.storage.local.clear();
}

function onLoginSuccessful() {
    var buttons = document.getElementById("buttons");
    buttons.parentNode.removeChild(buttons);
    browser.storage.local.get("postivityGameData", newData => {
        document.getElementById("userName").innerHTML = newData.postivityGameData.username;
        document.getElementById("userScore").innerHTML = newData.postivityGameData.score;
        document.getElementById("userRank").innerHTML = newData.postivityGameData.rank;
    });
}