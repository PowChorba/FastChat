import express from "express"
const cors = require('cors')
const {dbConnection} = require("./dataBase/db")
const path = require("path")
const http = require("http")
const {Server} = require("socket.io");
import route from './routes/index'
require('dotenv').config()


const app = express()
dbConnection()


app.set("port", process.env.PORT || 2500)

app.use(cors())

// Static files 
// app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());

app.use('/', route)

const server = app.listen(app.get("port"),()=>{
    console.log("server is on port" + " " + process.env.PORT)
})

const serverSocket = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST","DELETE"],
    },
})
io.on("connection",(socket:any)=>{
    console.log(`new connection: ${socket.id}`)
})