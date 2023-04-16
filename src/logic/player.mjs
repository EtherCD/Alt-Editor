import Vector from "./vector.mjs"

export default class Player {
    constructor(data) {
        /*this.gPos = new Vector(1280/2,720/2)
        this.aPos = new Vector(0, 0)
        this.pos = new Vector(this.gPos.x - this.aPos.x,this.gPos.y - this.aPos.y)*/

        this.radius = 14.5
        this.speed = 17
        this.name = "Alt"

        this.vel = new Vector(0, 0)
        this.acc = new Vector(0, 0)
        this.mPos = new Vector(0, 0)

        this.friction = .75
        this.dmp = new Vector(0, 0)
    }

    /*draw(ctx, off, fov) {
        ctx.beginPath()
        ctx.globalAlpha = 1
        ctx.fillStyle = "red"
        ctx.lineWidth = 1
        ctx.arc((this.pos.x - off.x)/fov, (this.pos.y - off.y)/fov, (this.radius)/fov, 0, 3.145*2);
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.lineWidth = (1)/fov
        ctx.globalAlpha = 1
        ctx.font = "12px Tahoma, Verdana, Segoe, sans-serif"
        ctx.fillText(this.name, (this.pos.x - off.x)/fov, (this.pos.y - (this.radius + 2) - off.y)/fov)
        ctx.closePath()
    }*/

    update(timeFix, delta, off, fov) {
        if (Math.abs(this.vel.x) > 0.01) {

        }
        if (Math.abs(this.vel.y) > 0.01) {

        }

        let slide = [this.dmp.x + 0, this.dmp.y + 0]
        slide[0] *= 1 - (this.friction * timeFix)
        slide[1] *= 1 - (this.friction * timeFix)

        this.acc.x *= timeFix
        this.acc.y *= timeFix

        this.acc.x += slide[0]
        this.acc.y += slide[1]
        this.vel = new Vector(this.acc.x, this.acc.y)
        this.vel.x > this.speed ? this.vel.x = this.speed : 'none'
        this.vel.x < -this.speed ? this.vel.x = -this.speed : 'none'
        this.vel.y > this.speed ? this.vel.y = this.speed : 'none'
        this.vel.y < -this.speed ? this.vel.y = -this.speed : 'none'

        off.x += this.vel.x * timeFix
        off.y += this.vel.y * timeFix
        this.dmp.x = this.acc.x + 0
        this.dmp.y = this.acc.y + 0

        this.speed = 17*fov

        this.acc.x = 0
        this.acc.y = 0
    }

    move(movement) {
        let speed = this.speed
        let shift = movement.s ? 0.5 : 1
        if (movement.r) {
            this.acc.x = (speed * shift)
        }
        else if (movement.l) {
            this.acc.x = -(speed * shift)
        }
        if (movement.u) {
            this.acc.y = -(speed * shift)
        }
        else if (movement.d) {
            this.acc.y = (speed * shift)
        }
        if (!movement.r && !movement.l) this.acc.x = 0
        if (!movement.u && !movement.d) this.acc.y = 0

        if (movement.mouse) {
            let distance = this.d(0, 0, movement.mouX, movement.mouY)

            let speedX = movement.mouX
            let speedY = movement.mouY

            if (distance > 150) {
                speedX = movement.mouX * (150 / distance)
                speedY = movement.mouY * (150 / distance)
            }

            let angle = Math.atan2(speedY, speedX)

            let mouseDist = Math.min(150, Math.sqrt(movement.mouX ** 2 + movement.mouY ** 2))
            let distMovement = speed * shift
            distMovement *= mouseDist / 150

            this.acc.x = distMovement * Math.cos(angle)
            this.acc.y = distMovement * Math.sin(angle)
        }
    }

    d(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }
}