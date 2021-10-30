import express from 'express';

var app = express();
app.use(express.static("./public"))
app.set("view engine", "ejs");
app.set("views", "./views");

import http from 'http';
import { Server } from 'socket.io';

var server = http.Server(app)
const io = new Server(server);

const users = [
                {name: "Long", username: "JJLee"},
                {name: "Ly", username: "Lyn"},
                {name: "Nam", username: "Nammm"},
                {name: "Tien", username: "Tttt"},
            ]

io.on("connection", function(socket) {

    console.log(`Có ${socket.adapter.rooms} tham gia vào hệ thống `)

    // socket.adapter.rooms: room list in your server

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

    socket.on("Client-send-registerData", function(data) {
        console.log(data)
        if (users.filter(function(user) { return user.username === data.username}).length > 0) {
            socket.emit("Server-send-failureMessage")
        } else {
            users.push(data)
            socket.data = data
            socket.broadcast.emit("Server-send-notice", `Tài khoản ${data.username} vừa đăng nhập vào hệ thống`)
            socket.emit("Server-send-successMessage")
            io.sockets.emit("Server-send-userList", users)
        }
    })

    socket.on("Client-send-logout", function() {
        users.splice(users.indexOf(socket.data), 1)
        socket.broadcast.emit("Server-send-logout-notice", socket.data)
    })

});


server.listen(3000);



app.get("/", function(req, res) {
    res.render('test')
})

app.get("/chat", function(req, res){
    res.render("chat")
})




