import Vector from "./vector.mjs"
import Zone from "./zone.mjs"

export default class Area {
    constructor(data, wdata, pos, id) {
        this.ajson = data
        this.mjson = wdata

        this.size = new Vector(data.properties.size.width * 32, data.properties.size.height * 32)
        this.color = wdata.datas.fillStyle
        this.pos = pos
        this.zones = {}
        this.name = data.properties["only-name"] || data.properties["area-name"] || id
        this.fromJSON()
    }

    fromJSON() {
        if (this.ajson.zones == undefined) return
        for (let z in this.ajson.zones) {
            this.zones[z] = new Zone(this.ajson.zones[z], this.size, this.pos)
        }
    }

    draw(ctx, off, fov) {
        for (let z in this.zones) {
            this.zones[z].draw(ctx, off, fov)
        }
        ctx.beginPath()
        ctx.globalAlpha = this.mjson.datas.fillAlpha || 0.19
        ctx.fillStyle = this.color
        ctx.lineWidth = 1
        ctx.fillRect((this.pos.x - off.x)/fov, (this.pos.y - off.y)/fov, (this.size.x)/fov, (this.size.y)/fov)
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = this.mjson.datas.title.fillStyle
        ctx.strokeStyle = this.mjson.datas.title.strokeStyle
        ctx.textAlign = "center"
        ctx.globalAlpha = 1
        ctx.font = "bold "+35*5/fov+"px Tahoma, Verdana, Segoe, sans-serif"
        ctx.lineWidth = 6
        ctx.strokeText(this.name, ((this.pos.x + this.size.x / 2)  - off.x)/fov, ((this.pos.y + this.size.y / 2)  - off.y)/fov)
        ctx.fillText(this.name, ((this.pos.x + this.size.x / 2)  - off.x)/fov, ((this.pos.y + this.size.y / 2)  - off.y)/fov)
        ctx.closePath()
    }
}