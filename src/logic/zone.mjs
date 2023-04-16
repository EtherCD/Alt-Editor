export default class Zone {
    constructor(data, areaSize, aPos) {
        let w = areaSize.x
        let h = areaSize.y
        this.aPos = aPos

        this.w = this.tileString(data.w, w)
        this.h = this.tileString(data.h, h)
        this.x = this.tileString(data.x, w)
        this.y = this.tileString(data.y, h)

        this.x += this.aPos.x
        this.y += this.aPos.y

        this.color = "#333"
        switch(data.type) {
            case "teleport": this.color = "#FFF46C"; break;
            case "victory": this.color = "#FFF46C"; break;
            case "safe": this.color = "#c1c1c1"; break;
            case "active": this.color = "#fff"; break;
            case "inversivity": this.color = "rgb(167,60,227,0.5)"; break;
            case "storm": this.color = "rgba(242,165,60, 0.5)"; break;
            case "slowdown": this.color = "#ECAC9B"; break;
            case "magnetism": this.color = "#B5A1E6"; break;
        }
    }

    draw(ctx, off, fov) {
        ctx.beginPath()
        ctx.globalAlpha = 1
        ctx.lineWidth = 1
        ctx.fillStyle = this.color
        ctx.fillRect((this.x - off.x)/fov, (this.y - off.y)/fov, (this.w)/fov, (this.h)/fov)
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