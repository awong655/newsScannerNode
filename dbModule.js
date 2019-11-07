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
        typeof callback == 'function' && callback(db, args);
      });
}

// insert then optionally callback. Good use of callback is to insert then close.
exports.db_insert = function(object, collection, callback, args){    
    dbo.collection(collection).insertOne(object, function(err, result){
        if (err) throw err;
        console.log("document inserted");
        typeof callback == 'function' && callback(result, args);
    });    
}

exports.db_query = function(object, collection, callback, args){
    dbo.collection(collection).find(object).toArray(function(err,result){
        if (err) throw err;
        console.log(result);
        typeof callback == 'function' && callback(result, args);        
    });
}

// close db connection
exports.db_close = function(){
    database.close();
}

