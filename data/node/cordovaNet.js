var net = require('net');
var server = net.createServer(function(c) { //'connection' listener
    console.log('client connected');
    c.on('end', function() {
        console.log('client disconnected');
    });

    c.on('data', function (data) {
        exports.onevent(JSON.parse(data.toString()));
    })
});
server.listen(1234, function() { //'listening' listener

});


exports.onevent = function () {};