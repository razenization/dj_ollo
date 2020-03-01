function timespan(d) {
    var a = new Date(d);
    d = a.getDate() + "-" + a.getMonth() + "-" + a.getFullYear();
    var b = 10 > a.getHours() ? "0" + a.getHours() : a.getHours();
    a = 10 > a.getMinutes() ? "0" + a.getMinutes() : a.getMinutes();
    return d + " " + (b + ":" + a)
}

function secToMin(d) {
    var a = Math.round(d / 60);
    return a + ":" + (d - 60 * a)
}

function Base64Encode(d, a) {
    var b = (new (TextEncoder || TextEncoderLite)(void 0 === a ? "utf-8" : a)).encode(d);
    return base64js.fromByteArray(b)
}

function setCookie(d, a, b, e) {
    var f = new Date;
    f.setTime(f.getTime() + 864E5 * e);
    e = "; expires=" + f.toUTCString();
    document.cookie = d + "=" + b + "; path=" + a + e
}

function getCookie(d) {
    d += "=";
    for (var a = document.cookie.split(";"), b = 0; b < a.length; b++) {
        for (var e = a[b]; " " === e.charAt(0);) e = e.substring(1);
        if (0 === e.indexOf(d)) return e.substring(d.length, e.length)
    }
}

function deleteCookie(d, a) {
    setCookie(d, a, "", -1)
}

function getCoords(d) {
    d = d.getBoundingClientRect();
    return {top: d.top + pageYOffset, left: d.left + pageXOffset}
}

function Base64Decode(d, a) {
    a = void 0 === a ? "utf-8" : a;
    var b = base64js.toByteArray(d);
    return (new (TextDecoder || TextDecoderLite)(a)).decode(b)
}

function Resize() {
    992 < $(window).width() ? $(".remove-cont").addClass("container") : $(".remove-cont").removeClass("container");
    $(window).resize(function () {
        992 < $(window).width() ? $(".remove-cont").addClass("container") : $(".remove-cont").removeClass("container")
    })
}

$(document).ready(function () {
    $("body").append('<a href="#" id="go-top" class="btn-floating" title="\u0412\u0432\u0435\u0440\u0445"><i class="material-icons">expand_less</i></a>');
    null !== localStorage.getItem("__volume") && void 0 !== localStorage.getItem("__volume") || localStorage.setItem("__volume", "1");
    $(".soundVolume").attr("on", "1" === localStorage.getItem("__volume") ? "true" : "false").html("true" === $(".soundVolume").attr("on") ? "volume_up" : "volume_off");
    $(".soundVolume").click(function () {
        "true" === $(this).attr("on") ?
            (sound = 0, localStorage.setItem("__volume", "0"), $(this).attr("on", "false"), $(this).html("volume_off")) : (sound = 1, localStorage.setItem("__volume", "1"), $(this).attr("on", "true"), $(this).html("volume_up"))
    });
    $(".soundVolumeMob").attr("on", "1" === localStorage.getItem("__volume") ? "true" : "false").html("true" === $(".soundVolumeMob").attr("on") ? "\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0437\u0432\u0443\u043a" : "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0437\u0432\u0443\u043a");
    $(".soundVolumeMob").click(function () {
        "true" ===
        $(this).attr("on") ? (sound = 0, localStorage.setItem("__volume", "0"), $(this).attr("on", "false"), $(this).html("\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0437\u0432\u0443\u043a")) : (sound = 1, localStorage.setItem("__volume", "1"), $(this).attr("on", "true"), $(this).html("\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0437\u0432\u0443\u043a"))
    })
});
$(function () {
    $.fn.scrollToTop = function () {
        $(this).hide().removeAttr("href");
        "250" <= $(window).scrollTop() && $(this).fadeIn("slow");
        var d = $(this);
        $(window).scroll(function () {
            "250" >= $(window).scrollTop() ? $(d).fadeOut("slow") : $(d).fadeIn("slow")
        });
        $(this).click(function () {
            $("html, body").animate({scrollTop: 0}, "slow")
        })
    }
});
$(function () {
    $("#go-top").scrollToTop()
});

function convertTowerStateToList(d, a) {
    for (var b = 0; 22 > b; b++) a.push(1 <= (1 << b & d));
    return a
}

function convertBarrackStateToList(d, a) {
    for (r = 0; 12 > r; r++) value = 1 << r & d, 1 <= value ? bool = !0 : bool = !1, a.push(bool);
    return a
}

$("#themeSwitch").click(function () {
    localStorage.setItem("_theme", $(this).attr("theme"));
    location.reload()
});
$(".themeSwitchMob").click(function () {
    switch (localStorage.getItem("_theme")) {
        case "light":
            localStorage.setItem("_theme", "dark");
            break;
        default:
        case "dark":
            localStorage.setItem("_theme", "light")
    }
    location.reload()
});

function imgToCanvas(d, a) {
    var b = [], e = [];
    b = convertTowerStateToList(d, b);
    e = convertBarrackStateToList(a, e);
    if (0 === d || null === d) for (var f = 0; f < b.length; f++) b[f] = !0;
    if (1 === a || 0 === a) for (f = 0; f < e.length; f++) e[f] = !0;
    ["map"].map(function (a) {
        var c = null;
        null !== c && c.destroy();
        a = document.getElementById(a);
        a.height = 1610;
        a.width = 1600;
        c = a.getContext("2d");
        var f = new Image;
        f.src = "images/map-images/map_da_2.png";
        var g = [{x: 5, y: 45}, {x: 5, y: 85}, {x: 5, y: 105}, {x: 69, y: 91}, {x: 52, y: 107}, {
                x: 39,
                y: 120
            }, {x: 135, y: 151}, {x: 95, y: 151},
                {x: 55, y: 151}, {x: 20, y: 135}, {x: 30, y: 145}],
            h = [{x: 45, y: 5}, {x: 85, y: 5}, {x: 105, y: 5}, {x: 91, y: 69}, {x: 107, y: 52}, {
                x: 120,
                y: 39
            }, {x: 151, y: 135}, {x: 151, y: 95}, {x: 151, y: 55}, {x: 135, y: 20}, {x: 145, y: 30}],
            k = [{x: 3, y: 120}, {x: 13, y: 120}, {x: 30, y: 123}, {x: 38, y: 135}, {x: 50, y: 147}, {x: 50, y: 159}],
            l = [{x: 120, y: 3}, {x: 120, y: 13}, {x: 123, y: 30}, {x: 135, y: 38}, {x: 147, y: 50}, {x: 155, y: 50}];
        f.onload = function (a) {
            c.drawImage(f, 0, 0);
            g.map(function (a) {
                drawTowerRadiant(c, 10 * a.x, 9.5 * a.y)
            });
            h.map(function (a) {
                drawTowerDire(c, 10 * a.x, 9.5 * a.y)
            });
            k.map(function (a) {
                drawBarrackRadiant(c,
                    10 * a.x, 9.5 * a.y)
            });
            l.map(function (a) {
                drawBarrackDire(c, 10 * a.x, 9.5 * a.y)
            });
            try {
                0 < d && (b[0] || drawBreakTowerRadiant(c, 50, 427.5), b[1] || drawBreakTowerRadiant(c, 50, 807.5), b[2] || drawBreakTowerRadiant(c, 50, 997.5), b[3] || drawBreakTowerRadiant(c, 690, 864.5), b[4] || drawBreakTowerRadiant(c, 520, 1016.5), b[5] || drawBreakTowerRadiant(c, 390, 1140), b[6] || drawBreakTowerRadiant(c, 1350, 1434.5), b[7] || drawBreakTowerRadiant(c, 950, 1434.5), b[8] || drawBreakTowerRadiant(c, 550, 1434.5), b[9] || drawBreakTowerRadiant(c, 200, 1282.5), b[10] ||
                drawBreakTowerRadiant(c, 300, 1377.5), b[11] || drawBreakTowerDire(c, 450, 47.5), b[12] || drawBreakTowerDire(c, 850, 47.5), b[13] || drawBreakTowerDire(c, 1050, 47.5), b[14] || drawBreakTowerDire(c, 910, 655.5), b[15] || drawBreakTowerDire(c, 1070, 494), b[16] || drawBreakTowerDire(c, 1200, 370.5), b[17] || drawBreakTowerDire(c, 1510, 1282.5), b[18] || drawBreakTowerDire(c, 1510, 902.5), b[19] || drawBreakTowerDire(c, 1510, 522.5), b[20] || drawBreakTowerDire(c, 1350, 190), b[21] || drawBreakTowerDire(c, 1450, 285)), console.log(b), console.log(e), e[0] ||
                drawBreakBarrackRadiant(c, 30, 1140), e[1] || drawBreakBarrackRadiant(c, 130, 1140), e[2] || drawBreakBarrackRadiant(c, 300, 1168.5), e[3] || drawBreakBarrackRadiant(c, 380, 1282.5), e[4] || drawBreakBarrackRadiant(c, 500, 1396.5), e[5] || drawBreakBarrackRadiant(c, 500, 1510.5), e[6] || drawBreakBarrackDire(c, 1200, 28.5), e[7] || drawBreakBarrackDire(c, 1200, 123.5), e[8] || drawBreakBarrackDire(c, 1230, 285), e[9] || drawBreakBarrackDire(c, 1350, 361), e[10] || drawBreakBarrackDire(c, 1470, 475), e[11] || drawBreakBarrackDire(c, 1550, 475)
            } catch (m) {
            }
        }
    })
}

Date.prototype.pizdatayaHueta = function () {
    return this.getFullYear() + "-" + pad(this.getMonth() + 1) + "-" + pad(this.getDate()) + " " + pad(this.getHours()) + ":" + pad(this.getMinutes()) + ":" + pad(this.getSeconds())
};