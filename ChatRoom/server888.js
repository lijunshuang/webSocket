const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use('/', express.static(__dirname + '/www'))

const users = {
    ljs: {
        socket: null,
        online: false

    },
    ljs2: {
        socket: null,
        online: false

    },
    ljs3: {
        socket: null,
        online: false

    },
    ljs4: {
        socket: null,
        online: false

    },
}
//获取在线用户
getOnlineUsers = () => {
    let online = [],
        i;
    for (i in users) {
        if (users[i].online == true) {
            online.push(i)
        }
    }
    return online
}
// 链接socket.io
io.on('connection', socket => {
    socket.on('new message', data => {
        let i, user;
        socket.emit('update myself', {
            fromUser: data.fromUser,
            msg: data.msg,
            date: new Date()
        });

        if (data.broadcast == true) {
            socket.broadcast.emit('new message', {
                fromUser: data.fromUser,
                msg: data.msg,
                date: new Date()
            })
        } else {
            for (i = 0; i < data.tousers.length; i++) {
                user = users[data.tousers[i]]
                if (user.online == true && user.socket != null) {
                    user.socket.emit('new message', {
                        fromUser: data.fromUser,
                        msg: data.msg,
                        date: new Date()
                    })
                }
            }
        }
    });

    // 在线用户
    socket.on('login', data => {
        if (data.username in users) {
            users[data.username].online = true;
            users[data.username].socket = socket;
            socket.emit('login success', {
                username: data.username,
                allusers: getOnlineUsers()
            })
            socket.broadcast.emit('enter chat', {
                username: data.username,
                allusers: getOnlineUsers()
            })
        } else {
            socket.emit('login failed')
        }
    });

    //离线用户
    socket.on('disconnect', () => {
        let user;
        for (user in users) {
            if (users[user].socket == socket) {
                users[user].online = false;
                socket.broadcast.emit('leave chat', {
                    username: user,
                    allusers: getOnlineUsers()
                })
                return
            }
        }
    });

})

server.listen(8888, () => console.log('链接成功,prot 8888 ！'))