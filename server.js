const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);
const ACTIONS = require('./src/ACTIONS')

// It is baiscally used to store a map of socketId and username
const userSocketMap = {};

// {
//     socketiD : userName;
// }

function getAllconnectedClients(roomId) {
  // Map
  // Below code will give us all the sockiIds, and userName of all the availab roomIds
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

// Setting up connection
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // receiving Join Action from client
  socket.on(ACTIONS.JOIN, ({roomId, userName}) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);  // Adding into room

    // Getting all clients of given room id
    const clients = getAllconnectedClients(roomId);
    clients.forEach(({socketId})=>{
      // Emiting their names, clients array and their socket id to client
        io.to(socketId).emit(ACTIONS.JOINED, {
            clients,
            userName,
            socketId : socket.id,
        })
    })
  });


  socket.on(ACTIONS.CODE_CHANGE, ({roomId, code})=>{
    // Socket.in for sending messages to other not to the user who changed the code
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
  })


  socket.on(ACTIONS.SYNC_CODE, ({socketId, code})=>{
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
  })


  socket.on('disconnecting', ()=>{
    // Same as return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    // (socketId) => {
    //   return {
    //     socketId,
    //     userName: userSocketMap[socketId],
    //   };
    // }
    const rooms = [...socket.rooms];
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId: socket.id,
            userName: userSocketMap[socket.id],
        });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  })


});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
