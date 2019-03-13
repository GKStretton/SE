var keystone = require('keystone');
var Types = keystone.Field.Types;

var Locks = new keystone.List('Locks',{hidden: true});


Locks.add({
    startTime: {type: Types.Datetime}, // description
    bookingID:{type:String},
    endTime: {type: Types.Datetime},
    price: {type: Number},
    facility: {type: Types.Relationship,ref:'Facility'},
    email: {type: String },
    customerName: {type: String},
    information: {type: String},
    timestamp: {type: Number}
});

Locks.schema.virtual('canAccessKeystone').get(function () {
  return true;
});


//Might need to add relationship with facility
//Booking.relationship({path:"options", ref: "Facility Options", refPath:"facility"})

Locks.defaultColumns = ['startTime','endTime'];
Locks.register();
