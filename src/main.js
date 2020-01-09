const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const mapSize = {
    x: 10,
    y: 10
};

const sizeTile = 32;

const urlTile = "https://i.imgur.com/fqG34pO.png";
const urlCharacter = "https://i.imgur.com/ucwvhlh.png";

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;

        image.onload = () => {
            resolve(image);
        };
        image.onerror = reject;
    });
}

renderMap();

async function renderMap() {
    const imageTile = await loadImage(urlTile);
    const imageCharacter = await loadImage(urlCharacter);

    for (let y = 0; y <= mapSize.y; y++) {
        for (let x = 0; x <= mapSize.x; x++) {
            context.drawImage(imageTile, x * sizeTile, y * sizeTile);
        }
    }

    context.drawImage(imageCharacter, 100, 100);
}
