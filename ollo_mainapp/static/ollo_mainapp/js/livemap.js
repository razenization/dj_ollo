var radiant_tower = new Image;
radiant_tower.src = "../../../map-images/radiant_tower.png";
var dire_tower = new Image;
dire_tower.src = "../../../map-images/dire_tower.png";
var radiant_barak = new Image;
radiant_barak.src = "../../../map-images/radiant_barak.png";
var dire_barak = new Image;
dire_barak.src = "../../../map-images/dire_barak.png";
var radiant_tron = new Image;
radiant_tron.src = "../../../map-images/radiant_tron.png";
var dire_tron = new Image;
dire_tron.src = "../../../map-images/dire_tron.png";
var dis_radiant_tower = new Image;
dis_radiant_tower.src = "../../../map-images/dis_radiant_tower.png";
var dis_dire_tower = new Image;
dis_dire_tower.src = "../../../map-images/dis_dire_tower.png";
var dis_radiant_barak = new Image;
dis_radiant_barak.src = "../../../map-images/dis_radiant_barak.png";
var dis_dire_barak = new Image;
dis_dire_barak.src = "../../../map-images/dis_dire_barak.png";

function imgToCanvasLive(a, c) {
    ["map"].map(function (d) {
        var b = null;
        null !== b && b.destroy();
        d = document.getElementById(d);
        d.height = 1610;
        d.width = 1600;
        b = d.getContext("2d");
        var e = new Image;
        e.src = "images/map-images/map_da_2.png";
        var f = [{x: 5, y: 45}, {x: 5, y: 85}, {x: 5, y: 105}, {x: 69, y: 91}, {x: 52, y: 107}, {
                x: 39,
                y: 120
            }, {x: 135, y: 151}, {x: 95, y: 151}, {x: 55, y: 151}, {x: 20, y: 135}, {x: 30, y: 145}],
            g = [{x: 45, y: 5}, {x: 85, y: 5}, {x: 105, y: 5}, {x: 91, y: 69}, {x: 107, y: 52}, {
                x: 120,
                y: 39
            }, {x: 151, y: 135}, {x: 151, y: 95}, {x: 151, y: 55}, {x: 135, y: 20}, {
                x: 145,
                y: 30
            }],
            h = [{x: 3, y: 120}, {x: 13, y: 120}, {x: 30, y: 123}, {x: 38, y: 135}, {x: 50, y: 147}, {x: 50, y: 159}],
            k = [{x: 120, y: 3}, {x: 120, y: 13}, {x: 123, y: 30}, {x: 135, y: 38}, {x: 147, y: 50}, {x: 155, y: 50}];
        e.onload = function (d) {
            b.drawImage(e, 0, 0);
            h.map(function (a) {
                drawBarrackRadiant(b, 10 * a.x, 9.5 * a.y)
            });
            k.map(function (a) {
                drawBarrackDire(b, 10 * a.x, 9.5 * a.y)
            });
            f.map(function (a) {
                drawTowerRadiant(b, 10 * a.x, 9.5 * a.y)
            });
            g.map(function (a) {
                drawTowerDire(b, 10 * a.x, 9.5 * a.y)
            });
            try {
                a[6] || drawBreakTowerRadiant(b, 50, 427.5), a[7] || drawBreakTowerRadiant(b,
                    50, 807.5), a[8] || drawBreakTowerRadiant(b, 50, 997.5), a[3] || drawBreakTowerRadiant(b, 690, 864.5), a[4] || drawBreakTowerRadiant(b, 520, 1016.5), a[5] || drawBreakTowerRadiant(b, 390, 1140), a[0] || drawBreakTowerRadiant(b, 1350, 1434.5), a[1] || drawBreakTowerRadiant(b, 950, 1434.5), a[2] || drawBreakTowerRadiant(b, 550, 1434.5), a[18] || drawBreakTowerRadiant(b, 200, 1282.5), a[19] || drawBreakTowerRadiant(b, 300, 1377.5), a[15] || drawBreakTowerDire(b, 450, 47.5), a[16] || drawBreakTowerDire(b, 850, 47.5), a[17] || drawBreakTowerDire(b, 1050, 47.5),
                a[12] || drawBreakTowerDire(b, 910, 655.5), a[13] || drawBreakTowerDire(b, 1070, 494), a[14] || drawBreakTowerDire(b, 1200, 370.5), a[9] || drawBreakTowerDire(b, 1510, 1282.5), a[10] || drawBreakTowerDire(b, 1510, 902.5), a[11] || drawBreakTowerDire(b, 1510, 522.5), a[20] || drawBreakTowerDire(b, 1350, 190), a[21] || drawBreakTowerDire(b, 1450, 285), console.log(a), console.log(c), c[0] || drawBreakBarrackRadiant(b, 30, 1140), c[1] || drawBreakBarrackRadiant(b, 130, 1140), c[2] || drawBreakBarrackRadiant(b, 300, 1168.5), c[3] || drawBreakBarrackRadiant(b,
                    380, 1282.5), c[4] || drawBreakBarrackRadiant(b, 500, 1396.5), c[5] || drawBreakBarrackRadiant(b, 500, 1510.5), c[6] || drawBreakBarrackDire(b, 1200, 28.5), c[7] || drawBreakBarrackDire(b, 1200, 123.5), c[8] || drawBreakBarrackDire(b, 1230, 285), c[9] || drawBreakBarrackDire(b, 1350, 361), c[10] || drawBreakBarrackDire(b, 1470, 475), c[11] || drawBreakBarrackDire(b, 1550, 475)
            } catch (l) {
            }
        }
    })
}

var widthImg = 80, heightImg = 100, minusX = 5, minusY = 7;

function drawBreakTowerRadiant(a, c, d) {
    a.clearRect(c - minusX, d - minusY, widthImg, heightImg);
    a.fillStyle = "#FF8700";
    a.fillRect(c - minusX, d - minusY, widthImg, heightImg);
    a.drawImage(dis_radiant_tower, c - minusX, d - minusY, widthImg, heightImg)
}

function drawBreakTowerDire(a, c, d) {
    a.clearRect(c - minusX, d - minusY, widthImg, heightImg);
    a.drawImage(dis_dire_tower, c - minusX, d - minusY, widthImg, heightImg)
}

function drawTowerRadiant(a, c, d) {
    a.drawImage(radiant_tower, c - minusX, d - minusY, widthImg, heightImg)
}

function drawTowerDire(a, c, d) {
    a.drawImage(dire_tower, c - minusX, d - minusY, widthImg, heightImg)
}

function drawBreakBarrackRadiant(a, c, d) {
    a.clearRect(c - minusX, d - minusY, widthImg - 40, heightImg - 40);
    a.fillStyle = "#FF8700";
    a.fillRect(c - minusX, d - minusY, widthImg - 40, heightImg - 40);
    a.drawImage(dis_radiant_barak, c - minusX, d - minusY, widthImg - 40, heightImg - 40)
}

function drawBreakBarrackDire(a, c, d) {
    a.clearRect(c - minusX, d - minusY, widthImg - 40, heightImg - 40);
    a.drawImage(dis_dire_barak, c - minusX, d - minusY, widthImg - 40, heightImg - 40)
}

function drawBarrackRadiant(a, c, d) {
    a.drawImage(radiant_barak, c - minusX, d - minusY, widthImg - 40, heightImg - 40)
}

function drawBarrackDire(a, c, d) {
    a.drawImage(dire_barak, c - minusX, d - minusY, widthImg - 40, heightImg - 40)
};