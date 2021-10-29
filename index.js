import express from 'express';

var app = express();
app.use(express.static("./public"))
app.set("view engine", "ejs");
app.set("views", "./views");

import http from 'http';
import { Server } from 'socket.io';

var server = http.Server(app)
const io = new Server(server);

io.on("connection", function(socket) {
    console.log("Có người kết nối với socket_id: ", socket.id)
    
    socket.on("disconnect", function() {
        console.log(`Opps!!! socket_id: ${socket.id} disconnected`)
    })
});


server.listen(3000);



app.get("/", function(req, res) {
    res.render('home')
})


