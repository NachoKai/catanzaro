const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const mapSize = {
    x: 10,
    y: 10
};

const sizeTile = 32;

const image = new Image();
image.src = "https://github.com/NachoKai/catanzaro/blob/gh-pages/img/floor.png?raw=true";

image.onload = function() {
    for (let y = 0; y <= mapSize.y; y++) {
        for (let x = 0; x <= mapSize.x; x++) {
            context.drawImage(image, x * sizeTile, y * sizeTile);
        }
    }
};