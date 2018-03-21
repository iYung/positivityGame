browser.alarms.create("5min", {
  delayInMinutes: 0,
  periodInMinutes: 1
});

broswer.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "5min") {
    console.log("yo");
  }
});