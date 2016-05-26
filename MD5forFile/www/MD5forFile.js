var exec = require('cordova/exec');

exports.file_md5 = function(arg0, success, error) {
    exec(success, error, "MD5forFile", "file_md5", [arg0]);
};
