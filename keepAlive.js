const fs = require('fs')
const exec = require('child_process').exec
var can = require('socketcan');

var channel = can.createRawChannel("can0", true);

channel.start();


let file = fs.readFileSync('./candump.log')

file = file.toString()

let messages = file.split('\n')

let index = 0
let interval
let count = 0
setInterval(() => {
    var id = 0x07e
    var data = hexStringToByte('003B9D636404E020')

    var message = {}
    message.id = id
    message.data = data
    channel.send(message)
}, 30)

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

