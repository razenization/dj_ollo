function pureFadeIn(elem, display){
    var el = document.getElementById(elem);
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .02) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
function pureFadeOut(elem){
    var el = document.getElementById(elem);
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= .02) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};


function cookieConsent() {
    if (getCookie('__okeyCookie') === undefined) {
        $("body").append(`
             <div class="cookieConsentContainer" id="cookieConsentContainer">
                 <div class="cookieTitle">
                    <a>Cookies.</a>
                 </div>

                <div class="cookieDesc">
                <p>Это нужно для того, чтобы помочь вам в навигации, 
                    а также предоставить лучший пользовательский опыт.
                    <a href="https://ru.wikipedia.org/wiki/Cookie" target="_blank">Что такое cookie?</a>
                </p>
                </div>

                <div class="cookieButton">
                <a onClick="purecookieDismiss();">Понятно</a>
                </div>
             </div>
         `);
        pureFadeIn("cookieConsentContainer");
    }
}
function purecookieDismiss() {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + d.toUTCString();
    document.cookie = '__okeyCookie=yes;path=/;'+expires;
    pureFadeOut("cookieConsentContainer");
}

window.onload = function() { cookieConsent(); };