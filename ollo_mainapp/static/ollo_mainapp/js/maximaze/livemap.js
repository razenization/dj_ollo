var radiant_tower = new Image(); radiant_tower.src = "images/map-images/radiant_tower.png";
var dire_tower = new Image(); dire_tower.src = "images/map-images/dire_tower.png";
var radiant_barak = new Image(); radiant_barak.src = "images/map-images/radiant_barak.png";
var dire_barak = new Image(); dire_barak.src = "images/map-images/dire_barak.png";
var radiant_tron = new Image(); radiant_tron.src = "images/map-images/radiant_tron.png";
var dire_tron = new Image(); dire_tron.src = "images/map-images/dire_tron.png";

var dis_radiant_tower = new Image(); dis_radiant_tower.src = "images/map-images/dis_radiant_tower.png";
var dis_dire_tower = new Image(); dis_dire_tower.src = "images/map-images/dis_dire_tower.png";
var dis_radiant_barak = new Image(); dis_radiant_barak.src = "images/map-images/dis_radiant_barak.png";
var dis_dire_barak = new Image(); dis_dire_barak.src = "images/map-images/dis_dire_barak.png";



function imgToCanvasLive(tw, br){
    // var tw = [], br = [];
    // tw = convertTowerStateToList(t, tw);
    // br = convertBarrackStateToList(b, br);
    //
    // if (t === 0 || t === null) {
    //     for(let i = 0; i < tw.length; i++) tw[i] = true;
    // }
    //
    // if (b === 1 || b === 0) {
    //     for(let i = 0; i < br.length; i++) br[i] = true;
    // }
    //aalo ya kostil
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

            coordsB1.map((e)=>{
                drawBarrackRadiant(cx, e.x*10, e.y*9.5);
            });

            coordsB2.map((e)=>{
                drawBarrackDire(cx, e.x*10, e.y*9.5);
            });

            coordsT1.map((e)=>{
                drawTowerRadiant(cx, e.x*10, e.y*9.5);
            });

            coordsT2.map((e)=>{
                drawTowerDire(cx, e.x*10, e.y*9.5);
            });

            try {


                if (true) {
                    //rt1
                    if (!tw[6]) {
                        drawBreakTowerRadiant(cx, 5*10, 45*9.5);
                    }

                    //rt2
                    if (!tw[7]) {
                        drawBreakTowerRadiant(cx, 5*10, 85*9.5);
                    }

                    //rt3
                    if (!tw[8]) {
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
                    if (!tw[0]) {
                        drawBreakTowerRadiant(cx, 135*10, 151*9.5);
                    }

                    //rb2
                    if (!tw[1]) {
                        drawBreakTowerRadiant(cx, 95*10, 151*9.5);
                    }

                    //rb3
                    if (!tw[2]) {
                        drawBreakTowerRadiant(cx, 55*10, 151*9.5);
                    }

                    if (!tw[18]) {
                        drawBreakTowerRadiant(cx, 20*10, 135*9.5);
                    }

                    if (!tw[19]) {
                        drawBreakTowerRadiant(cx, 30*10, 145*9.5);
                    }
                    //

                    if (!tw[15]) {
                        drawBreakTowerDire(cx, 45*10, 5*9.5);
                    }

                    if (!tw[16]) {
                        drawBreakTowerDire(cx, 85*10, 5*9.5);
                    }

                    if (!tw[17]) {
                        drawBreakTowerDire(cx, 105*10, 5*9.5);
                    }

                    if (!tw[12]) {
                        drawBreakTowerDire(cx, 91*10, 69*9.5);
                    }

                    if (!tw[13]) {
                        drawBreakTowerDire(cx, 107*10, 52*9.5);
                    }

                    if (!tw[14]) {
                        drawBreakTowerDire(cx, 120*10, 39*9.5);
                    }

                    if (!tw[9]) {
                        drawBreakTowerDire(cx, 151*10, 135*9.5);
                    }

                    if (!tw[10]) {
                        drawBreakTowerDire(cx, 151*10, 95*9.5);
                    }

                    if (!tw[11]) {
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
let widthImg = 80;
let heightImg = 100;

let minusX = 5;
let minusY = 7;

function drawBreakTowerRadiant(cx, x, y) {
    // cx.beginPath();
    // cx.arc(x, y, 3.2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ff8700";
    // cx.fill();
    // cx.lineWidth = 2;
    // cx.strokeStyle = "#ffffff";
    // cx.stroke();
    cx.clearRect(x-minusX, y-minusY, widthImg, heightImg);
    cx.fillStyle = "#FF8700";
    cx.fillRect(x-minusX, y-minusY, widthImg, heightImg);
    cx.drawImage(dis_radiant_tower, x-minusX, y-minusY, widthImg, heightImg);
}

function drawBreakTowerDire(cx, x, y) {
    // cx.beginPath();
    // cx.arc(x, y, 3.2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ffffff";
    // cx.fill();
    // cx.lineWidth = 2;
    // cx.strokeStyle = "#ff8700";
    // cx.stroke();
    cx.clearRect(x-minusX, y-minusY, widthImg, heightImg);
    cx.drawImage(dis_dire_tower, x-minusX, y-minusY, widthImg, heightImg);
}

function drawTowerRadiant(cx, x, y) {
    // cx.beginPath();
    // cx.arc(x, y, 3.2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ffffff";
    // cx.fill();
    // cx.lineWidth = 2;
    // cx.strokeStyle = "#ffffff";
    // cx.stroke();
    cx.drawImage(radiant_tower, x-minusX, y-minusY, widthImg, heightImg);
}

function drawTowerDire(cx, x, y) {
    // cx.beginPath();
    // cx.arc(x, y, 3.2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ff8700";
    // cx.fill();
    // cx.lineWidth = 2;
    // cx.strokeStyle = "#ff8700";
    // cx.stroke();
    cx.drawImage(dire_tower, x-minusX, y-minusY, widthImg, heightImg);
}

function drawBreakBarrackRadiant(cx, x1, y1) {
    // cx.beginPath();
    // cx.arc(x1, y1, 2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ff8700";
    // cx.fill();
    // cx.lineWidth = 1;
    // cx.strokeStyle = "#ffffff";
    // cx.stroke();

    cx.clearRect(x1-minusX, y1-minusY, widthImg-40, heightImg-40);
    cx.fillStyle = "#FF8700";
    cx.fillRect(x1-minusX, y1-minusY, widthImg-40, heightImg-40);
    cx.drawImage(dis_radiant_barak, x1-minusX, y1-minusY, widthImg-40, heightImg-40);
}

function drawBreakBarrackDire(cx, x1, y1) {
    // cx.beginPath();
    // cx.arc(x1, y1, 2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ffffff";
    // cx.fill();
    // cx.lineWidth = 1;
    // cx.strokeStyle = "#ff8700";
    // cx.stroke();
    cx.clearRect(x1-minusX, y1-minusY, widthImg-40, heightImg-40);
    cx.drawImage(dis_dire_barak, x1-minusX, y1-minusY, widthImg-40, heightImg-40);
}

function drawBarrackRadiant(cx, x1, y1) {
    // cx.beginPath();
    // cx.arc(x1, y1, 2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ffffff";
    // cx.fill();
    // cx.lineWidth = 1;
    // cx.strokeStyle = "#ffffff";
    // cx.stroke();

    cx.drawImage(radiant_barak, x1-minusX, y1-minusY, widthImg-40, heightImg-40);
}

function drawBarrackDire(cx, x1, y1) {
    // cx.beginPath();
    // cx.arc(x1, y1, 2, 0, 2 * Math.PI, false);
    // cx.fillStyle = "#ff8700";
    // cx.fill();
    // cx.lineWidth = 1;
    // cx.strokeStyle = "#ff8700";
    // cx.stroke();
    cx.drawImage(dire_barak, x1-minusX, y1-minusY, widthImg-40, heightImg-40);
}