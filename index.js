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

    // Check connection from user
    console.log("Có người kết nối với socket_id: ", socket.id)
    socket.on("disconnect", function() {
        console.log(`Opps!!! socket_id: ${socket.id} disconnected`)
    })

    /*
        Khi Client A gửi data

        io.sockets.emit: Gửi lại toàn bộ client kể cả A
        socket.emit: Chỉ gửi lại mình A (Ứng dụng khi Login)
        socket.broadcast.emit: Gửi lại toàn bộ client trừ A
    */

    socket.on("Client-send-data", function(data) {
        
        // Test 3 cases
        // io.sockets.emit("Server-send-data", data)
        // socket.emit("Server-send-data", data)
        
        socket.broadcast.emit("Server-send-data", data)
    })

});


server.listen(3000);



app.get("/", function(req, res) {
    res.render('home')
})


