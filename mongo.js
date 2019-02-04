const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:4321';
const dbName = 'testdb';
const RFC4122 = require('rfc4122'); //unique id
let rfc4122 = new RFC4122();
let exampleId = rfc4122.v1();
/** IMPORTANT **/
/*
 * If creating an insertion for a booking for the functions below, for collectionName
 * use 'Bookings' and for a lock use 'Locks'. Failure to comply will result in the db
 * being polluted with a bunch of random collections which is bad juju.
 */
function deleteEntry(tgtDB, eventID,collectionName){
    tgtDB.collection(collectionName).deleteOne({eventID: eventID});
    return 0;
}

function getLock(tgtDB, eventId, callback) {
    tgtDB.collection("Locks").find({eventID: eventId},function(err,resCursor){
        if(err){
            callback(err);
        }
        else{
            resCursor.count(function(err,count){
                if(err){
                    callback('Error');
                }
                else{
                    if (count > 0){
                        resCursor.forEach(function(lock){
                            callback(false,lock);
                            return;
                        });
                    }
                    else{
                        callback('Timed out');
                    }
                }
            });
        }
    });

}

function addEntry(collection,tgtDB,eventId,startTime,endTime,facilityId,price,name,email,information,callback){
    let ev = {
        eventID: eventId,
        startTime: startTime,
        endTime: endTime,
        facilityID: facilityId,
        price: price,
        email: email,
        information: information,
        name: name
    }
    if (collection === "Locks"){
        ev.timestamp = Date.now();
    }
    tgtDB.collection(collection).insertOne(ev)
        .then(function(result){
            console.log('successfully added to db')
            callback(false);
        })
        .catch(function(err){
            console.log(err);
            callback(err);
        });
    return 0;
}



//returns 'error' if error
function listEntries(tgtDB,collectionName,startTime,endTime,facilityId,cb){
    //returns cursor of bookings that lie between the two times
    tgtDB.collection(collectionName).find({
        facilityID: {$eq: facilityId},
        endTime: {$gt: startTime},
        startTime: {$lt: endTime}
    },function(err,listCursor){
        if(err){
            cb('error');
        }
        else{
            cb(listCursor);
        }
    });
    return 0;
}

function checkBusy(tgtDB,startTime,endTime,facilityId,callback){
    listEntries(tgtDB,"Locks",startTime,endTime,facilityId,function(lockCursor){
        if(lockCursor === 'error'){
            callback('error');
            return 0;
        }
        else{
            let current = Date.now();
            let i = 0;
            lockCursor.toArray()
            .then(function(lockArr){
                while(i< lockArr.length){
                    let diff = current - lockArr[i].timestamp;
                    if (diff < (1000 * 60 * 5)){
                        console.log('locked');
                        callback(false,'busy');
                        return 0;
                    }
                    i++;
                }
            listEntries(tgtDB,"Bookings",startTime,endTime,facilityId,function(bookingCursor){
                if(bookingCursor === 'error'){
                    callback('error');
                    return 0;
                }
                else{
                    bookingCursor.count(function(err,count){
                        if(err){
                            callback(false,'busy');
                        }
                        else{
                            if(count > 0){
                                callback(false,'busy');
                            }
                            else{
                                callback(false,'notBusy');
                            }
                        }
                    });
                }
            });
        });

        }
    });

}
function unavailable(tgtDB,days,facilityId,callback){
    //get tomorrow as dateTime
    // get x days from tomorrow as dateTime
    let start = new Date();
    start.setDate(start.getDate + 1); //tomorrow
    let end = new Date();
    end.setDate(end.getDate + 1 + days);
    listEntries(tgtDB,"Bookings",start,end,facilityId,function(bookingCursor){
        if (bookingCursor === 'error'){
            callback('error');
            return 0;
        }
        let bookingList = [];
        while(bookingCursor.hasNext()){
            let item = bookingCursor.next();
            bookingList.push({
                title:"Unavailable",
                start: item.startTime,
                end: item.endTime
            })
        }
        callback(false,bookingList);
    })

}

dbo = null;
MongoClient.connect(url,function(err,client){  //Creates the database and initialises it with a table for booking info.
    assert.equal(null,err);
    dbo = client.db(dbName);
    console.log("Database created.");
    //client.close(); //Might need to be removed in case this closes the actual connection with the DB.
});

module.exports.getLock = getLock;
module.exports.unavailable = unavailable;
module.exports.addEntry = addEntry;
module.exports.checkBusy = checkBusy;
module.exports.deleteEntry = deleteEntry;
