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

function deleteEntry(tgtDB,primaryKey,collectionName){
    const deleteQuery = {
        "primaryKey": primaryKey
    };
    tgtDB.collection(collectionName).deleteOne({
        deleteQuery,function(err,client){
            assert.equal(null,err);
            console.log("Entry " + primaryKey + " removed.");
        }
    });
    return 0;
}

function insertEntry(tgtDB,entry,collectionName){
    tgtDB.collection(collectionName).insertOne(entry,function(err,client){
        assert.equal(null,err);
        console.log("New entry inserted to " + collectionName + ".");
    });
    return 0;
}

function listEntries(tgtDB,collectionName,startTime,endTime,facilityId){
    //returns cursor of bookings that lie between the two times
    let listCursor = tgtDB.collections(collectionName).find({
        facilityID: {$eq: facilityId},
        endTime: {$gt: startTime},
        startTime: {$lt: endTime}
    })
    return listCursor
}

function checkBusy(tgtDB,startTime,endTime,facilityId,callback){
    let lockCursor = listEntries(tgtB,"Locks",startTime,endTime,facilityId);
    let bookingCursor = listEntries(tgtB,"Bookings",startTime,endTime,facilityId);
    let current = Date.now();
    if(bookingCursor.hasNext){
        callback('busy');
        return;
    }
    while(lockCursor.hasNext){
        let lock = tojson(lockCursor.next());
        if (current - lock.timeStamp < (1000 * 60 * 5)){
            callback('busy');
            return;
        }
    }
    callback('notBusy');
}
function unavailable(tgtDB,days,facilityId){
    //get tomorrow as dateTime
    // get x days from tomorrow as dateTime
    let start = new Date();
    start.setDate(start.getDate + 1); //tomorrow
    let end = new Date();
    end.setDate(end.getDate + 1 + days);
    let bookingCursor = listEntries(tgtDB,"Bookings",start,end,facilityId);
    let bookingList = [];
    while(bookingCursor.hasNext()){
        let item = (tojson(bookingCursor.next()));
        bookingList.push({
            title:"Unavailable",
            start: item.startTime,
            end: item.endTime
        })
    }
    return bookingList
}


MongoClient.connect(url,function(err,client){  //Creates the database and initialises it with a table for booking info.
    assert.equal(null,err);
    var dbo = client.db(dbName);
    let testBooking = { //This exists as a test booking to display the schema of the db **WIP**
        "eventID": "eventId",
        "facilityID": "facilityId",
        "startTime": "startTime",
        "endTime": "endTime",
        "price": 0.01,
        "name": "John Doe",
        "email": "email@test.com",
        "summary": "SampleText",
        "description": "NotARealBooking"
    }
    let testLock = { //This exists as a test lock to display the schema of the db
        "eventID": rfc4122.v1(),
        "facilityID": "facilityId",
        "timeStamp": Date.now(),
        "eventName": "eventName",
        "email": "email@mail.com",
    }
    console.log("Database created.");
    client.close(); //Might need to be removed in case this closes the actual connection with the DB.
});
