const app = require('express')();
const server = require("http").createServer(app);
const cors = require('cors');
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});
app.use(cors());
const PORT = process.env.PORT || 5000;

app.get('/', ((req, res, next) => {
    res.send("Server is running");
}));

io.on('connection', (socket) => {

    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({userToCall, signalData, form, name}) => {
        io.to(userToCall).emit("callUser", {signal: signalData, form, name});
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
})

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))