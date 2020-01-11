class Engine {
    constructor(context) {
        this.ctx = context;
        this.keys = {
            arrowUp: 38,
            arrowDown: 40,
            arrowLeft: 37,
            arrowRight: 39
        };
        this.mapSize = {
            x: 10,
            y: 10
        };
        this.user = {
            pos: {
                x: 170,
                y: 130
            }
        };
        this.sizeTile = 32;
        this.urls = {
            grass: "https://i.imgur.com/fqG34pO.png",
            character: "https://i.imgur.com/ucwvhlh.png",
            poster: "https://i.imgur.com/NXIjxr8.png",
            tree: "https://i.imgur.com/wIK2b9P.png",
            sea: "https://i.imgur.com/4BZGw0M.png"
        };
        this.images = {};
    }

    // todas las funciones y procesos que nuestro juego tiene que correr para iniciarse
    async initialize() {
        //siendo loadImages una función async, gracias al await podemos esperar que se descarguen las imágenes para recién pasar a la siguiente función
        await this.loadImages();
        await this.renderMap();
        this.renderEnvironment();
        this.renderCharacter();
        this.initializeKeys();
    }

    // necesitamos tener descargadas todas las imágenes
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                resolve(image);
            };
            image.onerror = reject;
        });
    }

    async loadImages() {
        for (let nameUrl in this.urls) {
            const url = this.urls[nameUrl];
            const imageLoaded = await this.loadImage(url);
            this.images[nameUrl] = imageLoaded;
        }
    }

    //renderiza el mapa
    async renderMap() {
        // descargar el archivo del mapa city.json
        const response = await fetch("/maps/city.json");
        const result = await response.json();
        for (let y = 0; y <= this.mapSize.y - 1; y++) {
            for (let x = 0; x <= this.mapSize.x - 1; x++) {
                const tile = result[y][x];
                this.ctx.background.drawImage(
                    this.images[tile.background],
                    x * this.sizeTile,
                    y * this.sizeTile
                );
            }
        }
    }

    /* todos los assets que queramos cargar en el juego, como árboles, carteles, piedras, etc */
    renderEnvironment() {
        // const response = await fetch("/maps/city.json");
        // const result = await response.json();
        // for (let y = 0; y <= this.mapSize.y - 1; y++) {
        //     for (let x = 0; x <= this.mapSize.x - 1; x++) {
        //         const tile = result[y][x];
        //         this.ctx.background.drawImage(
        //             this.images[tile.background],
        //             x * this.sizeTile,
        //             y * this.sizeTile
        //         );
        //     }
        // }

        this.ctx.foreground.drawImage(this.images.tree, 25, 100);
        this.ctx.foreground.drawImage(this.images.poster, 150, 40);
        this.ctx.foreground.font = "9pt Helvetica";
        this.ctx.foreground.fillStyle = "white";
        this.ctx.foreground.fillText("Welcome to my Square!", 160, 70);
    }

    //renderiza al personaje
    renderCharacter() {
        this.ctx.foreground.drawImage(
            this.images.character,
            this.user.pos.x,
            this.user.pos.y
        );
    }

    // limpia el canvas
    clearCanvas() {
        this.ctx.foreground.clearRect(
            0,
            0,
            this.mapSize.x * this.sizeTile,
            this.mapSize.y * this.sizeTile
        );
    }

    //vamos a limpiar y renderizar todo cada vez que nos movamos
    initializeKeys() {
        document.addEventListener("keydown", e => {
            switch (e.keyCode) {
                case this.keys.arrowUp:
                    if (!this.map[this.user.pos.y / this.sizeTile - 2][this.user.pos.x / this.sizeTile].block) {
                        this.user.pos.y -= this.sizeTile;
                    }
                    break;
                case this.keys.arrowDown:
                    if (!this.map[this.user.pos.y / this.sizeTile + 2][this.user.pos.x / this.sizeTile].block) {
                        this.user.pos.y += this.sizeTile;
                    }
                    break;
                case this.keys.arrowLeft:
                    if (!this.map[this.user.pos.y / this.sizeTile][this.user.pos.x / this.sizeTile - 1].block) {
                        this.user.pos.x -= this.sizeTile;
                    }
                    break;
                case this.keys.arrowRight:
                    if (!this.map[this.user.pos.y / this.sizeTile][this.user.pos.x / this.sizeTile + 1].block) {
                        this.user.pos.x += this.sizeTile;
                    }
                    break;
                default:
                    break;
            }

            this.clearCanvas();
            this.renderCharacter();
            this.renderEnvironment();
        });
    }
}

const background = document.getElementById("background");
const foreground = document.getElementById("foreground");
const context = {
    background: background.getContext("2d"),
    foreground: foreground.getContext("2d")
};
const engine = new Engine(context);
engine.initialize();