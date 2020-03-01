$(document).ready(function () {
    switch (localStorage.getItem("_theme")) {
        default:
        case "light":
            $("#themeSwitch").attr("theme", "dark").html("brightness_7");
            break;
        case "dark":
            $("#themeSwitch").attr("checked", "true").attr("theme", "light").html("wb_sunny")
    }
    $.get(location.protocol + "//" + location.host + "/data/link.json", function (a) {
        $(".banner-link").attr("href", a.link).attr("target", "_blank");
        a.banners.map(function (a) {
            $("." + a.className).attr("src", "images/banners/" + a.picture);
            "dark" === localStorage.getItem("_theme") &&
            $("." + a.className).css("filter", "invert(100%)")
        })
    });
    $(".sidenav").sidenav();
    $(".dropdown-trigger").dropdown();
    $(".tabs").tabs();
    $(".tooltipped").tooltip();
    setInterval(function () {
        $.get(location.protocol + "//" + location.host + "/api/v1.0/ntf/getLastNotify?" + (new Date).getTime(), function (a) {
            if ("time" === a.error) return !1;
            var b = new Audio(location.port + "//" + location.host + "/sounds/u_edomlenie-9.mp3");
            b.volume = .4;
            b.play();
            M.toast({
                html: '<a href="' + a.link + '" target="_blank">' + a.name + "</a>", classes: "toast-alert",
                displayLength: 12E3
            })
        })
    }, 1500)
});