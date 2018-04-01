//uploads score every x
setInterval(function()
{
    var score = localStorage.getItem("postivityGame_positivityScore");
    //upload score
    if (score) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://positivity-game-iyung.c9users.io/api/update', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Request finished. Do processing here.
                console.log("Uploaded score!");
            }
        }
        xhr.send({ score: score });
    }
},30000);