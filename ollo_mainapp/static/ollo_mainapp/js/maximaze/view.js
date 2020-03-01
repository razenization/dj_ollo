$(document).ready(function(){

    $(".score-meet").attr("href", location.href+"#");

    // $("#mainStream").hide();
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = null;

    $(document).on('click', ".streams-item", function () {
        switch ($(this).attr('provider')) {
            case "youtube":
            case "twitch":
                $("#mainStream").show();
                $(".players").removeClass('players_no-stream');
                $(".statistics-bar").removeClass('statistics-bar_no-stream');
                $(".right-bar").removeClass('right-bar_no-stream');
                $(".news").removeClass('news_no-stream');
                $(".streams").removeClass('streams_no-stream');
                $("#player").attr('src', $(this).attr('href'));
                break;

            default:
                window.open($(this).attr('href'),'_blank');
                break;
        }
    })

    $.get(
        location.protocol+"//"+location.host+"/api/v1.0/news/getLastNews",
        (e)=>{
            $("#lastNews").append(e.map((e)=>`<a href="/news/${e.id_news}/" class="news-item news-item-light-dark" >
                <span class="news-text">${e.news_name}</span>
                <div class="news-bg" style="background-image: url('/news/pictures/${e.news_pic}');"></div>
            </a>`))
        }
    )


    if ($("#isLive").val() !== "yes") {

        //$("#mainPreloader").show();
        //$("#mainHide").css("visibility", "hidden");
        // $("#streamsList").hide();
        var params = window
            .location
            .search
            .replace('?','')
            .split('&')
            .reduce(
                function(p,e){
                    var a = e.split('=');
                    p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                    return p;
                },
                {}
            );

        if (params['ended']==="true") {
            var aud = new Audio(location.port+"//"+location.host+"/sounds/to-the-point.mp3");
            aud.volume = Number(localStorage.getItem('__volume'));
            aud.play();

        }

        $.get(
            // location.protocol + "//" + location.host + "/data/matches/" + $("#matchId").val() + ".json",
            location.protocol + "//" + location.host + "/api/v1.0/getMatchStatistic/" + $("#matchId").val() + "/",
            (e) => {
                //console.log(e);
                $("#bookMaker").html(e.league.hasOwnProperty('name') ? e.league.name : "");
                $(".team1Name").html(e.radiant_team.name);
                $(".team2Name").html(e.dire_team_id.name);
                $("#team1Score").html(e.radiant_score);
                $("#team2Score").html(e.dire_score);
                $(".team1Pic").attr("src", e.radiant_team_id.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png");
                $(".team2Pic").attr("src", e.dire_team_id.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png");

                if (e.radiant_win) {
                    $("#winTeam1").addClass('win_team');
                    $("#team1Score").addClass("score-meet-win");
                } else {
                    $("#winTeam2").addClass('win_team');
                    $("#team2Score").addClass("score-meet-win");
                }

                imgToCanvas(e.tower_state, e.barracks_state);

                var tower1 = 0, tower2 = 0, fb = "", barracks1 = 0, barracks2 = 0;

                var tows = [], bars = [];
                tows = convertTowerStateToList(e.tower_state, tows);
                bars = convertBarrackStateToList(e.barracks_state, bars);

                for (let i = 0; i <= 10; i++) {
                    if (!tows[i]) tower1++;
                }
                for (let i = 11; i <= 21; i++) {
                    if (!tows[i]) tower2++;
                }

                for (let i = 0; i <= 5; i++) {
                    if (!bars[i]) barracks1++;
                }

                for (let i = 6; i <= 11; i++) {
                    if (!bars[i]) barracks2++;
                }

                for (let i = 0; i <= 4; i++) {
                    let items = "";
                    if (getPicById(e.players[i].item_0) !== "") items += `<img src="${getPicById(e.players[i].item_0)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_1) !== "") items += `<img src="${getPicById(e.players[i].item_1)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_2) !== "") items += `<img src="${getPicById(e.players[i].item_2)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_3) !== "") items += `<img src="${getPicById(e.players[i].item_3)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_4) !== "") items += `<img src="${getPicById(e.players[i].item_4)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_5) !== "") items += `<img src="${getPicById(e.players[i].item_5)}" class="hero-item">`;
                    $("#team1Heroes").append(`
<div class="players-item">
<!--                                <img src="${e.players[i].hero_id}" alt="" class="player-photo">-->
                                <div class="player-info">
                                    <div class="info-title">
<!--                                        <img src="assets/images/UKRAINEFLAG1.png" alt=""class="player-country">-->
                                        <span class="player-nick">${e.players[i].account_id.hasOwnProperty("profile") ? e.players[i].account_id.profile.personaname || "Player" : ""}</span>
<!--                                        <span class="player-hero-name">Pudge</span>-->
                                    </div>
                                    <div class="player-hero">
                                        <img src="${e.players[i].hero_id}" alt="" >
                                        ${items}
                                    </div>
                                    <div class="player-statistics">
                                        <div class="statistics-item">
                                            <img src="images/images/sword.png" class="iconDark" alt="">
                                            <span class="kills-number">${e.players[i].kills}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/skull.png" class="iconDark" alt="">
                                            <span class="death-number">${e.players[i].deaths}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/line-chart.png" class="iconDark" alt="">
                                            <span class="chart-number">${e.players[i].total_gold}</span>

                                        </div>
                                    </div>
                                </div>
                            </div> 
              `);

                    //tower1 += e.players[i].towers_killed;

                    if (e.players[i].firstblood_claimed === 1) fb = e.players[i].account_id.hasOwnProperty("profile") ? e.players[i].account_id.profile.personaname : "";
                }

                for (let i = 5; i <= 9; i++) {
                    let items = "";
                    if (getPicById(e.players[i].item_0) !== "") items += `<img src="${getPicById(e.players[i].item_0)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_1) !== "") items += `<img src="${getPicById(e.players[i].item_1)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_2) !== "") items += `<img src="${getPicById(e.players[i].item_2)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_3) !== "") items += `<img src="${getPicById(e.players[i].item_3)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_4) !== "") items += `<img src="${getPicById(e.players[i].item_4)}" class="hero-item">`;
                    if (getPicById(e.players[i].item_5) !== "") items += `<img src="${getPicById(e.players[i].item_5)}" class="hero-item">`;
                    $("#team2Heroes").append(`
                         <div class="players-item">
                                <div class="player-info player-info_team2">
                                    <div class="info-title info-title_team2">
<!--                                        <span class="player-hero-name">Pudge</span>-->
                                        <span class="player-nick">${e.players[i].account_id.hasOwnProperty("profile") ? e.players[i].account_id.profile.personaname || "Player" : ""}</span>
<!--                                        <img src="assets/images/UKRAINEFLAG1.png" alt=""class="player-country">-->

                                    </div>
                                    <div class="player-hero player-hero_team2">
                                        <img src="${e.players[i].hero_id}" alt="" >
                                        ${items}
                                    </div>
                                    <div class="player-statistics player-statistics_team2">
                                        <div class="statistics-item">
                                            <img src="images/images/line-chart.png" class="iconDark" alt="">
                                            <span class="chart-number">${e.players[i].total_gold}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/skull.png" class="iconDark" alt="">
                                            <span class="death-number">${e.players[i].deaths}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/sword.png" class="iconDark" alt="">
                                            <span class="kills-number">${e.players[i].kills}</span>
                                        </div>
                                    </div>
                                </div>
<!--                                <img src="assets/images/player-photo-1.png" alt="" class="player-photo">-->
                            </div>
              `);


                    if (e.players[i].firstblood_claimed === 1) fb = e.players[i].account_id.hasOwnProperty("profile") ? e.players[i].account_id.profile.personaname : "";


                    //tower2 += e.players[i].towers_killed;
                }
                try {
                    $("#streamsList").empty();
                    if (e.streams.length > 0) {
                        e.streams.sort((a, b) => b.viewers - a.viewers);
                        let k = 0;
                        e.streams.map((e) => {
                            if (e.provider == "youtube") {
                                $("#streamsList").append(`
                                  <div class="streams-item" provider="youtube" href="https://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg">
              <a class="stream-link"><i class="fab fa-youtube red-text" style="margin-right: 3px;"></i>${e.channel}</a>
                            <span class="stream-teams">${e.title}</span>

              <span class="stream-lang">${e.language || "EN"}</span>
            </div>`);
                                $("#mainStream").show();
                                $(".players").removeClass('players_no-stream');
                                $(".statistics-bar").removeClass('statistics-bar_no-stream');
                                $(".right-bar").removeClass('right-bar_no-stream');
                                $(".news").removeClass('news_no-stream');
                                $(".streams").removeClass('streams_no-stream');
                                $("#player").attr('src', `https://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg&mute=1`);
                                // $("#playerStreams").load(`http://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg`);
                                // $("#streamCur").empty().append(`<iframe id="player" type="text/html"
                                // src="http://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg"
                                // frameborder="0"></iframe>`);
                                k++;
                            }

                            if (e.provider == "twitch") {
                                $("#streamsList").append(`
              <div class="streams-item" provider="youtube" provider="twitch" href="https://player.twitch.tv/?channel=${e.channel}&autoplay=true">
              <a class="stream-link"><i class="fab fa-twitch purple-text" style="margin-right: 3px;"></i>${e.channel}</a>
                            <span class="stream-teams">${e.title}</span>

              <span class="stream-lang">${e.language || "EN"}</span>
            </div>`);
                                $("#mainStream").show();
                                $(".players").removeClass('players_no-stream');
                                $(".statistics-bar").removeClass('statistics-bar_no-stream');
                                $(".right-bar").removeClass('right-bar_no-stream');
                                $(".news").removeClass('news_no-stream');
                                $(".streams").removeClass('streams_no-stream');
                                $("#player").attr('src', `https://player.twitch.tv/?channel=${e.channel}&muted=true&autoplay=true`);
                                //     $("#streamCur").show().empty().append(`
                                // <iframe src="https://player.twitch.tv/?channel=${e.channel}" frameborder="0" scrolling="no" allowfullscreen="true"> </iframe>
                                // `);
                                k++;
                            }
                            if (e.provider == "huomao") {
                                if (!/d/gi.test(e.embed_id)) {
                                    if (e.viewers > 80000) {

                                        $("#streamsList").append(`
            <div class="streams-item" provider="huomao" href="https://huomao.com/live/${e.embed_id}">
              <a class="stream-link">${e.channel}</a>
                            <span class="stream-teams">${e.title}</span>

              <span class="stream-lang">${e.language || "CH"}</span>
            </div>
           `);
                                        $(".players").addClass('players_no-stream');
                                        $(".statistics-bar").addClass('statistics-bar_no-stream');
                                        $(".right-bar").addClass('right-bar_no-stream');
                                        $(".news").addClass('news_no-stream');
                                        $(".streams").addClass('streams_no-stream');
                                        $("#mainStream").hide();
                                        // $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                                        // k++;
                                    }
                                    k++;
                                }
                            }



                            // if (k === 0) {
                            //     $(".players").addClass('players_no-stream');
                            //     $(".statistics-bar").addClass('statistics-bar_no-stream');
                            //     $(".right-bar").addClass('right-bar_no-stream');
                            //     $(".news").addClass('news_no-stream');
                            //     $(".streams").addClass('streams_no-stream');
                            //     $("#mainStream").hide();
                            //     $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                            // }
                        });
                    } else {
                        $(".players").addClass('players_no-stream');
                        $(".statistics-bar").addClass('statistics-bar_no-stream');
                        $(".right-bar").addClass('right-bar_no-stream');
                        $(".news").addClass('news_no-stream');
                        $(".streams").addClass('streams_no-stream');
                        $("#mainStream").hide();
                        $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                    }
                } catch (e) {
                    $(".players").addClass('players_no-stream');
                    $(".statistics-bar").addClass('statistics-bar_no-stream');
                    $(".right-bar").addClass('right-bar_no-stream');
                    $(".news").addClass('news_no-stream');
                    $(".streams").addClass('streams_no-stream');
                    $("#mainStream").hide();
                    $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                }

                $(".pastScoreWinTeam1").html(`${e.radiant_team_id.wins}`);
                $(".pastScoreWinTeam2").html(`${e.dire_team_id.wins}`);
                $(".pastScoreLoseTeam1").html(`${e.radiant_team_id.losses}`);
                $(".pastScoreLoseTeam2").html(`${e.dire_team_id.losses}`);

                //console.log(Math.round(e.radiant_team_id.wins/(e.radiant_team_id.wins+e.radiant_team_id.losses)));
                var obj = {
                    type: 'bar',
                    data: {
                        labels: [e.radiant_team_id.name, e.dire_team_id.name],
                        datasets: [{
                            label: 'Winrate, %',
                            data: [Math.round((e.radiant_team_id.wins / (e.radiant_team_id.wins + e.radiant_team_id.losses)) * 100), Math.round((e.dire_team_id.wins / (e.dire_team_id.wins + e.dire_team_id.losses)) * 100)],
                            backgroundColor: ['rgb(255,150,0)', 'rgb(126,126,126)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }

                            }]
                        }
                    }

                };
                var graph1;
                graph1 = new Chart(document.getElementById('myStas').getContext('2d'), obj);

                // var graph2 = new Chart(document.getElementById('myStat').getContext('2d'), obj);
                // var graph3 = new Chart(document.getElementById('myStatYY').getContext('2d'), obj);

                var objRat = {
                    type: 'doughnut',

                    data: {
                        labels: [e.radiant_team_id.name, e.dire_team_id.name],
                        datasets: [{
                            label: 'Rating, %',
                            backgroundColor: ['rgb(255,150,0)', 'rgb(126,126,126)'],
                            data: [e.radiant_team_id.rating, e.dire_team_id.rating]
                        }]
                    },
                    options: {}
                }

                var graphRating;
                graphRating = new Chart(document.getElementById('myRating').getContext('2d'), objRat);

                // var graphRating2 = new Chart(document.getElementById('myRatin1g').getContext('2d'), objRat);

                // let bestPlayerT1  = e.radiant_team_win.members.reduce((prev, current) => {
                //     try {
                //         return (!prev.steamAccount.hasOwnProperty('soloRank') ?
                //             prev.steamAccount.soloRank : 0
                //             >
                //             !current.steamAccount.hasOwnProperty('soloRank') ?
                //                 current.steamAccount.soloRank : 0)
                //             ? prev.steamAccount.name : current.steamAccount.name
                //     } catch (e) {
                //         console.log(e);
                //         // return "";
                //     }
                // });
                // let teamBans1 = "", teamBans2 = "";
                let bunNumsT1 = 1, bunNumsT2 = 1;
                e.picks_bans.map((e) => {

                    if (!e.is_pick) {
                        switch (e.team) {
                            case 0:
                                $("#bansTeam1").append(`<div class="ban-img">
                                <div class="hero-ban-img" style="background-image: url('${e.hero_id}');"></div>
                                <span class="ban-text">Ban ${bunNumsT1}</span>
                            </div>`);
                                bunNumsT1++;
                                break;

                            case 1:
                                $("#bansTeam2").append(`<div class="ban-img">
                                <div class="hero-ban-img" style="background-image: url('${e.hero_id}');"></div>
                                <span class="ban-text">Ban ${bunNumsT2}</span>
                            </div>`);
                                bunNumsT2++;
                                break;
                        }
                    }
                });


                $(".team2Towers").html(11 - tower2);
                $(".team1Towers").html(11 - tower1);
                $(".team2Barracks").html(6 - barracks2);
                $(".team1Barracks").html(6 - barracks1);

                $("#firstblood").html(fb === "" ? e.players[1].account_id.profile.personaname : fb);// === "" ? e.players[1].account_id.hasOwnProperty("profile") ? e.players[1].account_id.profile.personaname : "" : "");

                try {
                    e.chat.map((el) => {
                        if (el.type === 'chat') {

                            $("#chatGame").append(`
                      <div class="chatElement row">
                                        <div class="chatUser col s12">
                                            <span class="chatName left">${el.unit}</span>
                                            <span class="chatTime right">${secToMin(el.time).replace(/-/g, '')}</span>
                                        </div>
                                        <div class="chatMessage col s12">
                                            <span class="">${el.key}</span>
                                        </div>
                                    </div>
                      `);
                        }
                    });
                } catch (e) {

                }

                $("#startMatch").html(e.start_time.replace(/-/g, ''));
                $("#bestOf").html("BO" + e.game_mode);

                //   var minutes = Math.floor(e.duration / 60);
                //   var sec = e.duration - minutes * 60;

                $("#time").html(e.duration.replace(/-/g, ''));


                var labels = [];
                var data = [];


                for (let i = 0; i < e.version.length; i++) {
                    if (e.version[i].time_match.split(':')[0] == "0") {
                        e.version = e.version.slice(i, e.version.length);
                        break;
                    }
                }

                let dataGraph = [];
                e.version.map((el) => {
                    if (el.match_score != 0) {
                        labels.push(el.time_match);
                        data.push(el.match_score);
                        dataGraph.push({x: el.time_match, y: el.match_score});
                        // dataGraph[dataGraph, {x: el.time_match, y: el.match_score}];
                    }
                });

                $(".netWorth").empty();

                if (data[data.length - 1] < 0) {

                    $(".nw").addClass('nw-right');
                    $(".nw").removeClass('nw-left').html('<span >Преимущество <i class="fas fa-arrow-up" style="margin-right:5px"></i><span style="display:flex;align-items:center;margin-left: 20px;"><i class="material-icons">show_chart</i>' + Math.abs(data[data.length - 1])+'</span></span>');
                } else
                {

                    $(".nw").addClass('nw-left');
                    $(".nw").removeClass('nw-right').html('<span >Преимущество <i class="fas fa-arrow-up" style="margin-right:5px"></i><span style="display:flex;align-items:center;margin-left: 20px;"><i class="material-icons">show_chart</i>' + Math.abs(data[data.length - 1])+'</span></span>');
                }

                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: labels,//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [{
                            label: 'Net worth',
                            borderColor: 'rgb(255, 150, 33)',
                            data: data,
                            pointRadius: 1
                        }]
                    },

                    // Configuration options go here
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    callback: function(value, index, values) {
                                        return value.toString().replace(/-/gi, "");
                                    }
                                }

                            }]
                        }

                    }
                });

                $("#mainHide").css("visibility", "visible");
                $("#mainPreloader").hide();
            }
        );
    } else {

        // setInterval(()=>{
        //     $.get(
        //         location.protocol + "//" + location.host + "/api/v1.0/ntf/getLastNotify",
        //         (e)=>{
        //             if (e.error === 'time') {
        //                 return false;
        //             }
        //             var notify = new Audio(location.port+"//"+location.host+"/sounds/u_edomlenie-9.mp3");
        //             notify.play();
        //
        //             M.toast({html: `<a href="${e.link}">${e.name}</a>`, classes: 'toast-alert', displayLength: 12000});
        //         }
        //     );
        // }, 1000);


        // $("#winTeam2").hide();
        // $("#winTeam1").hide();

        $("#prevMatch, #pastMatch, #chat, #chatPanel").hide();


        $("#mainPreloader").show();
        $("#mainHide").css("visibility", "hidden");



        var id = $("#serverId").val();
        var chartMain = null;

        //gruzim graphiki
        $.get(
            location.protocol + "//" + location.host + "/api/v1.0/getRealtimeStat/" + id + "/" + 0 + "/?"+new Date().getTime(),
            (e)=> {
                var labels = [];
                var data = [];

                let j = 0;
                for (let i = 0; i < e.radiant_lead.length; i++) {
                    if (e.radiant_lead[i].time_match.split(':')[0] == "0") {
                        e.radiant_lead = e.radiant_lead.slice(i, e.radiant_lead.length);
                        break;
                    }
                }

                // console.log(e.radiant_lead);

                let dataGraph = [];
                for (let i = 0; i < e.radiant_lead.length; i++) {
                    if (e.radiant_lead[i].match_score != 0) {
                        dataGraph.push({x: e.radiant_lead[i].time_match, y: Number(e.radiant_lead[i].match_score)});
                        labels.push(e.radiant_lead[i].time_match);
                        data.push(Number(e.radiant_lead[i].match_score));
                    }
                }

                chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: labels,//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [{
                            label: 'Net worth',
                            borderColor: 'rgb(255, 150, 33)',
                            data: data,
                            pointRadius: 1,

                        }]
                    },

                    // Configuration options go here
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    callback: function(value, index, values) {
                                        return value.toString().replace(/-/gi, "");
                                    }
                                }

                            }]
                        },
                        yAxes: [{
                            ticks: {
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold",
                                beginAtZero: true,
                                maxTicksLimit: 5,
                                padding: 20,
                                callback: function(value, index, values) {
                                    return value.toString().replace(/-/gi, "");
                                }
                            },
                            gridLines: {
                                drawTicks: false,
                                display: false
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                zeroLineColor: "transparent"
                            },
                            ticks: {
                                padding: 20,
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold"
                            }
                        }]
                    },
                });

                let winsTeam1 = e.radiant_team_info !== null ? e.radiant_team_info.winCount : 0;
                let loseTeam1 = e.radiant_team_info !== null ? e.radiant_team_info.lossCount : 0;
                let winsTeam2 = e.dire_team_info !== null ? e.dire_team_info.winCount : 0;
                let loseTeam2 = e.dire_team_info !== null ? e.dire_team_info.lossCount : 0;
                let ratingT1 = winsTeam1*loseTeam1;
                let ratingT2 = winsTeam2*loseTeam2;

                var opt = {
                    type: 'bar',
                    data: {
                        labels: [e.team_name_radiant, e.team_name_dire],
                        datasets: [{
                            label: 'Winrate, %',
                            data: [Math.round((winsTeam1/(winsTeam1+loseTeam1))*100), Math.round((winsTeam2/(winsTeam2+loseTeam2))*100)],
                            backgroundColor:['rgb(255,150,0)', 'rgb(126,126,126)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }

                };
                var graph1;
                graph1 = new Chart(document.getElementById('myStas').getContext('2d'), opt);

                // var graph2 = new Chart(document.getElementById('myStat').getContext('2d'), opt);
                // var graph3 = new Chart(document.getElementById('myStatYY').getContext('2d'), opt);

                var objRat = {
                    type: 'doughnut',

                    data: {
                        labels: [e.team_name_radiant, e.team_name_dire],
                        datasets: [{
                            label: 'Rating, %',
                            backgroundColor:['rgb(255,150,0)', 'rgb(126,126,126)'],
                            data: [ratingT1, ratingT2]
                        }]
                    },
                    options: {}
                }

                var graphRating;
                graphRating = new Chart(document.getElementById('myRating').getContext('2d'), objRat);

            }
        )

        let strInt = setInterval(()=>{
            $.get(
                location.protocol + "//" + location.host + "/api/v1.0/getRealtimeStat/" + id + "/" + 0 + "/?"+new Date().getTime(),
                (e)=>{
                    $("#mainStream").hide();
                    try {
                        $("#streamsList").empty();
                        if (e.streams.length > 0) {
                            $("#streamsList").empty();
                            e.streams.sort((a, b)=>b.viewers - a.viewers);
                            // e.streams.sort((a, b)=>{
                            //     if (a.provider === "youtube") return -1;
                            //     if (a.provider === "twitch") return 0;
                            //     if (a.provider === "huomao") return 1;
                            // });
                            let k = 0;
                            e.streams.map((e, i) => {
                                // if (k>=8) return false;
                                if (e.provider == "youtube") {
                                    $("#streamsList").append(`
                                  <div class="streams-item" provider="youtube" href="https://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg">
              <a class="stream-link"><i class="fab fa-youtube red-text" style="margin-right: 3px;"></i>${e.channel}</a>
                            <span class="stream-teams">${e.title}</span>

              <span class="stream-lang">${e.language || "EN"}</span>
            </div>`);
                                    $("#mainStream").show();
                                    $(".players").removeClass('players_no-stream');
                                    $(".statistics-bar").removeClass('statistics-bar_no-stream');
                                    $(".right-bar").removeClass('right-bar_no-stream');
                                    $(".news").removeClass('news_no-stream');
                                    $(".streams").removeClass('streams_no-stream');
                                    $("#player").attr('src', `https://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg&mute=1`);
                                    // $("#playerStreams").load(`http://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg`);
                                    // $("#streamCur").empty().append(`<iframe id="player" type="text/html"
                                    // src="http://www.youtube.com/embed/${e.embed_id}?autoplay=1&origin=https://ollo.gg"
                                    // frameborder="0"></iframe>`);
                                    k++;
                                }

                                if (e.provider == "twitch") {
                                    $("#streamsList").append(`
              <div class="streams-item" provider="youtube" provider="twitch" href="https://player.twitch.tv/?channel=${e.channel}&autoplay=true">
              <a class="stream-link"><i class="fab fa-twitch purple-text" style="margin-right: 3px;"></i>${e.channel}</a>
                            <span class="stream-teams">${e.title}</span>

              <span class="stream-lang">${e.language || "EN"}</span>
            </div>`);
                                    $("#mainStream").show();
                                    $(".players").removeClass('players_no-stream');
                                    $(".statistics-bar").removeClass('statistics-bar_no-stream');
                                    $(".right-bar").removeClass('right-bar_no-stream');
                                    $(".news").removeClass('news_no-stream');
                                    $(".streams").removeClass('streams_no-stream');
                                    $("#player").attr('src', `https://player.twitch.tv/?channel=${e.channel}&muted=true&autoplay=true`);
                                    //     $("#streamCur").show().empty().append(`
                                    // <iframe src="https://player.twitch.tv/?channel=${e.channel}" frameborder="0" scrolling="no" allowfullscreen="true"> </iframe>
                                    // `);
                                    k++;
                                }
                                if (e.provider == "huomao") {
                                    if (!/d/gi.test(e.embed_id)) {
                                        if (e.viewers > 80000) {

                                            $("#streamsList").append(`
            <div class="streams-item" provider="huomao" href="https://huomao.com/live/${e.embed_id}">
              <a class="stream-link">${e.channel}</a>
                            <span class="stream-teams">${e.title}</span>

              <span class="stream-lang">${e.language || "CH"}</span>
            </div>
           `);
                                            $(".players").addClass('players_no-stream');
                                            $(".statistics-bar").addClass('statistics-bar_no-stream');
                                            $(".right-bar").addClass('right-bar_no-stream');
                                            $(".news").addClass('news_no-stream');
                                            $(".streams").addClass('streams_no-stream');
                                            $("#mainStream").hide();
                                            // $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                                            // k++;
                                        }
                                        k++;
                                    }
                                }

                                // if (k === 0) {
                                //     $(".players").addClass('players_no-stream');
                                //     $(".statistics-bar").addClass('statistics-bar_no-stream');
                                //     $(".right-bar").addClass('right-bar_no-stream');
                                //     $(".news").addClass('news_no-stream');
                                //     $(".streams").addClass('streams_no-stream');
                                //     $("#mainStream").hide();
                                //     $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                                // }
                            });
                            clearInterval(strInt);
                        } else {
                            $(".players").addClass('players_no-stream');
                            $(".statistics-bar").addClass('statistics-bar_no-stream');
                            $(".right-bar").addClass('right-bar_no-stream');
                            $(".news").addClass('news_no-stream');
                            $(".streams").addClass('streams_no-stream');
                            $("#mainStream").hide();
                            $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                        }
                    } catch (e) {
                        console.log(e);
                        $(".players").addClass('players_no-stream');
                        $(".statistics-bar").addClass('statistics-bar_no-stream');
                        $(".right-bar").addClass('right-bar_no-stream');
                        $(".news").addClass('news_no-stream');
                        $(".streams").addClass('streams_no-stream');
                        $("#mainStream").hide();
                        $("#streamsList").append(`<span class="no-streems">Список трансляций пуст...</span>`);
                    }
                }
            )}, 1000);

        getStats(id, 0);
        let scr = setInterval(()=> {
            getStats(id, 1, scr);
        }, 1000);
    }

    function getStats(id, ft, scr) {
        $.get(
            location.protocol + "//" + location.host + "/api/v1.0/getRealtimeStat/" + id + "/" + ft + "/?"+new Date().getTime(),
            (e) => {
                if (e.error === "time") {
                    sessionStorage.setItem('_sound', '1');
                    return;
                }
                if (sessionStorage.getItem('_sound') === null) sessionStorage.setItem('_sound', '1');


                if (sessionStorage.getItem('_sound') === '1') {
                    var notify = new Audio(location.port + "//" + location.host + "/sounds/for-sure.mp3");
                    notify.volume = Number(localStorage.getItem('__volume'));
                    // notify.play();
                }
                sessionStorage.setItem('_sound', '0');
                if (e === []) {
                    var aud = new Audio(location.port+"//"+location.host+"/sounds/to-the-point.mp3");
                    aud.volume = Number(localStorage.getItem('__volume'));
                    aud.play();
                    clearInterval(scr);
                    // location.assign(location.protocol + "//" + location.host + "match/" + id);
                    // return;
                }

                $("#team1Players").empty();
                $("#team1Heroes").empty();
                $("#team2Players").empty();
                $("#team2Heroes").empty();
                console.log(e);
                try {
                    $("#bookMaker").html(e.league_id !== null || e.leagueid ? e.league_id.name : "");
                } catch (e) {

                    // setTimeout(()=> {
                    //
                    //     // location.assign(location.protocol + "//" + location.host + "/match/" + id+"?ended=true");
                    // }, 500);
                }

                if (e.isEnded || e.building_state === undefined) {
                    var aud = new Audio(location.port+"//"+location.host+"/sounds/to-the-point.mp3");
                    aud.volume = Number(localStorage.getItem('__volume'));
                    aud.play();
                    if (e.radiant_score > e.dire_score) {
                        $("#winTeam1").addClass('win_team');
                        $("#team1Score").addClass("score-meet-win");
                    }
                    else {
                        $("#winTeam2").addClass('win_team');
                        $("#team2Score").addClass("score-meet-win");
                    }

                    $.post(
                        location.protocol + "//" + location.host + "/server/matches/saveMatch.php",
                        {
                            matchId: id,
                            direLogo: e.hasOwnProperty('team_id_dire') ? e.team_logo_dire.hasOwnProperty('data') ? e.team_logo_dire.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png" : location.protocol + "//" + location.host + "/images/team-z_2.png",
                            radLogo: e.hasOwnProperty('team_id_radiant') ? e.team_logo_radiant.hasOwnProperty('data') ? e.team_logo_radiant.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png" : location.protocol + "//" + location.host + "/images/team-z_2.png",
                            direName: e.team_name_dire,
                            radName: e.team_name_radiant,
                            direScore: e.dire_score,
                            radScore: e.radiant_score,
                            radWin: e.radiant_score > e.dire_score ? "yes" : "no"
                        }
                    );

                    clearInterval(scr);

                    // return;

                }

                $(".team1Name").html(e.team_name_radiant);
                $(".team2Name").html(e.team_name_dire);
                $("#team1Score").html(e.radiant_score);
                $("#team2Score").html(e.dire_score);

                $(".team1Pic").attr("src", e.hasOwnProperty('team_logo_radiant') ? e.team_logo_radiant.hasOwnProperty('data') ? e.team_logo_radiant.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png" : location.protocol + "//" + location.host + "/images/team-z_2.png")
                    .addClass(e.hasOwnProperty('team_logo_radiant') ? e.team_logo_radiant.hasOwnProperty('data') ? "" : "darkPic" : "darkPic");
                $(".team2Pic").attr("src", e.hasOwnProperty('team_id_dire') ? e.team_logo_dire.hasOwnProperty('data') ? e.team_logo_dire.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png" : location.protocol + "//" + location.host + "/images/team-z_2.png")
                    .addClass(e.hasOwnProperty('team_logo_dire') ? e.team_logo_dire.hasOwnProperty('data') ? "" : "darkPic" : "darkPic");

                $("#time").html(e.game_time.replace(/-/g, ''));
                $("#bestOf").html("BO" + e.lobby_type);

                try {

                    for (let i = 0; i <= 4; i++) {
                        let classQuest = "";
                        if (e.players[i].heroid.name === "") classQuest = "questionDark";
                        let items = "";
                        if (e.players[i].hasOwnProperty("items")) {
                            for (let j = 0; j < 6; j++) {
                                if (e.players[i].items[j] !== 0 && /d/gi.test(e.players[i].items[j].toString())) {
                                    items += `<img src="${e.players[i].items[j]}" class="hero-item"/>`;
                                }
                            }
                        }
                        $("#team1Heroes").append(`
<div class="players-item">
<!--                                <img src="${e.players[i].hero_id}" alt="" class="player-photo">-->
                                <div class="player-info">
                                    <div class="info-title">
<!--                                        <img src="assets/images/UKRAINEFLAG1.png" alt=""class="player-country">-->
                                        <span class="player-nick">${e.players[i].hasOwnProperty("name") ? e.players[i].name || "Player" : ""}</span>
<!--                                        <span class="player-hero-name">Pudge</span>-->
                                    </div>
                                    <div class="player-hero">
                                        <img src="${e.players[i].heroid.name !== "" ? e.players[i].hero_pic : location.protocol + "//" + location.host +"/images/zaglushka_w.gif"}" class="${classQuest}" alt="" >
                                        ${items}
                                    </div>
                                    <div class="player-statistics">
                                        <div class="statistics-item">
                                            <img src="images/images/sword.png" class="iconDark" alt="">
                                            <span class="kills-number">${e.players[i].kill_count}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/skull.png" class="iconDark" alt="">
                                            <span class="death-number">${e.players[i].death_count}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/line-chart.png" class="iconDark" alt="">
                                            <span class="chart-number">${e.players[i].net_worth}</span>

                                        </div>
                                    </div>
                                </div>
                            </div>
              `);
                    }

                    for (let i = 5; i <= 9; i++) {
                        let classQuest = "";
                        if (e.players[i].heroid.name === "") classQuest = "questionDark";
                        let items = "";
                        if (e.players[i].hasOwnProperty("items")) {
                            for (let j = 0; j < 6; j++) {
                                if (e.players[i].items[j] !== 0 && /d/gi.test(e.players[i].items[j].toString())) {
                                    items += `<img src="${e.players[i].items[j]}" class="hero-item"/>`;
                                }
                            }
                        }
                        $("#team2Heroes").append(`
                         <div class="players-item">
                                <div class="player-info player-info_team2">
                                    <div class="info-title info-title_team2">
<!--                                        <span class="player-hero-name">Pudge</span>-->
                                        <span class="player-nick">${e.players[i].hasOwnProperty("name") ? e.players[i].name || "Player" : ""}</span>
<!--                                        <img src="assets/images/UKRAINEFLAG1.png" alt=""class="player-country">-->

                                    </div>
                                    <div class="player-hero player-hero_team2">
                                        <img src="${e.players[i].heroid.name !== "" ? e.players[i].hero_pic : location.protocol + "//" + location.host +"/images/zaglushka_w.gif"}" class="${classQuest}" alt="" >
                                        ${items}
                                    </div>
                                    <div class="player-statistics player-statistics_team2">
                                        <div class="statistics-item">
                                            <img src="images/images/line-chart.png" class="iconDark" alt="">
                                            <span class="chart-number">${e.players[i].net_worth}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/skull.png" class="iconDark" alt="">
                                            <span class="death-number">${e.players[i].death_count}</span>
                                        </div>
                                        <div class="statistics-item">
                                            <img src="images/images/sword.png" class="iconDark" alt="">
                                            <span class="kills-number">${e.players[i].kill_count}</span>
                                        </div>
                                    </div>
                                </div>
<!--                                <img src="assets/images/player-photo-1.png" alt="" class="player-photo">-->
                            </div>
                      `);
                    }
                } catch (e) {
// console.log(e);
                }

                if (e.fb_player === null) $(".fb").hide();
                else {
                    $(".fb").show();
                    $("#firstblood").html(e.fb_player.steamAccount.name);
                }

                try {
                    let banT1 = 1, banT2 = 1;
                    $("#bansTeam1").empty().append(e.radiant_bans.map((e) => `<div class="ban-img">
                                <div class="hero-ban-img" style="background-image: url('${e.hero_id}');"></div>
                                <span class="ban-text">Ban ${banT1++}</span>
                            </div>`));
                    $("#bansTeam2").empty().append(e.dire_bans.map((e) => `<div class="ban-img">
                                <div class="hero-ban-img" style="background-image: url('${e.hero_id}');"></div>
                                <span class="ban-text">Ban ${banT2++}</span>
                            </div>`));
                } catch (e) {

                }
                var labels = [];
                var data = [];

                let j = 0;
                for(let i = 0; i < e.radiant_lead.length; i++){
                    if (e.radiant_lead[i].time_match.split(':')[0] == "0") {
                        e.radiant_lead = e.radiant_lead.slice(i, e.radiant_lead.length);
                        break;
                    }
                }

                // console.log(e.radiant_lead);

                let dataGraph = [];
                for(let i = 0; i < e.radiant_lead.length; i++){
                    if (e.radiant_lead[i].match_score != 0) {
                        dataGraph.push({x: e.radiant_lead[i].time_match, y: e.radiant_lead[i].match_score});
                        labels.push(e.radiant_lead[i].time_match);
                        data.push(e.radiant_lead[i].match_score);
                    }
                }

                $(".netWorth").empty();

                if (data.length > 0) {
                    if (data[data.length - 1] < 0){
                        $(".nw").addClass('nw-right');
                        $(".nw").removeClass('nw-left').html('   <span >Преимущество <i class="fas fa-arrow-up" style="margin-right:5px"></i><span style="display:flex;align-items:center;margin-left: 20px;"><i class="material-icons">show_chart</i>' + Math.abs(data[data.length - 1])+'</span></span>');
                    }
                    else{
                        $(".nw").addClass('nw-left');
                        $(".nw").removeClass('nw-right').html('<span >Преимущество <i class="fas fa-arrow-up" style="margin-right:5px"></i><span style="display:flex;align-items:center;margin-left: 20px;"><i class="material-icons">show_chart</i>' + Math.abs(data[data.length - 1])+'</span></span>');
                    }
                }
                // else $("#nwRight").html('<i class="material-icons">show_chart</i>'+Math.abs(data[data.length-1]));

                var tower1 = 0, tower2 = 0, barracks1 = 0, barracks2 = 0;
                var tows = [], tows1 = [], bars = [], bars1 = [];

                // e.building.map((el)=>{
                //     if (el.type == 0 || el.type == 2) {
                //         tows1.push(!el.destroyed);
                //     }
                //
                //     if (el.type == 1) {
                //         bars1.push(!el.destroyed);
                //     }
                // });
                tows = e.building_state.towers;



                // for(let i = 0; i < 22; i < )
                // tows = convertTowerStateToList(e.tower_state, tows);
                //
                // bars = convertBarrackStateToList(e.barracks_state, bars);
                //
                try {
                    if (e.building.length == 2) {
                        for (let i = 0; i < tows.length; i++) tows[i] = true;
                    }
                    if (e.tower_state === 0 || e.tower_state === null) {

                        for (let i = 0; i < 24; i++) tows1[i] = true;
                        for (let i = 0; i < tows.length; i++) tows[i] = true;
                    }

                    tows.map(el => !el);

                    if (e.barracks_state === 1 || e.barracks_state === 0) {
                        for (let i = 0; i < 12; i++) bars1[i] = true;
                        // for (let i = 0; i < tows.length; i++) tows[i] = true;
                    }

                } catch (e) {

                }


                bars = e.building_state.barracks;

                if (bars.indexOf(false) > 0 && bars.indexOf(false) <= 5) {
                    tows.push(false);
                    tows.push(false);
                }
                else {
                    tows.push(true);
                    tows.push(true);

                }
                if (bars.indexOf(false) > 11 && bars.indexOf(false) <= 11) {
                    tows.push(false);
                    tows.push(false);
                }
                else {
                    tows.push(true);
                    tows.push(true);

                }

                for(let i = 0; i <= 8; i++) {
                    if (!tows[i]) tower1 ++;
                }
                for (let i = 9; i <= 17; i++) {
                    if (!tows[i]) tower2++;
                }
                for(let i = 18; i <= 19; i++) {
                    if (!tows[i]) tower1 ++;
                }
                for (let i = 20; i <= 21; i++) {
                    if (!tows[i]) tower2++;
                }


                for (let i = 0; i <= 5; i++) {
                    if (!bars[i]) barracks1++;
                }

                for (let i = 6; i <= 11; i++) {
                    if (!bars[i]) barracks2++;
                }
                //
                // if (e.tower_state === null) {
                //     tower1 = 0;
                //     tower2 = 0;
                // }


                let winsTeam1 = e.radiant_team_info !== null ? e.radiant_team_info.winCount : 0;
                let loseTeam1 = e.radiant_team_info !== null ? e.radiant_team_info.lossCount : 0;
                let winsTeam2 = e.dire_team_info !== null ? e.dire_team_info.winCount : 0;
                let loseTeam2 = e.dire_team_info !== null ? e.dire_team_info.lossCount : 0;
                let ratingT1 = winsTeam1*loseTeam1;
                let ratingT2 = winsTeam2*loseTeam2;

                $(".pastScoreWinTeam1").html(`${winsTeam1}`);
                $(".pastScoreWinTeam2").html(`${winsTeam2}`);
                $(".pastScoreLoseTeam1").html(`${loseTeam1}`);
                $(".pastScoreLoseTeam2").html(`${loseTeam2}`);

                // console.log(ratingT1, ratingT2);


                // var graphRating2 = new Chart(document.getElementById('myRatin1g').getContext('2d'), objRat);

                //if (e.barracks_state == 1) barracks1++;
                $(".team2Towers").html(11 - tower2);
                $(".team1Towers").html(11 - tower1);
                $(".team2Barracks").html(6 - barracks2);
                $(".team1Barracks").html(6 - barracks1);


                imgToCanvasLive(tows, bars);

                console.log(e.radiant_lead.length);
                console.log(typeof e.radiant_lead.length);
                // console.log(e.radiant_lead);
                //   e.radiant_lead.map((el)=>{
                //       labels.push(el.time_match);
                //       data.push(el.match_score);
                //   });


                if (chart !== null) {
                    chart.data.labels.push(labels[labels.length-1]);
                    chart.data.datasets.forEach((dataset) => {
                        dataset.data.push(data[data.length-1]);
                    });
                    chart.update();
                }
                // chart = new Chart(ctx, {
                //     // The type of chart we want to create
                //     type: 'line',
                //
                //     // The data for our dataset
                //     data: {
                //         labels: labels,//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                //         datasets: [{
                //             label: 'Net worth',
                //             borderColor: 'rgb(255, 150, 33)',
                //             data: data,
                //             pointRadius: 1,
                //
                //         }]
                //     },
                //
                //     // Configuration options go here
                //     options: {
                //         yAxes: [{
                //             ticks: {
                //                 fontColor: "rgba(0,0,0,0.5)",
                //                 fontStyle: "bold",
                //                 beginAtZero: true,
                //                 maxTicksLimit: 5,
                //                 padding: 20
                //             },
                //             gridLines: {
                //                 drawTicks: false,
                //                 display: false
                //             }
                //         }],
                //         xAxes: [{
                //             gridLines: {
                //                 zeroLineColor: "transparent"
                //             },
                //             ticks: {
                //                 padding: 20,
                //                 fontColor: "rgba(0,0,0,0.5)",
                //                 fontStyle: "bold"
                //             }
                //         }]
                //     },
                // });



                // var d = {};
                // e.game_list.map((el)=>{
                //     console.log(el.match_id);
                //     if (el.match_id.toString() === id) d = el;
                // });
                //
                // console.log(d);
                //
                // $.get()

                // $(".team1Pic").attr("src", e.sport_event.competitors[0].id.logo.url);
                // $(".team2Pic").attr("src", e.sport_event.competitors[1].id.logo.url);

                //$("#mapMatch").hide();


                $("#mainHide").css("visibility", "visible");
                $("#mainPreloader").hide();
            }
        )
    }
});
