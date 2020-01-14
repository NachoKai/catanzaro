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
                x: 10,
                y: 10
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
        })
    }

    async loadMap() {
        // https://raw.githubusercontent.com/NachoKai/catanzaro/gh-pages/maps/city.json
        const response = await fetch("https://raw.githubusercontent.com/NachoKai/catanzaro/gh-pages/maps/city.json");
        this.map = await response.json();
    }

    async loadImages() {
        for (let nameUrl in this.urls) {
            const url = this.urls[nameUrl],
                imageLoaded = await this.loadImage(url)
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



    renderCharacter() {
        this.ctx.foreground.drawImage(
            this.images.character,
            this.user.pos.x,
            this.user.pos.y
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
                    if (this.map[Math.round(this.user.pos.y / this.sizeTile - 1)][Math.round(this.user.pos.x / this.sizeTile)].block) {
                        this.user.pos.y -= 0
                    } else {
                        this.user.pos.y -= this.sizeTile;
                    }
                    break;
                case this.keys.arrowDown:
                    if (this.map[Math.round(this.user.pos.y / this.sizeTile + 2)][Math.round(this.user.pos.x / this.sizeTile)].block) {
                        this.user.pos.y -= 0
                    } else {
                        this.user.pos.y += this.sizeTile;
                    }
                    break;
                case this.keys.arrowLeft:
                    if (this.map[Math.round(this.user.pos.y / this.sizeTile)][Math.round(this.user.pos.x / this.sizeTile - 1)].block) {
                        this.user.pos.x -= 0
                    } else {
                        this.user.pos.x -= this.sizeTile;
                    }
                    break;
                case this.keys.arrowRight:
                    if (this.map[Math.round(this.user.pos.y / this.sizeTile)][Math.round(this.user.pos.x / this.sizeTile + 1)].block) {
                        this.user.pos.x -= 0
                    } else {
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

const background = document.getElementById("background"),
    foreground = document.getElementById("foreground"),
    context = {
        background: background.getContext("2d"),
        foreground: foreground.getContext("2d")
    },
    engine = new Engine(context)
engine.initialize();