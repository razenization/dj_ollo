// counter = function (date1, date2) {
//     var value = Math.abs(date2 - date1);
//     console.log(date1);
//     console.log(date2);
//
//     value = parseInt(value) - 1000;
//     let minutes = Math.floor(value / 60000);
//     let seconds = ((value % 60000) / 1000).toFixed(0);
//
//     if (minutes < 2) {
//         $('.timeText span').text(minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
//     }
// };

function Timer(fn, t) {
    var timerObj = null;

    this.stop = function () {
        // if (timerObj) {
        try {
            clearInterval(timerObj);
            timerObj = null;
        } catch (e) {
            console.log('caught');
        }
        return this;
    };

    // start timer using current settings (if it's not already running)
    this.start = function (hr, min, sec) {
        fn(hr, min, sec);
        timerObj = setInterval(function () {
            fn(hr, min, sec);
        }, t);
        return this;
    };

    // start with new or original interval, stop current interval
    this.reset = function (round_t) {
        this.stop();
        clearInterval(timerObj);
        date_to_pass = new Date();
        date_to_pass.setSeconds(date_to_pass.getSeconds() + round_t);
        timerObj = setInterval(function () {
            fn(date_to_pass.getHours() + 1, date_to_pass.getMinutes(), date_to_pass.getSeconds(), round_t);
        }, t);
        return this;
    };
}

var timer = new Timer(function (hr=0, min=0, sec=0) {
    date_now = new Date();
    date_timer = new Date();
    date_now.setHours(date_now.getHours() + 1);
    if (sec !== 0) {
        date_timer.setHours(hr, min, sec);
    }
    console.log(date_now);
    console.log(date_timer);
    var value = date_timer - date_now;
    // value = parseInt(value) - 1000;
    let minutes = Math.floor(value / 60000);
    let seconds = ((value % 60000) / 1000).toFixed(0);

    if (value < 0) {
        $('.timeText span').text('Round over');
    } else {
        $('.timeText span').text(minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
    }
}, 1000);
