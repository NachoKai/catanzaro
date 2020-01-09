const canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    mapSize = {
        x: 10,
        y: 10
    },
    sizeTile = 32,
    urlTile = "https://i.imgur.com/fqG34pO.png",
    urlCharacter = "https://i.imgur.com/ucwvhlh.png",
    urlCartel = "https://i.imgur.com/NXIjxr8.png",
    urlArbol = "https://i.imgur.com/wIK2b9P.png"

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
    const imageTile = await loadImage(urlTile),
        imageCharacter = await loadImage(urlCharacter),
        imageCartel = await loadImage(urlCartel),
        imageArbol = await loadImage(urlArbol)

    for (let y = 0; y <= mapSize.y; y++) {
        for (let x = 0; x <= mapSize.x; x++) {
            context.drawImage(imageTile, x * sizeTile, y * sizeTile);
        }
    }

    context.drawImage(imageCartel, 150, 40);
    context.drawImage(imageArbol, 25, 150);
    context.drawImage(imageCharacter, 170, 120);
    context.font = "9pt Helvetica";
    context.fillStyle = "white";
    context.fillText("Welcome to my Square!", 160, 70);
}