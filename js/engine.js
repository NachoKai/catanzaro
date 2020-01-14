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
                x: 3,
                y: 5
            }
        };

        this.sizeTile = 32;

        this.urls = {
            grass: "./images/grass.png",
            character: "./images/character.png",
            poster: "./images/poster.png",
            tree: "./images/tree.png",
            water: "./images/water.png"
        };

        this.images = {};
        this.map = [];
    }

    async initialize() {
        await this.loadImages();
        await this.loadMap();
        await this.renderMap();
        this.renderEnvironment();
        this.renderCharacter();

        this.initializeKeys();
    }

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

    async loadMap() {
        const response = await fetch("/maps/city.json");
        const result = await response.json();

        this.map = result;
    }

    async loadImages() {
        for (let nameUrl in this.urls) {
            const url = this.urls[nameUrl];

            const imageLoaded = await this.loadImage(url);
            this.images[nameUrl] = imageLoaded;
        }
    }

    async renderMap() {
        for (let y = 0; y <= this.mapSize.y - 1; y++) {
            for (let x = 0; x <= this.mapSize.x - 1; x++) {
                const tile = this.map[y][x];

                this.ctx.background.drawImage(
                    this.images[tile.background],
                    x * this.sizeTile,
                    y * this.sizeTile
                );
            }
        }
    }

    renderEnvironment() {
        for (let y = 0; y <= this.mapSize.y - 1; y++) {
            for (let x = 0; x <= this.mapSize.x - 1; x++) {
                const tile = this.map[y][x];
                if (tile.hasOwnProperty('foreground')) {
                    this.ctx.foreground.drawImage(
                        this.images[tile.foreground],
                        x * this.sizeTile,
                        y * this.sizeTile
                    )
                    if (tile.hasOwnProperty('posterText')) {
                        this.ctx.foreground.font = "9pt Helvetica";
                        this.ctx.foreground.fillStyle = "white";
                        this.ctx.foreground.fillText(
                            tile.posterText,
                            x * this.sizeTile + 10,
                            y * this.sizeTile + 30
                        );
                    }
                }
            }
        }
    }

    renderCharacter() {
        this.ctx.foreground.drawImage(
            this.images.character,
            this.user.pos.x * this.sizeTile,
            this.user.pos.y * this.sizeTile - 32
        );
    }

    clearCanvas() {
        this.ctx.foreground.clearRect(
            0,
            0,
            this.mapSize.x * this.sizeTile,
            this.mapSize.y * this.sizeTile
        );
    }

    initializeKeys() {
        document.addEventListener("keydown", e => {
            switch (e.keyCode) {
                case this.keys.arrowUp:
                    if (
                        !this.map[this.user.pos.y - 1][this.user.pos.x].block
                    ) {
                        this.user.pos.y--;
                    }
                    break;
                case this.keys.arrowDown:
                    if (
                        !this.map[this.user.pos.y + 1][this.user.pos.x].block
                    ) {
                        this.user.pos.y++;
                    }
                    break;
                case this.keys.arrowLeft:
                    if (
                        !this.map[this.user.pos.y][this.user.pos.x - 1].block
                    ) {
                        this.user.pos.x--;
                    }
                    break;
                case this.keys.arrowRight:
                    if (
                        !this.map[this.user.pos.y][this.user.pos.x + 1].block
                    ) {
                        this.user.pos.x++;
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