import Vector from "./vector.mjs"
import Zone from "./zone.mjs"

export default class Area {
    constructor(data, wdata, pos, id) {
        this.id = id
        this.ajson = data
        this.mjson = wdata

        this.size = new Vector(data.properties.size.width * 32, data.properties.size.height * 32)
        this.color = wdata.datas.fillStyle
        this.pos = pos
        this.zones = {}
        this.name = data.properties["only-name"] || data.properties["area-name"] || id
        this.oldSize = new Vector(this.size.x+0, this.size.y+0)
        this.fromJSON()

        this.hovered = false
        this.selected = false

        this.lineDashOff = 0
    }

    interract(type, x = 0, y = 0) {
        if (type == "move") {

        }
    }

    update(timeFix, delta) {
        this.lineDashOff += delta / 20
        if (this.lineDashOff > 16) {
            this.lineDashOff = 0
        }
        
    }

    getPanelValue(selector) {
        return document
            .querySelector('#panel')
            .querySelector('#panel-area-props')
            .querySelector(selector)
            .querySelector('input').value
    }

    fromJSON() {
        if (this.ajson.zones == undefined) return
        for (let z in this.ajson.zones) {
            this.zones[z] = new Zone(this.ajson.zones[z], this.size, this.pos)
        }
    }

    changeProp(element, value) {
        this.ajson.properties[element] = value
    }

    reverse() {
        return this.ajson
    }

    changeProps() {
        this.ajson.properties.size.width = this.getPanelValue("#width")
        this.ajson.properties.size.height = this.getPanelValue("#height")
        this.changeProp("friction", this.getPanelValue("#friction"))
        this.changeProp("only-name", this.getPanelValue("#only-name"))
        this.changeProp("area-name", this.getPanelValue("#area-name"))
        this.changeProp("lighting", this.getPanelValue("#lighting"))
        this.size = new Vector(this.ajson.properties.size.width * 32, this.ajson.properties.size.height * 32)
        this.name = this.ajson.properties["only-name"] || this.ajson.properties["area-name"] || this.id
        if (this.size != this.oldSize) {
            
        }
        this.oldSize = new Vector(this.size.x+0, this.size.y+0)
    }

    toHTML() {
        return `
        <li>Area: <span>${this.id}</span></li>
        <li id="width">Width: <input type="number" placeholder="80" value=${this.ajson.properties.size.width}></li>
        <li id="height">Height: <input type="number" placeholder="16" value=${this.ajson.properties.size.height}></li>
        <li id="friction">Friction: <input type="number" placeholder="0.75" max="10" value=${this.ajson.properties.friction || 0.75}></li>
        <li id="only-name">Only-Name: <input type="text" placeholder="?" value="${this.ajson.properties["only-name"] || ""}"></li>
        <li id="area-name">Area-Name: <input type="text" placeholder="?" value="${this.ajson.properties["area-name"] || ""}"></li>
        <li id="lighting">Lighting: <input type="number" placeholder="0" max="1" min="0" value=${this.ajson.properties["lighting"] || 0}></li>
        `
    }

    draw(ctx, off, fov) {
        for (let z in this.zones) {
            this.zones[z].draw(ctx, off, fov)
        }
        ctx.beginPath()
        ctx.globalAlpha = this.mjson.datas.fillAlpha || 0.19
        ctx.fillStyle = this.color
        ctx.lineWidth = 6
        ctx.strokeStyle = "FFF46C"
        ctx.fillRect((this.pos.x - off.x) / fov, (this.pos.y - off.y) / fov, (this.size.x) / fov, (this.size.y) / fov)
        if (this.selected) {
            ctx.globalAlpha = 1
            ctx.setLineDash([5, 5])
            ctx.lineDashOffset = -this.lineDashOff
            ctx.strokeRect((this.pos.x - off.x) / fov, (this.pos.y - off.y) / fov, (this.size.x) / fov, (this.size.y) / fov)
            ctx.setLineDash([0, 0])
            ctx.lineDashOffset = 0
        }
        else if (this.hovered) {
            ctx.globalAlpha = 1
            ctx.strokeRect((this.pos.x - off.x) / fov, (this.pos.y - off.y) / fov, (this.size.x) / fov, (this.size.y) / fov)
        }
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = this.mjson.datas.title.fillStyle
        ctx.strokeStyle = this.mjson.datas.title.strokeStyle
        ctx.textAlign = "center"
        ctx.globalAlpha = 1
        ctx.font = "bold " + 35 * 5 / fov + "px Tahoma, Verdana, Segoe, sans-serif"
        ctx.lineWidth = 6
        ctx.strokeText(this.name, ((this.pos.x + this.size.x / 2) - off.x) / fov, ((this.pos.y + this.size.y / 2) - off.y) / fov)
        ctx.fillText(this.name, ((this.pos.x + this.size.x / 2) - off.x) / fov, ((this.pos.y + this.size.y / 2) - off.y) / fov)
        ctx.closePath()
    }
}