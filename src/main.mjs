import Player from "./logic/player.mjs"
import Vector from "./logic/vector.mjs"
import World from "./logic/world.mjs"

let world = new World({
    "1": {
        "properties": {
            "size": {
                "width": 80,
                "height": 16
            }
        },
        "zones": [
            {
                "type": "safe",
                "x": 0,
                "y": 0,
                "w": "10t",
                "h": "16t",
                "mSpeed": 10
            },
            {
                "type": "safe",
                "x": "10tn",
                "y": "16tn",
                "w": "10t",
                "h": "16t"
            },
            {
                "type": "active",
                "x": "10t",
                "y": 0,
                "w": "60t",
                "h": "16t",
                "enemies": [
                    {
                        "type": [
                            "disabler"
                        ],
                        "radius": 30,
                        "speed": 4,
                        "amount": 4
                    }
                ]
            },
            {
                "type": "teleport",
                "x": "0t",
                "y": "14t",
                "w": "10t",
                "h": "2t",
                "tpWorld": "_next",
                "translate": {
                    "x": 0,
                    "cy": "2.5t"
                }
            },
            {
                "type": "teleport",
                "x": "0t",
                "y": "0t",
                "w": "10t",
                "h": "2t",
                "tpWorld": "_prev",
                "translate": {
                    "x": 0,
                    "cy": "2.5tn"
                }
            },
            {
                "type": "teleport",
                "x": "2tn",
                "y": "16tn",
                "w": "2t",
                "h": "16t",
                "tpArea": "_next",
                "translate": {
                    "x": 160,
                    "y": 0
                }
            }
        ]
    },
    "name": "Gooded Map",
    "datas": {
        "fillStyle": "#888",
        "title": {
            "fillStyle": "#fff",
            "strokeStyle": "#969275"
        }
    }
})
let player = new Player()

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let off = new Vector(-1280 / 2, -720 / 2)
let fov = 1
let selectedArea
let hover = false
let filename = ""
let movement = {
    u: false,
    d: false,
    l: false,
    r: false,
    s: false,
    mouse: false,
    mouX: 0,
    mouY: 0,
}

//Listeners
function loadMap(selectedFile) {
    let fr = new FileReader();
    fr.onload = (e) => {
        let lines = e.target.result
        let map
        if (selectedFile.name.endsWith(".json")) {
            var newArr = JSON.parse(lines)
            map = newArr
        }
        if (selectedFile.name.endsWith(".yaml")
            || selectedFile.name.endsWith(".yml")) {
            if (selectedFile.name.endsWith(".yaml"))
                world_name = selectedFile.name.slice(0, -5)
            var newArr = YAML.parse(lines)
            map = newArr
        }
        localStorage.oldFile = selectedFile
        filename = selectedFile.name
        world = new World(map)
    }
    fr.readAsText(selectedFile)
}
let play = false
document.getElementById("play").addEventListener("click", e => {
    document.getElementById("menu").style.display = "none"
    document.getElementById("game").style.display = ""
    play = true
    const selectedFile = document.getElementById('input').files[0]
    if (selectedFile != undefined) {
        loadMap(selectedFile)
    }
    loop()
})

document.addEventListener('keydown', (e) => {
    if (play && !selectedArea && !hover) {
        if (e.keyCode == 87 || e.keyCode == 38) movement.u = true
        if (e.keyCode == 83 || e.keyCode == 40) movement.d = true
        if (e.keyCode == 65 || e.keyCode == 37) movement.l = true
        if (e.keyCode == 68 || e.keyCode == 39) movement.r = true
        if (e.shiftKey) movement.s = true
    }
})
document.addEventListener("keyup", (e) => {
    if (play && !selectedArea && !hover) {
        if (e.keyCode == 87 || e.keyCode == 38) movement.u = false
        if (e.keyCode == 83 || e.keyCode == 40) movement.d = false
        if (e.keyCode == 65 || e.keyCode == 37) movement.l = false
        if (e.keyCode == 68 || e.keyCode == 39) movement.r = false
        if (!e.shiftKey) movement.s = false
    }
})
document.addEventListener("mousemove", (e) => {
    if (play && !hover) {
        let { offsetX: x, offsetY: y } = e
        let isSomeHover = false
        for (let a in world.areas) {
            let area = world.areas[a]
            if (x > (area.pos.x - off.x) / fov
                && x < ((area.pos.x - off.x) + area.size.x) / fov
                && y > (area.pos.y - off.y) / fov
                && y < ((area.pos.y - off.y) + area.size.y) / fov) {
                area.hovered = true
            } else {
                area.hovered = false
            }
        }

    }
})
document.addEventListener("mousedown", (e) => {
    if (play && !hover) {
        if (e.buttons == 1) {
            movement.mouse = !movement.mouse
            selectedArea = null
            for (let a in world.areas) {
                let area = world.areas[a]
                if (area.hovered) {
                    area.selected = true
                    selectedArea = area.id
                    document.querySelector('#panel-area-props').innerHTML = area.toHTML()
                } else {
                    area.selected = false
                }
            }
        }
    }
})
document.addEventListener("wheel", e => {
    let d = e.deltaY || e.detail || e.wheelDelta
    if (d < 0) {
        if (fov >= 1) {
            fov -= 0.1 * (fov / 2)
        }
    } else {
        if (fov <= 100) {
            fov += 0.1 * (fov / 2)
        }
    }
})
document.getElementById("input").addEventListener('change', () => {
    const selectedFile = document.getElementById('input').files[0]
    if (selectedFile != undefined) {
        loadMap(selectedFile)
    }
})
document.getElementById("panel").onmouseover = () => { hover = true }
document.getElementById("panel").onmouseleave = () => { hover = false }
document.getElementById("download").onclick = () => {
    download(filename)
}
/*document.getElementById("friction").addEventListener("change", e=>{
    if (selectedArea != null) {
        world.areas[selectedArea].changeProp("friction", document.getElementById("friction").value)
    }
})
document.getElementById("only-name").addEventListener("change", e=>{
    if (selectedArea != null) {
        world.areas[selectedArea].changeProp("only-name", document.getElementById("only-name").value)
    }
})
document.getElementById("area-name").addEventListener("change", e=>{
    if (selectedArea != null) {
        world.areas[selectedArea].changeProp("area-name", document.getElementById("area-name").value)
    }
})
document.getElementById("lighting").addEventListener("change", e=>{
    if (selectedArea != null) {
        world.areas[selectedArea].changeProp("lighting", document.getElementById("lighting").value)
    }
})*/

function resize() {
    let scale = window.innerWidth / canvas.width
    if (window.innerHeight / canvas.height < window.innerWidth / canvas.width) {
        scale = window.innerHeight / canvas.height
    }
    canvas.style.transform = "scale(" + scale + ")"
    canvas.style.left = 1 / 2 * (window.innerWidth - canvas.width) + "px"
    canvas.style.top = 1 / 2 * (window.innerHeight - canvas.height) + "px"
}
function download(filename) {
    var element = document.createElement('a')

    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(world.reverse(), null, 2))
    )
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
    window.location.reload()
}
window.onload = () => resize()
window.onresize = () => resize()

// GameLoop
let lastUpdateTime = Date.now()
function loop() {
    requestAnimationFrame(loop)
    let currentTime = Date.now()
    let delta = currentTime - lastUpdateTime
    let timeFix = delta / (1000 / 30)
    lastUpdateTime = currentTime

    ctx.beginPath()
    ctx.fillStyle = "#333"
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, 1280, 720)
    ctx.fillRect(0, 0, 1280, 720)
    ctx.closePath()

    if (hover) {
        movement = {
            u: false,
            d: false,
            l: false,
            r: false,
            s: false,
            mouse: false,
            mouX: 0,
            mouY: 0,
        }
    }

    document.querySelectorAll("input").forEach(el => {
        if (selectedArea != undefined) {
            let area = world.areas[selectedArea]
            area.changeProps()
        }
    })
    player.move(movement)
    player.update(timeFix, delta, off, fov)

    world.update(timeFix, delta)
    world.draw(ctx, off, fov)
}