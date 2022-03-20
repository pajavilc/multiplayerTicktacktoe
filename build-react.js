var exec = require('child_process').exec;
var os = require('os');

function error(error, stdout, stderr) { console.log(stdout) }

if (os.type() === 'Linux') {
    exec("npm run build-react-linux", error);
}
else if (os.type() === 'Windows_NT') {
    exec("npm run build-react-windows", error);
}
else {
    throw new Error("Unsupported OS found: " + os.type());
}