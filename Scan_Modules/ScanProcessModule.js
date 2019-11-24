var db = require('../DB_Modules/dbModule');
var dateModule = require('../Util_Modules/dateModule');

exports.initProcess = function(url, obj, wordList){
    return new Promise((resolve, reject) =>{
        // insert the scan result into the db for record
        try{
            db.db_insert(obj, "newsCache", resolve, true);
        }catch(err){
            reject(err);
        }    
    }).then(function(result){
        return new Promise((resolve, reject) => {
            // gets the previously largest result which is stored in the report table
            try{
                db.db_query({"url": url, "day_requested": dateModule.singleScanDay()}, "Report",  resolve );
            }catch(err){
                reject(err);
            }
        });
        
    }).then(function(result){
        return new Promise((resolve, reject) => {
            try{
                //initResultTable(result, {"obj": obj, "wordList": wordList, "index":0}, resolve)
                if(!result.length){
                    db.db_insert(obj, "Report", resolve, true);        
                }  
                else{
                    resolve(true);
                }
            }catch(err){
                reject(err);
            }
        });
    }).then(function(result){
        return new Promise((resolve, reject) => {
            try{
                processResult(result, {"obj": obj, "wordList": wordList}, resolve)
            }catch(err){
                reject(err);
            }
        });
    });    
}
  
  // for each keyword, check if the length of the most recently inserted object is longer than the length of the longest record in the Report collection
  let processResult = function(result, args, resolve){
    let obj = args.obj;
    let wordList = args.wordList;

    //if(result.insertedId in result)
      //result = obj;   
    for(let index = 0; index < wordList.length; index++){
        let res = new Promise((resolve, reject) => {            
            try{
                let currentObjKey = {"_id" : 0}
                currentObjKey[wordList[index]] = 1;
                db.db_findOne({"day_requested": dateModule.singleScanDay()},                     
                    currentObjKey
                    , "Report", resolve);  
            }catch(err){
                reject(err);
            }
        }).then(function(result){
            if(result[wordList[index]].length < obj[wordList[index]].length){
                let updateObj = {};
                updateObj[wordList[index]] = obj[wordList[index]]
                db.db_update({"day_requested": dateModule.singleScanDay()},
                    {"$set":                         
                        updateObj                    
                    },
                    "Report"
                )
            }
        });
    }  
    // do some kind of comparison to the scanned obj here. Update if the list is longer
    //if(result.length )
  
  }