const { ClearWeekGames, ClearDayGames } = require('../requests/database')

let dayInterval, weekInterval
function startClearIntervals() {

    dayInterval = setInterval(() => {
        ClearDayGames().catch(err => console.log(`ERROR: ${err}`));
    }, 86400000)


    weekInterval = setInterval(() => {
        ClearWeekGames().catch(err => console.log(`ERROR: ${err}`))
    }, 604800000)
    console.log("database intervals started...");
}

function stopClearIntervals() {
    clearInterval(dayInterval);
    clearInterval(weekInterval);
}

module.exports = { startClearIntervals, stopClearIntervals }