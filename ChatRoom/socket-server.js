var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/www'));
 
var users = {
	fanglin:{
		socket:null,
		online:false
	},
	xingtianyu:{
		socket:null,
		online:false
	},
	zhangjiankun:{
		socket:null,
		online:false
	},
	mayingjiao:{
		socket:null,
		online:false
	},
	wangrongguo:{
		socket:null,
		online:false
	},
	qiaofuli:{
		socket:null,
		online:false
	},
	haoyongqiang:{
		socket:null,
		online:false
	},
	lizilin:{
		socket:null,
		online:false
	},
	pengxiaofang:{
		socket:null,
		online:false
	},
	liukehan:{
		socket:null,
		online:false
	},
	huleping:{
		socket:null,
		online:false
	},
	liuguanglei:{
		socket:null,
		online:false
	},
	luhongjuan:{
		socket:null,
		online:false
	},
	wangfang:{
		socket:null,
		online:false
	},
	zhangwei:{
		socket:null,
		online:false
	},
	renyin:{
		socket:null,
		online:false
	},
	tianhongfang:{
		socket:null,
		online:false
	},
	lihan:{
		socket:null,
		online:false
	},
	gaolei:{
		socket:null,
		online:false
	}
};

function getOnlineUsers(){
	var online = [], i;
	for(i in users){
		if(users[i].online === true){
			online.push(i);
		}
	}
	
	return online;
};

io.on('connection', function(socket){
	socket.on('new message',function(data){
		var i,user;
		
		socket.emit('update myself',{fromUser:data.fromUser,msg:data.msg,date:new Date()});
		
		if(data.broadcast===true){
			socket.broadcast.emit('new message',{fromUser:data.fromUser,msg:data.msg,date:new Date()});
		}else{
			for(i=0;i<data.tousers.length;i++){
				user = users[data.tousers[i]];
				if(user.online==true && user.socket!=null){
					user.socket.emit('new message',{fromUser:data.fromUser,msg:data.msg,date:new Date()});
				}
			}
		}
	});
	
	socket.on('login',function(data){
		if(data.username in users){
			users[data.username].online = true;
			users[data.username].socket = socket;
			socket.emit('login success',{username:data.username,allusers:getOnlineUsers()});
			socket.broadcast.emit('enter chat',{username:data.username,allusers:getOnlineUsers()});
		}else{
			socket.emit('login failed');
		}
	});
	
	socket.on('disconnect',function(){
		var user;
		for (user in users){
			if(users[user].socket == socket){
				users[user].online = false;
				socket.broadcast.emit('leave chat',{username:user,allusers:getOnlineUsers()});
				return;
			}
		}
	});
});

server.listen(8080);
console.log('server is listenering on port 8080');