browser.runtime.onMessage.addListener(notify);

function notify(message) {
    if (message.postivitygame) {
        var popup = browser.notifications.create("postivityGame",{
            "type": "basic",
            "title": "The Positivity Game",
            "message": message.txt
        });
        popup.then(()=>{
            setTimeout(function(){chrome.notifications.clear("postivityGame");}, 2000);
        });
    }
}

//uploads score every x
setInterval(function()
{
    var data =  browser.storage.local.get("postivityGameData", data => {
        var userData = data.postivityGameData;
        //upload score
        if (data.postivityGameData) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", 'http://postivitygame.us-east-1.elasticbeanstalk.com/api/update', true);

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-type", "application/json");

            xhr.onreadystatechange = function() {//Call a function when the state changes.
                if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    // Request finished. Do processing here.
                    console.log(xhr.response);
                    var response = JSON.parse(xhr.response);
                    console.log(response);
                    if (response.success) {
                        console.log(userData);
                        userData.rank = response.rank;
                        browser.storage.local.set({ postivityGameData: userData });
                        browser.storage.local.set({ postivityGameTopUsers: response.top5 });
                    }
                }
            }
            var data = JSON.stringify({ "score": userData.score, "id": userData.id});
            xhr.send(data);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", 'http://postivitygame.us-east-1.elasticbeanstalk.com/api/top5', true);

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-type", "application/json");

            xhr.onreadystatechange = function() {//Call a function when the state changes.
                if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    // Request finished. Do processing here.
                    console.log(xhr.response);
                    var response = JSON.parse(xhr.response);
                    console.log(response);
                    if (response.success) {
                        browser.storage.local.set({ postivityGameTopUsers: response.top5 });
                    }
                }
            }
            xhr.send();
        }
    
    });
}, 1 * 60 * 1000);