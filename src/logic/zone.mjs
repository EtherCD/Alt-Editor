export default class Zone {
    constructor(data, areaSize, aPos, id) {
        let w = areaSize.x
        let h = areaSize.y
        this.aPos = aPos
        this.areaSize = areaSize
        this.id = id

        this.w = this.tileString(data.w, w)
        this.h = this.tileString(data.h, h)
        this.x = this.tileString(data.x, w)
        this.y = this.tileString(data.y, h)

        this.cX = data.x
        this.cY = data.y
        this.cW = data.w
        this.cH = data.h

        this.translate = data.translate
        this.tpWorld = data.tpWorld || ""
        this.tpArea = data.tpArea || ""
        this.mSpeed = data.mSpeed || 0
        this.enemies = data.enemies

        this.x += this.aPos.x
        this.y += this.aPos.y

        this.color = "#333"
        this.type = data.type
        switch (data.type) {
            case "teleport": this.color = "#FFF46C"; break;
            case "victory": this.color = "#FFF46C"; break;
            case "safe": this.color = "#c1c1c1"; break;
            case "active": this.color = "#fff"; break;
            case "inversivity": this.color = "rgb(167,60,227,0.5)"; break;
            case "storm": this.color = "rgba(242,165,60, 0.5)"; break;
            case "slowdown": this.color = "#ECAC9B"; break;
            case "magnetism": this.color = "#B5A1E6"; break;
        }

        this.selected = false
    }

    defaultHtml() {
        return `
        <li id="type">Type: <span>${this.type}</span></li>
        <li id="x">X: <input type="text" placeholder="0" min="0" value="${this.cX}"></li>
        <li id="y">Y: <input type="text" placeholder="0" min="0" value="${this.cY}"></li>
        <li id="width">Width: <input type="text" placeholder="10" min="0" value="${this.cW}"></li>
        <li id="height">Height: <input type="text" placeholder="16"  min="0" value="${this.cH}"></li>
`
    }

    toHTML() {
        switch (this.type) {
            case "teleport":
                return `
                <li id="type">Type: <span>${this.type}</span></li>
                <li id="x">X: <input type="text" placeholder="0" min="0" value="${this.cX}"></li>
                <li id="y">Y: <input type="text" placeholder="0" min="0" value="${this.cY}"></li>
                <li id="width">Width: <input type="text" placeholder="10" min="0" value="${this.cW}"></li>
                <li id="height">Height: <input type="text" placeholder="16"  min="0" value="${this.cH}"></li>
                
                <li id="tpworld">tpWorld: <input type="text" placeholder="0" value="${this.tpWorld}"></li>
                <li id="tparea">tpArea: <input type="text" placeholder="0" value="${this.tpArea}"></li>
                
                <li id="translateX">translate->x: <input type="text" placeholder="0" value="${this.translate.x || 0}"></li>
                <li id="translateY">translate->y: <input type="text" placeholder="0" value="${this.translate.y || 0}"></li>
                <li id="translateCX">translate->cx: <input type="text" placeholder="0" value="${this.translate.cx || 0}"></li>
                <li id="translateCY">translate->cy: <input type="text" placeholder="0" value="${this.translate.cy || 0}"></li>
                <li id="translateSX">translate->sx: <input type="text" placeholder="0" value="${this.translate.sx || 0}"></li>
                <li id="translateSY">translate->sy: <input type="text" placeholder="0" value="${this.translate.sy || 0}"></li>
                `
            case "safe":
                return `
                <li id="type">Type: <span>${this.type}</span></li>
                <li id="x">X: <input type="text" placeholder="0" min="0" value="${this.cX}"></li>
                <li id="y">Y: <input type="text" placeholder="0" min="0" value="${this.cY}"></li>
                <li id="width">Width: <input type="text" placeholder="10" min="0" value="${this.cW}"></li>
                <li id="height">Height: <input type="text" placeholder="16"  min="0" value="${this.cH}"></li>
                <li id="mSpeed">mSpeed: <input type="text" placeholder="10"  min="0" value="${this.mSpeed}"></li>
                `
            /*case "active":
                return`
                <li id="type">Type: <span>${this.type}</span></li>
                <li id="x">X: <input type="text" placeholder="0" min="0" value="${this.cX}"></li>
                <li id="y">Y: <input type="text" placeholder="0" min="0" value="${this.cY}"></li>
                <li id="width">Width: <input type="text" placeholder="10" min="0" value="${this.cW}"></li>
                <li id="height">Height: <input type="text" placeholder="16"  min="0" value="${this.cH}"></li>
                `*/
            default: return this.defaultHtml()
        }
    }

    getPanelValue(selector) {
        return document
            .querySelector('#panel')
            .querySelector('#panel-zone-props')
            .querySelector(selector)
            .querySelector('input').value
    }

    reverse() {
        let zone = {
            "type": this.type,
            "x": this.cX,
            "y": this.cY,
            "w": this.cW,
            "h": this.cH
        }

        if (this.type == "teleport") {
            zone.translate = {}
            this.translate.x ? zone.translate.x = this.translate.x : 'none'
            this.translate.y ? zone.translate.y = this.translate.y : 'none'
            this.translate.cx ? zone.translate.cx = this.translate.cx : 'none'
            this.translate.cy ? zone.translate.cy = this.translate.cy : 'none'
            this.translate.sx ? zone.translate.sx = this.translate.sx : 'none'
            this.translate.sy ? zone.translate.sy = this.translate.sy : 'none'
            this.tpWorld ? zone.tpWorld = this.tpWorld : 'none'
            this.tpArea ? zone.tpArea = this.tpArea : 'none'
        }
        if (this.type == "safe") {
            this.mSpeed ? zone.mSpeed = this.mSpeed : 'none'
        }
        if (this.type == "active") {
            zone.enemies = this.enemies
        }

        return zone
    }

    changeProps() {
        this.cX = this.getPanelValue("#x") || 0
        this.cY = this.getPanelValue("#y") || 0
        this.cW = this.getPanelValue("#width") || 0
        this.cH = this.getPanelValue("#height") || 0

        this.w = this.tileString(this.cW, this.areaSize.x)
        this.h = this.tileString(this.cH, this.areaSize.y)
        this.x = this.tileString(this.cX, this.areaSize.x)
        this.y = this.tileString(this.cY, this.areaSize.y)
        this.x += this.aPos.x
        this.y += this.aPos.y

        switch (this.type) {
            case "teleport":
                this.teleport = {
                    x: this.getPanelValue("#translateX") || 0,
                    y: this.getPanelValue("#translateY") || 0,
                    cx: this.getPanelValue("#translateCX") || 0,
                    cy: this.getPanelValue("#translateCY") || 0,
                    sx: this.getPanelValue("#translateSX") || 0,
                    sy: this.getPanelValue("#translateSY") || 0,
                }; break;
            case "safe":
                this.mSpeed = this.getPanelValue("#mSpeed"); break;
        }
    }

    draw(ctx, off, fov) {
        ctx.beginPath()
        ctx.globalAlpha = 1
        ctx.lineWidth = 1
        ctx.fillStyle = this.color
        ctx.fillRect((this.x - off.x) / fov, (this.y - off.y) / fov, (this.w) / fov, (this.h) / fov)
        if (this.selected) {
            ctx.strokeStyle = "#070707"
            ctx.lineWidth = 5
            ctx.strokeRect((this.x - off.x) / fov, (this.y - off.y) / fov, (this.w) / fov, (this.h) / fov)
        }
        ctx.closePath()
    }

    tileString(data, w) {
        let mx = 0
        if (data) {
            if (typeof data == 'string') {
                if (data.endsWith('t')) {
                    mx = data.slice(0, -1) * 32
                } else if (data.endsWith('tn')) {
                    mx = w - data.slice(0, -2) * 32
                } else
                    mx = eval(data)
            } else {
                mx = data
            }
        }
        return mx
    }
}