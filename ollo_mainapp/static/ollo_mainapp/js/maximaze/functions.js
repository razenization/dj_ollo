function timespan(ms) {
    var d = new Date(ms);
    var formattedDate = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes;

    formattedDate = formattedDate + " " + formattedTime;

    return formattedDate;
}



function secToMin(st) {
	let m = Math.round(st / 60);
	let s = st - m * 60;

	return `${m}:${s}`;
}

function Base64Encode(str, encoding = 'utf-8') {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
    return base64js.fromByteArray(bytes);
}

function setCookie(cookieName, path, cookieValue, expdays) {
	var d = new Date();
	d.setTime(d.getTime() + (expdays * 24 * 60 * 60 * 1000));
	var expires = "; expires=" + d.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + "; path="+path + expires;
}

/* Get cookie value
   undefined is returned if the cookie is not available */
function getCookie(cookieName) {
	var name = cookieName + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}

	return undefined;
}

/* Delete a cookie */
function deleteCookie(name, path) {
	setCookie(name, path, "", -1);
}

function getCoords(elem) { // кроме IE8-
	var box = elem.getBoundingClientRect();

	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};

}

/**
 * @return {string}
 */
function Base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}
// Убираю контейнер если < 992px
function Resize() {
var windowWidth = $(window).width();
if (windowWidth > 992) $(".remove-cont").addClass("container");
else $(".remove-cont").removeClass("container");

$(window).resize(function () {
var windowWidth = $(window).width();
if (windowWidth > 992) $(".remove-cont").addClass("container");
else $(".remove-cont").removeClass("container");
});
}

// Скролл в топ
$(document).ready(function(){
  $('body').append('<a href="#" id="go-top" class="btn-floating" title="Вверх"><i class="material-icons">expand_less</i></a>');
	if (localStorage.getItem('__volume') === null || localStorage.getItem("__volume") === undefined)
		localStorage.setItem("__volume", "1");
	$(".soundVolume").attr("on", localStorage.getItem("__volume") === "1" ? "true" : "false").html($(".soundVolume").attr('on') === "true" ? "volume_up" : "volume_off");
	$(".soundVolume").click(function(){
		if ($(this).attr('on')==="true") {
			sound = 0;
			localStorage.setItem("__volume", "0");
			$(this).attr('on', 'false');
			$(this).html('volume_off');
		} else {
			sound = 1;
			localStorage.setItem("__volume", "1");
			$(this).attr('on', 'true');
			$(this).html('volume_up');
		}
	});

	$(".soundVolumeMob").attr("on", localStorage.getItem("__volume") === "1" ? "true" : "false").html($(".soundVolumeMob").attr('on') === "true" ? "Выключить звук" : "Включить звук");
	$(".soundVolumeMob").click(function(){
		if ($(this).attr('on')==="true") {
			sound = 0;
			localStorage.setItem("__volume", "0");
			$(this).attr('on', 'false');
			$(this).html('Включить звук');
		} else {
			sound = 1;
			localStorage.setItem("__volume", "1");
			$(this).attr('on', 'true');
			$(this).html('Выключить звук');
		}
	});
});

$(function() {
 $.fn.scrollToTop = function() {
  $(this).hide().removeAttr("href");
  if ($(window).scrollTop() >= "250") $(this).fadeIn("slow")
  var scrollDiv = $(this);
  $(window).scroll(function() {
   if ($(window).scrollTop() <= "250") $(scrollDiv).fadeOut("slow")
   else $(scrollDiv).fadeIn("slow")
  });
  $(this).click(function() {
   $("html, body").animate({scrollTop: 0}, "slow")
  })
 }
});

$(function() {
 $("#go-top").scrollToTop();
});


function convertTowerStateToList(e, a) {
    for (var t = 0; t < 22; t++) {
        var s;
        s = 1 <= (1 << t & e),
        a.push(s)
    }
    return a
}

function convertBarrackStateToList(e, a) {
    for (r = 0; r < 12; r++)
        value = 1 << r & e,
        1 <= value ? bool = !0 : bool = !1,
        a.push(bool);
    return a
}


$("#themeSwitch").click(function(){
	localStorage.setItem('_theme', $(this).attr("theme"));
	location.reload();
});

$(".themeSwitchMob").click(function(){
	switch (localStorage.getItem('_theme')) {
		case "light":
			localStorage.setItem('_theme', 'dark');
			break;

		default:
		case "dark":
			localStorage.setItem('_theme', 'light');
			break;
	}

	location.reload();
});


 function imgToCanvas(t, b){
    var tw = [], br = [];
    tw = convertTowerStateToList(t, tw);
    br = convertBarrackStateToList(b, br);

    if (t === 0 || t === null) {
    	for(let i = 0; i < tw.length; i++) tw[i] = true;
	}

    if (b === 1 || b === 0) {
    	for(let i = 0; i < br.length; i++) br[i] = true;
	}

    //опять костыль
	 let ids = ['map'];

    ids.map((e)=> {

		var cx = null;
		if (cx !== null) cx.destroy();
		var c = document.getElementById(e);
		c.height = 1610;
		c.width = 1600;
		cx = c.getContext('2d');
		var bg_image = new Image();
		bg_image.src= "images/images/live/map_da_2.png";
		let coordsT1 = [
			{x: 5, y: 45},
			{x: 5, y: 85},
			{x: 5, y: 105},
			{x: 69, y: 91},
			{x: 52, y: 107},
			{x: 39, y: 120},
			{x: 135, y: 151},
			{x: 95, y: 151},
			{x: 55, y: 151},
			{x: 20, y: 135},
			{x: 30, y: 145}
		];

		let coordsT2 = [
			{x: 45, y: 5},
			{x: 85, y: 5},
			{x: 105, y: 5},
			{x: 91, y: 69},
			{x: 107, y: 52},
			{x: 120, y: 39},
			{x: 151, y: 135},
			{x: 151, y: 95},
			{x: 151, y: 55},
			{x: 135, y: 20},
			{x: 145, y: 30}
		];

		let coordsB1 = [
			{x: 3, y: 120},
			{x: 13, y: 120},
			{x: 30, y: 123},
			{x: 38, y: 135},
			{x: 50, y: 147},
			{x: 50, y: 159}
		];

		let coordsB2 = [
			{x: 120, y: 3},
			{x: 120, y: 13},
			{x: 123, y: 30},
			{x: 135, y: 38},
			{x: 147, y: 50},
			{x: 155, y: 50}
		];


		bg_image.onload = (e)=> {
			cx.drawImage(bg_image, 0, 0);
			coordsT1.map((e)=>{
				drawTowerRadiant(cx, e.x*10, e.y*9.5);
			});

			coordsT2.map((e)=>{
				drawTowerDire(cx, e.x*10, e.y*9.5);
			});

			coordsB1.map((e)=>{
				drawBarrackRadiant(cx, e.x*10, e.y*9.5);
			});

			coordsB2.map((e)=>{
				drawBarrackDire(cx, e.x*10, e.y*9.5);
			});

			try {
				if (t > 0) {
					//rt1
					if (!tw[0]) {
						drawBreakTowerRadiant(cx, 5*10, 45*9.5);
					}

					//rt2
					if (!tw[1]) {
						drawBreakTowerRadiant(cx, 5*10, 85*9.5);
					}

					//rt3
					if (!tw[2]) {
						drawBreakTowerRadiant(cx, 5*10, 105*9.5);
					}

					//rm1
					if (!tw[3]) {
						drawBreakTowerRadiant(cx, 69*10, 91*9.5);
					}

					//rm2
					if (!tw[4]) {
						drawBreakTowerRadiant(cx, 52*10, 107*9.5);
					}

					//rm3
					if (!tw[5]) {
						drawBreakTowerRadiant(cx, 39*10, 120*9.5);
					}

					//rb1
					if (!tw[6]) {
						drawBreakTowerRadiant(cx, 135*10, 151*9.5);
					}

					//rb2
					if (!tw[7]) {
						drawBreakTowerRadiant(cx, 95*10, 151*9.5);
					}

					//rb3
					if (!tw[8]) {
						drawBreakTowerRadiant(cx, 55*10, 151*9.5);
					}

					if (!tw[9]) {
						drawBreakTowerRadiant(cx, 20*10, 135*9.5);
					}

					if (!tw[10]) {
						drawBreakTowerRadiant(cx, 30*10, 145*9.5);
					}
					//

					if (!tw[11]) {
						drawBreakTowerDire(cx, 45*10, 5*9.5);
					}

					if (!tw[12]) {
						drawBreakTowerDire(cx, 85*10, 5*9.5);
					}

					if (!tw[13]) {
						drawBreakTowerDire(cx, 105*10, 5*9.5);
					}

					if (!tw[14]) {
						drawBreakTowerDire(cx, 91*10, 69*9.5);
					}

					if (!tw[15]) {
						drawBreakTowerDire(cx, 107*10, 52*9.5);
					}

					if (!tw[16]) {
						drawBreakTowerDire(cx, 120*10, 39*9.5);
					}

					if (!tw[17]) {
						drawBreakTowerDire(cx, 151*10, 135*9.5);
					}

					if (!tw[18]) {
						drawBreakTowerDire(cx, 151*10, 95*9.5);
					}

					if (!tw[19]) {
						drawBreakTowerDire(cx, 151*10, 55*9.5);
					}

					if (!tw[20]) {
						drawBreakTowerDire(cx, 135*10, 20*9.5);
					}

					if (!tw[21]) {
						drawBreakTowerDire(cx, 145*10, 30*9.5);
					}

				}

				console.log(tw);
				console.log(br);

				if (!br[0]) {
					drawBreakBarrackRadiant(cx, 3*10, 120*9.5);
				}

				if (!br[1]) {
					drawBreakBarrackRadiant(cx, 13*10, 120*9.5);
				}

				if (!br[2]) {
					drawBreakBarrackRadiant(cx, 30*10, 123*9.5);
				}

				if (!br[3]) {
					drawBreakBarrackRadiant(cx, 38*10, 135*9.5);
				}

				if (!br[4]) {
					drawBreakBarrackRadiant(cx, 50*10, 147*9.5);
				}

				if (!br[5]) {
					drawBreakBarrackRadiant(cx, 50*10, 159*9.5);
				}
				//
				if (!br[6]) {
					drawBreakBarrackDire(cx, 120*10, 3*9.5);
				}

				if (!br[7]) {
					drawBreakBarrackDire(cx, 120*10, 13*9.5);
				}

				if (!br[8]) {
					drawBreakBarrackDire(cx, 123*10, 30*9.5);
				}

				if (!br[9]) {
					drawBreakBarrackDire(cx, 135*10, 38*9.5);
				}

				if (!br[10]) {
					drawBreakBarrackDire(cx, 147*10, 50*9.5);
				}

				if (!br[11]) {
					drawBreakBarrackDire(cx, 155*10, 50*9.5);
				}
			} catch (e) {

			}
		}
	});


}
// function drawBreakTowerRadiant(cx, x, y) {
// 	cx.beginPath();
// 	cx.arc(x, y, 50, 0, 2 * Math.PI, false);
// 	cx.fillStyle = "#ff8700";
// 	cx.fill();
// 	cx.lineWidth = 0;
// 	cx.strokeStyle = "#ff8700";
// 	cx.stroke();
// }
//
// function drawBreakTowerDire(cx, x, y) {
// 	cx.beginPath();
// 	cx.arc(x, y, 50, 0, 2 * Math.PI, false);
// 	cx.fillStyle = "#ffffff";
// 	cx.fill();
// 	cx.lineWidth = 0;
// 	cx.strokeStyle = "#ffffff";
// 	cx.stroke();
// }
// function drawBreakBarrackRadiant(cx, x1, y1) {
// 	cx.beginPath();
// 	cx.arc(x1, y1, 1.3, 0, 2 * Math.PI, false);
// 	cx.fillStyle = "#ff8700";
// 	cx.fill();
// 	cx.lineWidth = 0.1;
// 	cx.strokeStyle = "#ffffff";
// 	cx.stroke();
// }
//
// function drawBreakBarrackDire(cx, x1, y1) {
// 	cx.beginPath();
// 	cx.arc(x1, y1, 1.3, 0, 2 * Math.PI, false);
// 	cx.fillStyle = "#ffffff";
// 	cx.fill();
// 	cx.lineWidth = 0.1;
// 	cx.strokeStyle = "#ff8700";
// 	cx.stroke();
// }

Date.prototype.pizdatayaHueta = function(){
	return this.getFullYear()     + '-' +
		pad( (this.getMonth() + 1) )   + '-' +
		pad( this.getDate() )          + ' ' +
		pad( this.getHours() )         + ':' +
		pad( this.getMinutes() )       + ':' +
		pad( this.getSeconds() )
		;
}
