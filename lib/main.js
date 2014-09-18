var http = require('http'),
	request = require('request');
	clilog=require('clilog');

function main(config) {
	http.createServer(function(req, res) {
		var chunks = [];

		req.on('data', function(chunk) {
			chunks.push(chunk);
		});
		req.on('end', function() {
			if (req.method == 'GET') {
				var addr = url.parse('http://' + req.url, true);

				for (var k in addr.query) {
					console.log(k + " : %s", addr.query[k]);
				}

			} else if (req.method == 'POST') {
				if (!chunks.length)
					return;

				var buffer = Buffer.concat(chunks);
				var content = buffer.toString();
				if(req.headers['content-type'].split(";")[0]=="multipart/form-data"){
					var boundary = req.headers['content-type'].split("boundary")[1];
					boundary = boundary.substr(1);
					var parts = content.split(boundary);
					for (var i = 1; i < parts.length - 1; i++) {
						var j = 0;
						var lines = parts[i].split('\n');
						var name = lines[1].split('=')[1];
						var value = lines[3];
						name = name && name.replace('\r', '').replace(/\"/g, '');
						value = value && value.replace('\r', '');
						console.log(name + " : %s", value);
					}
				}
			}


			//var obj = JSON.parse(strObj);

		});
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		});
		//var strObj = '{"a":"1","b":2}'
		var jsonObj = config.resjson;
		var jsonStr=JSON.stringify(jsonObj);
		clilog.warn(jsonStr);
		res.end(jsonStr);
		//res.end("success.\r\n");
	}).listen(1337, function() {
		console.log('Server running at http://127.0.0.1:1337/');
	})
}
exports.main=main;