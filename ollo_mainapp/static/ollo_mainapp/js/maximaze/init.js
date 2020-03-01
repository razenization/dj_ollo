$(document).ready(function(){


    switch (localStorage.getItem('_theme')) {
        default:
        case "light":
            $("#themeSwitch").attr('theme', 'dark').html('brightness_7');
            break;

        case 'dark':
            $("#themeSwitch").attr('checked', 'true').attr('theme', 'light').html('wb_sunny');
            break;
    }

    $.get(
        location.protocol + "//" + location.host + "/data/link.json",
        (e)=>{
            $(".banner-link").attr('href', e.link).attr('target', '_blank');
            e.banners.map((el)=>{
                $(`.${el.className}`).attr('src', "images/banners/"+el.picture);
                if (localStorage.getItem('_theme') === "dark") $(`.${el.className}`).css('filter', 'invert(100%)');
            })
        }
    );

   $('.sidenav').sidenav();
   $('.dropdown-trigger').dropdown();
    $('.tabs').tabs();
    $('.tooltipped').tooltip();

    setInterval(()=>{
        $.get(
            location.protocol + "//" + location.host + "/api/v1.0/ntf/getLastNotify?"+new Date().getTime(),
            (e)=>{
                if (e.error === 'time') {
                    return false;
                }

                var notify = new Audio(location.port+"//"+location.host+"/sounds/u_edomlenie-9.mp3");
                notify.volume = 0.4;
                // notify.volume = 0.5;
                notify.play();

                M.toast({html: `<a href="${e.link}" target="_blank">${e.name}</a>`, classes: 'toast-alert', displayLength: 12000});
            }
        );
    }, 1500);
 });
