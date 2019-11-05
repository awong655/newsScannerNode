var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";
exports.db = null;
exports.dbo = null;

exports.db_connect = function(url, db_name, callback, args){
    MongoClient.connect(url, function(err, database) {
        if (err) throw err;
        db = database;
        dbo = db.db(db_name);
        console.log("Database connected!");
        typeof callback == 'function' && callback(args);
      });
}

// insert then optionally callback. Good use of callback is to insert then close.
exports.db_insert = function(object, collection, callback){    
    dbo.collection(collection).insertOne(object, function(err, res){
        if (err) throw err;
        console.log("1 document inserted");
        typeof callback == 'function' && callback();
    });    
}

exports.db_query = function(object, collection, callback){
    dbo.collection(collection).find(object).toArray(function(err,result){
        if (err) throw err;
        console.log(result);
        typeof callback == 'function' && callback();
    });
}

// close db connection
exports.db_close = function(){
    database.close();
}

