const fs = require('fs')
const stdin = process.stdin
const exec = require('child_process').exec
var can = require('socketcan');

var channel = can.createRawChannel("can0", true);

channel.start();


stdin.setRawMode(true)

stdin.resume()

stdin.setEncoding( 'utf8' );

let file = fs.readFileSync('./candump.log')

file = file.toString()

let messages = file.split('\n')

let index = 0
let interval
let count = 0
stdin.on('data', (key) => {
    if ( key === '\u0003' ) {
        process.exit();
    } else if (key === ' ') {
        for (let i = index; i < index + 10; i++) {
            var text = messages[i].split(' ')[2]
            var id = text.split("#")[0]
            var data = hexStringToByte(text.split("#")[1])

            var message = {}
            message.id = parseInt(id, 16)
            message.data = data
            console.log(message)
            channel.send(message)
        }
        index = index + 10
        console.log("done################################## lines " + (index - 10) + " to " + (index))
    }
})

    function hexStringToByte(str) {
        if (!str) {
            return new Uint8Array();
        }

        var a = [];
        for (var i = 0, len = str.length; i < len; i+=2) {
            a.push(parseInt(str.substr(i,2),16));
        }

        return new Uint8Array(a);
    }

const parseNext = () => {
    console.log(messages[index])
    let parts = messages[index].split(" ")
    exec('cansend ' + parts[1] + " " + parts[2], (err, stdout, stderr) => {
        console.log(stdout, err, stderr)
    })
    index++
}

