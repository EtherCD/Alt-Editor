// Микро утилита на случай запуска с локалки
// Без сервера установленого
// Но с Nodejs

const express = require("express")
const http = require("http")
const path = require("path")

const app = express()
const server = http.Server(app)

const port = process.env.PORT || 5000
app.set('port', port)
app.use('/src/', express.static(path.join(__dirname, "src")))
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, "index.html"))
})

server.listen(port, ()=>{
    console.info(`Server begin started! Port: ${port}, Url: http://localhost:${port}/`)
})