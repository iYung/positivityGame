const SentimentIntensityAnalyzer = require('vader-sentiment');
const input = 'VADER is very smart, handsome, and funny';
const intensity = SentimentIntensityAnalyzer.polarity_scores(input);
console.log(intensity);

var sentence = "";

 document.addEventListener('click',function(e){
    console.log(sentence);
    if(e.target && e.target.innerHTML == 'save'){
        console.log(SentimentIntensityAnalyzer.polarity_scores(sentence));
    }
})

 document.addEventListener('keyup',function(e){
    if (e.target.localName == 'textarea') {
        sentence = e.target.value;
    };
})