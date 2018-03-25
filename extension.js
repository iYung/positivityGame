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
    //gets sentiment, if positive, increments score
    var sentiment = SentimentIntensityAnalyzer.polarity_scores(sentence)['compound']);
    if (sentiment > 0.5) {
        
        var score = localStorage.getItem('postivityGame_positivityScore');
        if (score != null) {
            var parsedScore = parseInt(score) + 1;
            localStorage.setItem(score.toString());
        }
    }
    //reset tracked sentence
    sentence = "";
}