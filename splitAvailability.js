
/**
To use

splitAvailability = require('splitAvailability');

splitAvailability('18:00 - 21:30');
> ['18:00','21:30']
splitAvailability('1800 / 2130')
> []
**/

//returns array length 2 of strings for front end calendar
//if there is a problem, returns empty array []
//eg "18:00 - 21:30" > [18.00,21.30]

module.exports = function splitAvailability(availString){
    //remove the spaces
    availString =  availString.replace(/ +?/g,"");

    //check if in format like "18:40-19:40"
    if (!(/\d\d:\d\d-\d\d:\d\d/.test(availString))){
        return [];
    }
    let tString1 = availString.split('-')[0];
    let tString2 = availString.split('-')[1];
    return [tString1,tString2];
}
