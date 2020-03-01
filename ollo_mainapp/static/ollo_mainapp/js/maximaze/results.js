$(function(){

    var PAGES = null;

    $(document).on("click", ".matchView", function () {
        let prev = $("#match"+(Number($(this).attr("ii")) !== 0 ? Number($(this).attr("ii")) - 1 : $(this).attr("ii"))).attr("match_id");
        let past = $("#match"+(Number($(this).attr("ii")) !== PAGES-1 ? Number($(this).attr("ii")) + 1 : $(this).attr("ii"))).attr("match_id");

        var matches = {
            prev: prev,
            past: past
        }

        sessionStorage.setItem("_match_nav", JSON.stringify(matches));

        location.assign(location.protocol+"//"+location.host+"/match/"+$(this).attr("match_id"));

    });

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

    var page = params['p'];
    var pNum = 15, prev = Number(page)-1, past= Number(page) + 1;
    var start = (page-1) * pNum;
    var stop = start+pNum;

    $("#left").click(function(){
        location.assign("matches/?p="+prev);
    });
    $("#right").click(function(){
        location.assign("matches/?p="+past);
    });

    $.get(
        location.protocol+"//"+location.host+"/api/v1.5/getTopTeams",
        (e)=>{
            for(let i = 0; i < 5; i++){
                let top = "";
                switch (e[i].team_place) {
                    case "1": top = "gold topTeamsScore"; break;
                    case "2": top = "silver topTeamsScore"; break;
                    case "3": top = "cooper topTeamsScore"; break;
                }
                $("#topTeams").append(`
<div class="rating-item">
                                <span class="number ${top}">${e[i].team_place}</span>
                                <img src="${e[i].team_logo}" class="rating-img" alt="" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')">
                                <span class="team-name">${e[i].team_name}</span>
                                <span class="points">${e[i].elo_count} очков</span>
                            </div>
                `)
            }
        }
    )


    $.get(
        // "https://api.opendota.com/api/proMatches",
        location.protocol+"//"+location.host+"/api/v1.1/getMatches?limit="+pNum+"&count="+stop+"&page="+page,
        (e)=>{
            $("#pastMatchesPreloader").hide();
            PAGES = e.count;
            //$("#pastsPreloader").hide();
            var pages = Math.round(e.count/pNum)+1;
            if (page == 1) $("#left").removeClass('waves-effect').addClass('disabled').unbind('click');
            if (page == (pages-1)) $("#right").removeClass('waves-effect').addClass('disabled').unbind('click');


            for(let i = 1; i < pages; i++) {
                $("#pages").append(`<li class="`+(i == page ? "active" : "waves-effect" )+`"><a href="matches/?p=${i}">${i}</a></li>`);
            }

            for (let i = 0; i < e.matches.length; i++) {
                //let i = k-1;
                if (e.matches[i].name_team1 !== "" && e.matches[i].name_team2 !== "") {
                    let t1win = "score-r", t2win = "score-l";
                    if (e.matches[i].radiant_win === "1") {
                        t2win = "score-r";
                        t1win = "score-l";
                    }
                    if (e.matches[i].radiant_win === "no") {
                        t1win = ""; t2win = "";
                    }
                    $("#pastMatches").append(`<li class="collection-item matchView" ii="${i}" match_id="${e.matches[i].match_id}" id="match${i}">
                <div class="view">
                    <img src="${e.matches[i].logo_team1 || location.protocol + "//" + location.host + "/images/team-z_2.png"}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
                    <h5>${e.matches[i].name_team1}</h5>
                    <h5 class="${t1win}">${e.matches[i].score_team1}</h5>
                    <h5>:</h5>
                    <h5 class="${t2win}">${e.matches[i].score_team2}</h5>
                    <h5>${e.matches[i].name_team2}</h5>
                    <img src="${e.matches[i].logo_team2 || location.protocol + "//" + location.host + "/images/team-z_2.png"}" onError="this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')" alt="">
                    
                    <!--<h5>${e.matches[i].league_name}</h5>-->
                    <!--<img src="${e.matches[i].leagueid}" alt="">-->
                  </div>

                </li>`);

                }
            }

        }
    );

});
