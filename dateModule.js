exports.myDateTime = function(){
    return Date();
}

exports.singleScanTime = function(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return time;
}