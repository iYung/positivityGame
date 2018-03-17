const SentimentIntensityAnalyzer = require('vader-sentiment');
const webpages = ["www.reddit.com","www.youtube.com"];
const textBoxes = [];

var webpageIndex = webpages.indexOf(window.location.hostname);

var sentence = "";

console.log(webpageIndex);

 document.addEventListener('click',function(e){
    console.log(sentence);
    console.log(e.target);
    if(e.target && webpageIndex == 1 && (e.target.innerHTML == 'Comment' || e.target.innerHTML == 'Reply' || e.target.children[0].innerHTML == 'Comment' || e.target.children[0].innerHTML == 'Reply')){
        console.log(SentimentIntensityAnalyzer.polarity_scores(sentence));
    }
    if(e.target && webpageIndex == 0 && e.target.innerHTML == 'save'){
        console.log(SentimentIntensityAnalyzer.polarity_scores(sentence));
    }
})

 document.addEventListener('keyup',function(e){
    if (e.target.localName == 'textarea') {
        sentence = e.target.value;
    };
})