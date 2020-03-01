$(function () {
    var f = null;
    $(document).on("click", ".matchView", function () {
        var b = $("#match" + (0 !== Number($(this).attr("ii")) ? Number($(this).attr("ii")) - 1 : $(this).attr("ii"))).attr("match_id"),
            a = $("#match" + (Number($(this).attr("ii")) !== f - 1 ? Number($(this).attr("ii")) + 1 : $(this).attr("ii"))).attr("match_id");
        sessionStorage.setItem("_match_nav", JSON.stringify({prev: b, past: a}));
        location.assign(location.protocol + "//" + location.host + "/match/" + $(this).attr("match_id"))
    });
    var d = window.location.search.replace("?",
        "").split("&").reduce(function (b, a) {
        var c = a.split("=");
        b[decodeURIComponent(c[0])] = decodeURIComponent(c[1]);
        return b
    }, {}).p, g = Number(d) - 1, h = Number(d) + 1, k = 15 * (d - 1) + 15;
    $("#left").click(function () {
        location.assign("matches/?p=" + g)
    });
    $("#right").click(function () {
        location.assign("matches/?p=" + h)
    });
    $.get(location.protocol + "//" + location.host + "/api/v1.5/getTopTeams", function (b) {
        for (var a = 0; 5 > a; a++) {
            var c = "";
            switch (b[a].team_place) {
                case "1":
                    c = "gold topTeamsScore";
                    break;
                case "2":
                    c = "silver topTeamsScore";
                    break;
                case "3":
                    c = "cooper topTeamsScore"
            }
            $("#topTeams").append('\n<div class="rating-item">\n                                <span class="number ' + c + '">' + b[a].team_place + '</span>\n                                <img src="' + b[a].team_logo + '" class="rating-img" alt="" onError="this.onerror=null;this.src=location.protocol + \'//\' + location.host + \'/images/team-z_2.png\';$(this).addClass(\'darkPic\')">\n                                <span class="team-name">' + b[a].team_name + '</span>\n                                <span class="points">' +
                b[a].elo_count + " \u043e\u0447\u043a\u043e\u0432</span>\n                            </div>\n                ")
        }
    });
    $.get(location.protocol + "//" + location.host + "/api/v1.1/getMatches?limit=15&count=" + k + "&page=" + d, function (b) {
        $("#pastMatchesPreloader").hide();
        f = b.count;
        var a = Math.round(b.count / 15) + 1;
        1 == d && $("#left").removeClass("waves-effect").addClass("disabled").unbind("click");
        d == a - 1 && $("#right").removeClass("waves-effect").addClass("disabled").unbind("click");
        for (var c = 1; c < a; c++) $("#pages").append('<li class="' +
            (c == d ? "active" : "waves-effect") + ('"><a href="matches/?p=' + c + '">' + c + "</a></li>"));
        for (a = 0; a < b.matches.length; a++) if ("" !== b.matches[a].name_team1 && "" !== b.matches[a].name_team2) {
            c = "score-r";
            var e = "score-l";
            "1" === b.matches[a].radiant_win && (e = "score-r", c = "score-l");
            "no" === b.matches[a].radiant_win && (e = c = "");
            $("#pastMatches").append('<li class="collection-item matchView" ii="' + a + '" match_id="' + b.matches[a].match_id + '" id="match' + a + '">\n                <div class="view">\n                    <img src="' + (b.matches[a].logo_team1 ||
                location.protocol + "//" + location.host + "/images/team-z_2.png") + "\" onError=\"this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')\" alt=\"\">\n                    <h5>" + b.matches[a].name_team1 + '</h5>\n                    <h5 class="' + c + '">' + b.matches[a].score_team1 + '</h5>\n                    <h5>:</h5>\n                    <h5 class="' + e + '">' + b.matches[a].score_team2 + "</h5>\n                    <h5>" + b.matches[a].name_team2 + '</h5>\n                    <img src="' +
                (b.matches[a].logo_team2 || location.protocol + "//" + location.host + "/images/team-z_2.png") + "\" onError=\"this.onerror=null;this.src=location.protocol + '//' + location.host + '/images/team-z_2.png';$(this).addClass('darkPic')\" alt=\"\">\n\n                    \x3c!--<h5>" + b.matches[a].league_name + '</h5>--\x3e\n                    \x3c!--<img src="' + b.matches[a].leagueid + '" alt="">--\x3e\n                  </div>\n\n                </li>')
        }
    })
});