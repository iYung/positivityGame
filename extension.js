const SentimentIntensityAnalyzer = require('vader-sentiment');
const webpages = ["www.reddit.com","www.youtube.com"];
const textBoxes = [];

var webpageIndex = webpages.indexOf(window.location.hostname);
var sentence = "";

 document.addEventListener('click',function(e){
    if(e.target && webpageIndex == 1 && (e.target.innerHTML == 'Comment' || e.target.innerHTML == 'Reply' || e.target.children[0].innerHTML == 'Comment' || e.target.children[0].innerHTML == 'Reply')){
        judgeSentence();
    }
    if(e.target && webpageIndex == 0 && e.target.innerHTML == 'save'){
        judgeSentence();
    }
})

 document.addEventListener('keyup',function(e){
    if (e.target && (webpageIndex == 0 || webpageIndex == 1) && e.target.localName == 'textarea') {
        sentence = e.target.value;
    };
})

function judgeSentence() {
    var sentiment = SentimentIntensityAnalyzer.polarity_scores(sentence)['compound']);
    if (sentiment > 0.5) {
        var score = parseInt(localStorage.getItem('positivityScore')) + 1;
        localStorage.setItem(score.toString());
    }
}