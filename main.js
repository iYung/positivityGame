const SentimentIntensityAnalyzer = require('vader-sentiment');
var intensity = SentimentIntensityAnalyzer.polarity_scores(input);