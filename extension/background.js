//uploads score every x
setInterval(function()
{
    var score = localStorage.getItem("postivityGame_positivityScore");
    var id = localStorage.getItem("postivityGame_userID");
    //upload score
    if (score && id) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://positivity-game-iyung.c9users.io/api/update', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Request finished. Do processing here.
                console.log(xhr.response);
                var response = JSON.parse(xhr.response);
                console.log(response);
                if (response.success) {
                    localStorage.setItem("postivityGame_userRank", response.rank);
                }
            }
        }
        var data = JSON.stringify({ "score": score, "id": id});
        xhr.send(data);
    }
},5000);