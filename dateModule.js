exports.myDateTime = function(){
    return Date();
}

exports.singleScanDay = function(){
    var today = new Date();
    var time = today.getFullYear() + ":" + today.getMonth() + ":" + today.getDate();
    return time;
}