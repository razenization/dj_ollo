(function () {
    $(".accordion").click(function () {
        $(this).addClass('active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 100);
    });

    $(document).on('click', '.match_link', function () {
        location.assign($(this).attr('href'));
    });

    var nameT1 = $("#nameT1").val();
    var nameT2 = $("#nameT2").val();

    var winsT1 = Number($("#winT1").val());
    var winsT2 = Number($("#winT2").val());
    var loseT1 = Number($("#loseT1").val());
    var loseT2 = Number($("#loseT2").val());
    var ratT1 = Number($("#ratingT1").val());
    var ratT2 = Number($("#ratingT2").val());

// барный график
    var ctx = document.getElementById('BarChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: [nameT1, nameT2],
            datasets: [{
                label: 'Winrate, %',

                backgroundColor:['rgb(255,150,0)', 'rgb(126,126,126)'],
                data: [
                    Math.round((winsT1/(winsT1+loseT1))*100),
                    Math.round((winsT2/(winsT2+loseT2))*100)
                ]
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
    });

// круговой график
    var ctxx = document.getElementById('PieChart').getContext('2d');
    var chartToo = new Chart(ctxx, {
        type: 'doughnut',

        data: {
            labels: [nameT1, nameT2],
            datasets: [{
                label: 'Rating, %',
                backgroundColor:['rgb(255,150,0)', 'rgb(126,126,126)'],
                data: [ratT1, ratT2]
            }]
        },
        options: {}
    });
})();
