(function ($) {
    $(function () {
        var matchId = "{{ match.id|escapejs }}";

        var matchSocket = new WebSocket(
            'ws://' + window.location.host +
            '/cs/ws/matches/' + matchId + '/');

        matchSocket.onmessage = function (e) {
            var data = JSON.parse(e.data);
            var json_pack = data['message'];
            var parsed = JSON.parse(json_pack);
            console.log(parsed['map_name']);
            console.log(parsed['terrorists']['score']);
            if (parsed['terrorists']['name'] === "{{ match.team_set.all.0.name|escapejs }}") {
                $('#team1Score').text(parsed['terrorists']['score']);
            } else {
                $('#team2Score').text(parsed['terrorists']['score']);
            }
        };

        matchSocket.onclose = function (e) {
            console.error('Live socket closed unexpectedly');
        };
    });
});