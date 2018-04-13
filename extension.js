const SentimentIntensityAnalyzer = require('vader-sentiment');

//webpage array for the if statements below
const webpages = ["www.reddit.com","www.youtube.com"];

//setting up variables
const webpageIndex = webpages.indexOf(window.location.hostname);
var sentence = "";

 document.addEventListener('click',function(e){
    //if youtube
    if(e.target && webpageIndex == 1 && (e.target.innerHTML == 'Comment' || e.target.innerHTML == 'Reply' || e.target.children[0].innerHTML == 'Comment' || e.target.children[0].innerHTML == 'Reply')){
        judgeSentence();
    }
    //if reddit
    if(e.target && webpageIndex == 0 && e.target.innerHTML == 'save'){
        judgeSentence();
    }
})

//checks if something was typed
 document.addEventListener('keyup',function(e){
    if (e.target && (webpageIndex == 0 || webpageIndex == 1) && e.target.localName == 'textarea') {
        sentence = e.target.value;
    };
})

function judgeSentence() {
    //gets sentiment, +/- 1 to score if positive/negative
    var sentiment = SentimentIntensityAnalyzer.polarity_scores(sentence)['compound'];
    if (sentiment > 0.5) {
        var userData =  browser.storage.local.get("postivityGameData", data => {
            console.log(data.postivityGameData);
            if (data.postivityGameData.id) {
                browser.runtime.sendMessage({postivitygame: true, txt: "What a nice comment! +1"});
                data.postivityGameData.score += 1;
                browser.storage.local.set({ postivityGameData: data.postivityGameData });
            }
        });
    } else if (sentiment < -0.5) {
        var userData =  browser.storage.local.get("postivityGameData", data => {
            console.log(data.postivityGameData);
            if (data.postivityGameData.id) {
                browser.runtime.sendMessage({postivitygame: true, txt: "What a rude comment! -1"});
                data.postivityGameData.score += -1;
                browser.storage.local.set({ postivityGameData: data.postivityGameData });
            }
        });
    }
    //reset tracked sentence
    sentence = "";
}