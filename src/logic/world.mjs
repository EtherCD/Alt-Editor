import Area from "./area.mjs"
import Vector from "./vector.mjs"

export default class World {
    constructor(data) {
        this.mjson = data
        this.acc = new Vector(0, 0)
        this.name = data.name

        this.areas = {}

        this.fromJSON()
    }

    update() {

    }

    draw(ctx, off, fov) {
        ctx.beginPath()
        ctx.fillStyle = this.mjson.datas.title.fillStyle
        ctx.strokeStyle = this.mjson.datas.title.strokeStyle
        ctx.textAlign = "center"
        ctx.globalAlpha = 1
        ctx.font = "bold 35px Tahoma, Verdana, Segoe, sans-serif"
        ctx.lineWidth = 6
        ctx.strokeText(this.name, 1280 / 2, 40)
        ctx.fillText(this.name, 1280 / 2, 40)
        ctx.closePath()
        for (let a in this.areas) {
            this.areas[a].draw(ctx, off, fov)
        }
    }

    tileString(data, w) {
        let mx = 0
        if (data) {
            if (typeof data == 'string') {
                if (data == "-lastY") {
                    mx = this.acc.y - ((w) * 32)
                } else if (data == "-lastX") {
                    mx = this.acc.x - ((w) * 32)
                } else if (data == "lastX") {
                    mx = this.acc.x + ((w) * 32)
                } else if (data == "lastY") {
                    mx = this.acc.y + ((w) * 32)
                } else {
                    if (data.endsWith('t')) {
                        mx = data.slice(0, -1) * 32
                    } else
                        mx = eval(data)
                }
            } else {
                mx = data
            }
        }
        return mx
    }

    fromJSON() {
        let lpx = 0, lpy = 0
        let areasList = []
        Object.keys(this.mjson).forEach(val => {
            if (Number.isInteger(Number(val))) areasList.push(Number(val))
        })
        Object.keys(this.mjson).forEach((val, ind, arr) => {
            if (Number.isInteger(Number(val))) {
                let vec = new Vector(lpx, lpy)
                if (this.mjson[val].properties.position != undefined) {
                    vec.x = this.tileString(this.mjson[val].properties.position.x, this.mjson[val].properties.size.width)
                    vec.y = this.tileString(this.mjson[val].properties.position.y, this.mjson[val].properties.size.height)

                    this.acc.x = this.tileString(this.mjson[val].properties.position.x, this.mjson[val].properties.size.width)
                    this.acc.y = this.tileString(this.mjson[val].properties.position.y, this.mjson[val].properties.size.height)
                }
                this.areas[val] = new Area(this.mjson[val], this.mjson, vec, val)
                lpx += this.mjson[val].properties.size.width * 32
            }
        })
    }
}