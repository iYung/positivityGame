browser.storage.local.get("postivityGameData", data => {
    console.log(data.postivityGameData);
    if (data.postivityGameData) {
        onLoginSuccessful();
    } else {
        document.getElementById("newUserButton").addEventListener("click",userCreate);   
    }
});

browser.storage.local.get("postivityGameTopUsers", data => {
    if (data.postivityGameTopUsers) {
        console.log(data.postivityGameTopUsers);
        var table = document.getElementById("highScores");
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        data.postivityGameTopUsers.forEach( function(user, index) {
            var newRow = document.createElement("tr");
            var rankCell = document.createElement("td");
            rankCell.innerHTML = index + 1;
            newRow.appendChild(rankCell);
            var nameCell = document.createElement("td");
            nameCell.innerHTML = user['name'];
            newRow.appendChild(nameCell);
            var pointCell = document.createElement("td");
            pointCell.innerHTML = user['points'];
            newRow.appendChild(pointCell);
            table.appendChild(newRow);
        });
    }
});


function userCreate() {
    var newUser = prompt("Enter your desired username below:");
    if (newUser == null || newUser == "") {
        return;
    }
    var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://postivitygame.us-east-1.elasticbeanstalk.com/api/create', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var response = JSON.parse(xhr.response);
                var postivityGameData = {notifications: true, score: 0, username: newUser, id: response.userId, rank: "No rank yet"};
                browser.storage.local.set({ postivityGameData }).then(onLoginSuccessful);              
            }
        }
    var data = JSON.stringify({"username": newUser});
    xhr.send(data);
}

function onLoginSuccessful() {
    var cardHeader = document.getElementsByClassName("card-header")[0];
    cardHeader.innerHTML = '<button class="btn btn-primary float-right" id="notificationToggle">Notifications on</button>' + cardHeader.innerHTML;
    document.getElementById("notificationToggle").addEventListener("click",toggleNotifications);   
    var buttons = document.getElementById("buttons");
    buttons.parentNode.removeChild(buttons);
    browser.storage.local.get("postivityGameData", newData => {
        setNotificationButtonText(newData.postivityGameData.notifications);
        document.getElementById("userName").innerHTML = newData.postivityGameData.username;
        document.getElementById("userScore").innerHTML = newData.postivityGameData.score;
        document.getElementById("userRank").innerHTML = newData.postivityGameData.rank;
    });
}

function toggleNotifications(){
    browser.storage.local.get("postivityGameData", data => {
        setNotificationButtonText(!data.postivityGameData.notifications);
        data.postivityGameData.notifications = !data.postivityGameData.notifications;
        browser.storage.local.set({ postivityGameData: data.postivityGameData });
    });  
}

function setNotificationButtonText(setting) {
    if (setting) {
        document.getElementById("notificationToggle").innerHTML = "Notifications on";
    } else {
        document.getElementById("notificationToggle").innerHTML = "Notifications off";
    }
}