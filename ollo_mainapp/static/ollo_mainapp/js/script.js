$(function(){

    $("#main-content").css('visibility', 'hidden');

    var k = 0;
    function isAjaxComplete()
    {
        if (++k == 3) {

            $("#main-content").css('visibility', 'visible');
        }
    }

    $(document).on("click", ".matchView", function () {
        let prev = $("#match"+(Number($(this).attr("ii")) !== 0 ? Number($(this).attr("ii")) - 1 : $(this).attr("ii"))).attr("match_id");
        let past = $("#match"+(Number($(this).attr("ii")) !== 4 ? Number($(this).attr("ii")) + 1 : $(this).attr("ii"))).attr("match_id");

        var matches = {
            prev: prev,
            past: past
        };

        sessionStorage.setItem("_match_nav", JSON.stringify(matches));

        location.assign(location.protocol+"//"+location.host+"/match/"+$(this).attr("match_id"));

    });

    $("#noLive").hide();

    $.get(
        location.protocol+"//"+location.host+"/api/v1.1/getMatches?count=0&limit=10&page=1",
        // "https://api.opendota.com/api/proMatches",
        // location.protocol+"//"+location.host+"/data/pasts.json",
        (e)=>{
            //$("#endedPreloader").hide();
            $("#pastMatchesPreloader").hide();
            for (let i = 0; i < 10; i++) {
                if (e.matches[i].name_team1 !== "" && e.matches[i].name_team2 !== "") {
                    let t1win = "score-r", t2win = "score-l";
                    if (e.matches[i].radiant_win === "1") {
                        t2win = "score-r";
                        t1win = "score-l";
                    }
                    if (e.matches[i].radiant_win === "no") {
                        t1win = ""; t2win = "";
                    }

                    $("#endedMatches").append(`<li class="collection-item matchView" ii="${i}" match_id="${e.matches[i].match_id}" id="match${i}">
                <div class="view">
                    <img src="${e.matches[i].logo_team1 || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg" alt="">
                    <h5>${e.matches[i].name_team1}</h5>
                    <h5 class="${t1win}">${e.matches[i].score_team1}</h5>
                    <h5>:</h5>
                    <h5 class="${t2win}">${e.matches[i].score_team2}</h5>
                    <h5>${e.matches[i].name_team2}</h5>
                    <img src="${e.matches[i].logo_team2 || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg" alt="">
                    
                    <!--<h5>${e.matches[i].league_name}</h5>-->
                    <!--<img src="${e.matches[i].leagueid}" alt="">-->
                  </div>

                </li>`);

                    $("#pastPreloader").hide();
                    $("#pastMobi").append(`
                        <div class="past-matches__item matchView" ii="${i}" match_id="${e.matches[i].match_id}">
                    <img src="${e.matches[i].logo_team1 || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="team-logo-past">
                    <span class="team-name-match  team-name_past">${e.matches[i].name_team1}</span>
                    <span class="score-past" style="color: #F57142;">${e.matches[i].score_team1}</span>
                    <span class="delimiter delimiter_past">:</span>
                    <span class="score-past" style="color:#23CD97;">${e.matches[i].score_team2}</span>
                    <span class="team-name-match  team-name_past">${e.matches[i].name_team2}</span>
                    <img src="${e.matches[i].logo_team2 || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="team-logo-past">
                </div>
                        `);

                }
            }

            isAjaxComplete();
        }
    );

    $(document).on("click", ".lives", function(){
        location.assign(location.protocol+"//"+location.host+"/"+$(this).attr("hr"));
    });

    function getLives() {

        $.get(
            location.protocol + "//" + location.host + "/data/lives.json?"+new Date().getTime(),
            (e) => {

                $("#liveMatches").empty();
                $("#livesMobi").empty();
                let k = 0;
                e.game_list.map((el) => {
                    if (el.team_name_dire !== undefined && el.team_name_radiant !== undefined) {
                        k++;
                        $("#liveMatches").append(`
                <li class="collection-item lives" hr="live/match/${el.match_id}">
                <div class="live-tour-in">
                <h4>${el.league_id !== null ? el.league_id.name : ""}</h4>
                </div>
                  <div class="view live-score-view">
                    <div class="live hide-on-small-only">LIVE</div>
                    <div class="live hide-on-med-and-up"><i class="material-icons">brightness_1</i></div>
                    
                    
                    <div class="live-name-and-logo">
                    <img src="${el.team_logo_radiant !== null && el.team_logo_radiant.hasOwnProperty('data') ? el.team_logo_radiant.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png"}"  class="picImg ${!el.team_logo_radiant.hasOwnProperty('data') ? "darkPic" : ""}" alt="">
                    <h5>${el.team_name_radiant}</h5>
                    </div>
                    
                    <div class="score-view">
                  <div class="live-teams-score">
                    <h5>${el.radiant_score}</h5>
                    <h5 class="delim-score">:</h5>
                    <h5>${el.dire_score}</h5>
                     </div>
                  </div>
                  
                  <div class="live-name-and-logo">
                    <h5>${el.team_name_dire}</h5>
                    <img src="${el.team_logo_dire !== null && el.team_logo_dire.hasOwnProperty('data') ? el.team_logo_dire.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png"}"  class="picImg ${!el.team_logo_dire.hasOwnProperty('data') ? "darkPic" : ""}" alt="">
                    </div>
                   
  
                    
                  </div>
                   
                  </div>
                </li>`);

                        $("#livesMobi").append(`
                        <div class="live-matches__item lives" hr="live/match/${el.match_id}">
                    <div class="live-match-tournament">${el.league_id !== null ? el.league_id.name : ""}</div>
                    <div class="live-match-info">
                        <span class="live-match-info-title">Информация о матче</span>
                        <span class="score-live" >Счёт</span>
                        <span class="netw" >Преимущество</span>
                    </div>
                    <div class="live-match-team">
                        <img src="${el.team_logo_radiant !== null && el.team_logo_radiant.hasOwnProperty('data') ? el.team_logo_radiant.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="team-logo picImg ${!el.team_logo_radiant.hasOwnProperty('data') ? "darkPic" : ""}">
                        <span class="team-name-match">${el.team_name_radiant}</span>
                        <span class="team-score">${el.radiant_score}</span>
                        <span class="team-nw">${el.radiant_lead > 0 ? el.radiant_lead : "" }</span>
                    </div>
                    <div class="live-match-team">
                        <img src="${el.team_logo_dire !== null && el.team_logo_dire.hasOwnProperty('data') ? el.team_logo_dire.data.url : location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="team-logo picImg ${!el.team_logo_dire.hasOwnProperty('data') ? "darkPic" : ""}">
                        <span class="team-name-match">${el.team_name_dire}</span>
                        <span class="team-score">${el.dire_score}</span>
                        <span class="team-nw">${el.radiant_lead < 0 ? Math.abs(el.radiant_lead) : ""}</span>
                    </div>


                </div>
                        `);
                    }
                });
                if (k === 0) {
                    $("#livesMobi").empty().append("Матчей нет...");
                    $("#noLive").show();
                }
                isAjaxComplete();
            }
        );
    }

    getLives();
    setInterval(()=>{
        getLives();
    }, 10000);
    // <!--                    <h5>loot.bet</h5>-->
//                     <!--<h5>${ee.teams[0].payout.toFixed(2)}</h5>-->
//                     <!--<h5>:</h5>-->
//                     <!--<h5>${ee.teams[1].payout.toFixed(2)}</h5>-->
//                     <!--<h5><- Коэфициенты</h5>-->
    $.get(
        // 'https://limitless-tor-59512.herokuapp.com/',
        location.protocol+"//"+location.host+"/api/v1.0/getUpcoming",
        (ee)=>{

            // e.map((ee)=>{
//             for (let i = 0; i < (ee.length < 10 ? ee.length : 10 ); i++){
//                 // let d = spacetime(ee.startTime, 'Europe/Moscow');
//                 let stTime = ee[i].startTime+" UTC";
//                 let date = new Date(Date.parse(stTime));
//
//
//                 let wtf = date.toLocaleString('ru', {hour:"2-digit", minute:"2-digit", month: "2-digit",
//                     day: "numeric"}).replace(/,/gi, "").split(' ')[1].split(':')[0];
//
//                 // if (date.getDay() !== new Date(Date.now()).getDay()) return;
//
//                 if (new Date(Date.now()).getHours() >= Number(wtf) && date.getDay() === new Date(Date.now()).getDay())
//                     // return;
//                     // k++;
//                     continue;
//                 var curClass1 = "", curClass2 = "";
//                 if (ee[i].team1.logo_url === "/images/logos/dota/team-z_2.png" || ee[i].team1.logo_url ==="/images/team-z_2.png" ) curClass1 = "darkPic";
//                 if (ee[i].team2.logo_url === "/images/logos/dota/team-z_2.png" || ee[i].team2.logo_url ==="/images/team-z_2.png") curClass2 = "darkPic";
//                 $("#futuredMatches").append(`
//                 <li class="collection-item ">
//                   <div class="view upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${ee[i].team1.name}&team2=${ee[i].team2.name}">
//                     <div class="time-m">${date.toLocaleString('ru', {hour:"2-digit", minute:"2-digit", month: "2-digit",
//                     day: "numeric"}).replace(/,/gi, "")}</div>
//                     <img src="${ee[i].team1.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg1 ${curClass1}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
//                     <h5>${ee[i].team1.name}</h5>
//                     <h5>VS</h5>
//                     <h5>${ee[i].team2.name}</h5>
//                     <img src="${ee[i].team2.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg1 ${curClass2}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
//                   </div>
//                   <div class="score-view">
//                   </div>
//                 </li>
//                 `);
//
//                 // console.log(i<0, i)
//                 // console.log(i <= 1 ? i-1 : 0);
//                 $("#dateFirst").html(`${new Date(Date.parse( ee[0].startTime+" UTC")).toLocaleString('ru', {day: "numeric"})}.${new Date(Date.parse( ee[0].startTime+" UTC")).toLocaleString('ru', {month: "2-digit"})}.${new Date(Date.parse( ee[0].startTime+" UTC")).getFullYear()}`);
//
//                 let spDateMob = new Date(Date.parse(ee[i].startTime+" UTC")).toLocaleString('ru', {day: "numeric"}) !== new Date(Date.parse(ee[i >= 0 ? i-1 : 0].startTime+" UTC")).toLocaleString('ru', {day: "numeric"}) ? `<span class="upcoming-matches-date " >${date.toLocaleString('ru', {day: "numeric"})}.${date.toLocaleString('ru', {month: "2-digit"})}.${date.getFullYear()}</span>` : "";
//                 $("#upcomingMobi").append(`
// <!--                <div class="upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${ee[i].team1.name}&team2=${ee[i].team2.name}">-->
//                 ${spDateMob}
//                 <div class="upcoming-matches__item upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${ee[i].team1.name}&team2=${ee[i].team2.name}">
//                     <span class="upcoming-match-time">${date.toLocaleString('ru', {hour:"2-digit"})}:${date.toLocaleString('ru', {minute:"2-digit"}).length === 1 ? date.toLocaleString('ru', {minute:"2-digit"})+"0" : date.toLocaleString('ru', {minute:"2-digit"}) }</span>
//                     <img src="${ee[i].team1.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="picImg1 ${curClass1} team-logo-upcoming"><span class="team-name-match  team-name_upcoming">${ee[i].team1.name}</span>
//                     <span class="delimiter">vs</span>
//                     <img src="${ee[i].team2.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="picImg1 ${curClass2} team-logo-upcoming"><span class="team-name-match  team-name_upcoming">${ee[i].team2.name}</span>
// <!--                    <span class="upcoming-match-tournament">Winners League Season 3 Europe</span>-->
//                 </div>
// <!--                </div>-->`);
//                 //});
// //             e.tournaments.map((el)=>{
// //                 //el.matches.map((ee)=>{
// //                 let g = el.matches.length <= 15 ? el.matches.length : 15;
// //                  for(let i = 0; i < g; i++) {
// //                      let ee = el.matches[i];
// //                      $("#futuredMatches").append(`
// //                 <li class="collection-item">
// //                   <div class="view">
// //                     <div class="time-m">${ee.matchTime}</div>
// //                     <img src="${ee.teams[0].url_logo || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="">
// //                     <h5>${ee.teams[0].name}</h5>
// //                     <h5>VS</h5>
// //                     <img src="${ee.teams[1].url_logo || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="">
// //                     <h5>${ee.teams[1].name}</h5>
// // <!--                    <img src="images/tour.png" alt="">-->
// // <!--                    <h4>DreamHack Master M</h4>-->
// //                   </div>
// //                   <div class="score-view">
// // <!--                    <h5>loot.bet</h5>-->
// //                     <h5>${ee.teams[0].payout.toFixed(2)}</h5>
// //                     <h5>:</h5>
// //                     <h5>${ee.teams[1].payout.toFixed(2)}</h5>
// //                     <h5><- Коэфициенты</h5>
//
// //                   </div>
// //                 </li>
// //                 `);
// //                  }
//                 //})
            $("#upcomingMobiPreloader").hide();
            let isTD = false;
            if (ee[0].today.length > 0) {
                ee[0].today.map((e)=>{
                    if (Number(new Date(Date.parse(e.startTime+" UTC")).toLocaleString('ru', {day: "numeric"})) === Number(new Date(Date.parse(ee[1].tomorrow[0].startTime+" UTC")).toLocaleString('ru', {day: "numeric"})) ) isTD = true;
                });
                ee[0].today.map((e)=>{
                    let stTime = e.startTime+" UTC";
                    let date = new Date(Date.parse(stTime));

                    $("#dateFirst").html(`${date.toLocaleString('ru', {day: "numeric"})}.${date.toLocaleString('ru', {month: "2-digit"})}.${date.getFullYear()}`);

                    var curClass1 = "", curClass2 = "";
                    if (e.team1.logo_url === "/images/logos/dota/team-z_2.png" || e.team1.logo_url ==="/images/team-z_2.png" ) curClass1 = "darkPic";
                    if (e.team2.logo_url === "/images/logos/dota/team-z_2.png" || e.team2.logo_url ==="/images/team-z_2.png") curClass2 = "darkPic";
                    $("#futuredMatches").append(`
                <li class="collection-item ">
                  <div class="view upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${e.team1.name}&team2=${e.team2.name}">
                    <div class="time-m">${date.toLocaleString('ru', {hour:"2-digit", minute:"2-digit", month: "2-digit",
                        day: "numeric"}).replace(/,/gi, "")}</div>
                    <img src="${e.team1.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg1 ${curClass1}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
                    <h5>${e.team1.name}</h5>
                    <h5>VS</h5>
                    <h5>${e.team2.name}</h5>
                    <img src="${e.team2.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg1 ${curClass2}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
                  </div>
                  <div class="score-view">
                  </div>
                </li>
                `);


                $("#upcomingMobi").append(`
<!--                <div class="upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${e.team1.name}&team2=${e.team2.name}">-->
                <div class="upcoming-matches__item upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${e.team1.name}&team2=${e.team2.name}">
                    <span class="upcoming-match-time">${date.toLocaleString('ru', {hour:"2-digit"})}:${date.toLocaleString('ru', {minute:"2-digit"}).length === 1 ? date.toLocaleString('ru', {minute:"2-digit"})+"0" : date.toLocaleString('ru', {minute:"2-digit"}) }</span>
                    <img src="${e.team1.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="picImg1 ${curClass1} team-logo-upcoming"><span class="team-name-match  team-name_upcoming">${e.team1.name}</span>
                    <span class="delimiter">vs</span>
                    <img src="${e.team2.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="picImg1 ${curClass2} team-logo-upcoming"><span class="team-name-match  team-name_upcoming">${e.team2.name}</span>
<!--                    <span class="upcoming-match-tournament">Winners League Season 3 Europe</span>-->
                </div>
<!--                </div>-->`);
                });


            }

            if (ee[1].tomorrow.length > 0) {
                let tmrw = ee[1].tomorrow;
                for(let i = 0; i < tmrw.length <= 10 ? tmrw.length : 10; i++) {
                    let e = tmrw[i];
                    let stTime = e.startTime+" UTC";
                    let date = new Date(Date.parse(stTime));

                    if (!isTD)
                        $("#dateTmw").html(`${date.toLocaleString('ru', {day: "numeric"})}.${date.toLocaleString('ru', {month: "2-digit"})}.${date.getFullYear()}`);

                    var curClass1 = "", curClass2 = "";
                    if (e.team1.logo_url === "/images/logos/dota/team-z_2.png" || e.team1.logo_url ==="/images/team-z_2.png" ) curClass1 = "darkPic";
                    if (e.team2.logo_url === "/images/logos/dota/team-z_2.png" || e.team2.logo_url ==="/images/team-z_2.png") curClass2 = "darkPic";
                    $("#futuredMatches").append(`
                <li class="collection-item ">
                  <div class="view upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${e.team1.name}&team2=${e.team2.name}">
                    <div class="time-m">${date.toLocaleString('ru', {hour:"2-digit", minute:"2-digit", month: "2-digit",
                        day: "numeric"}).replace(/,/gi, "")}</div>
                    <img src="${e.team1.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg1 ${curClass1}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
                    <h5>${e.team1.name}</h5>
                    <h5>VS</h5>
                    <h5>${e.team2.name}</h5>
                    <img src="${e.team2.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" class="picImg1 ${curClass2}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
                  </div>
                  <div class="score-view">
                  </div>
                </li>
                `);

                    $("#upcomingMobiTM").append(`
<!--                <div class="upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${e.team1.name}&team2=${e.team2.name}">-->
                <div class="upcoming-matches__item upcomingAnalitics" linkTo="${location.protocol+"//"+location.host}/match/upcoming/?team1=${e.team1.name}&team2=${e.team2.name}">
                    <span class="upcoming-match-time">${date.toLocaleString('ru', {hour:"2-digit"})}:${date.toLocaleString('ru', {minute:"2-digit"}).length === 1 ? date.toLocaleString('ru', {minute:"2-digit"})+"0" : date.toLocaleString('ru', {minute:"2-digit"}) }</span>
                    <img src="${e.team1.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="picImg1 ${curClass1} team-logo-upcoming"><span class="team-name-match  team-name_upcoming">${e.team1.name}</span>
                    <span class="delimiter">vs</span>
                    <img src="${e.team2.logo_url || location.protocol + "//" + location.host + "/images/team-z_2.png"}" alt="" class="picImg1 ${curClass2} team-logo-upcoming"><span class="team-name-match  team-name_upcoming">${e.team2.name}</span>
<!--                    <span class="upcoming-match-tournament">Winners League Season 3 Europe</span>-->
                </div>
<!--                </div>-->`);
                }
            }
            isAjaxComplete();
        }
    );

    $.get(
        location.protocol+"//"+location.host+"/api/v1.0/news/getLastNews",
        (e)=>{
            e.map((el)=>{
                $("#newsPreloader").hide();
                $("#newsList").append(`
            <li class="collection-item">
                      <div class="card newsCard">
                          <div class="card-image waves-effect waves-block waves-light activator georgeBushLt" style="background-image: url('${location.protocol+"//"+location.host+"/news/pictures/"+el.news_pic}');">
                          </div>
                          <div class="card-content">
                              <span class="card-title activator grey-text text-darken-4">${el.news_name}</span>
                              <p><a href="news/${el.id_news}/" class="news-btn-txt">Перейти к статье</a>
                              </p>
                          </div>
                          <div class="card-reveal">
                              <span class="card-title grey-text text-darken-4">${el.news_name}<i class="material-icons right">close</i></span>
                              <p class="card_p">${el.news_short_desc}
                              <p><a href="news/${el.id_news}/" class="news-btn-txt">Перейти к статье</a>
                              </p>
                          </div>
                      </div>
                  </li>
            `);
            });
            isAjaxComplete();
        }
    );



    $(document).on('click', '.upcomingAnalitics', function(){
        location.assign($(this).attr('linkTo'));
    });

});