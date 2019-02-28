var keystone = require('keystone');
var Types = keystone.Field.Types;

var Booking = new keystone.List('Booking');


Booking.add({
    startTime: {type: Types.Datetime,initial:true}, // description
    bookingID: {type: String, hidden:true,inital: false},
    endTime: {type: Types.Datetime,initial:true},
    price: {type: Number},
    facilityID: {type: Types.Relationship,ref:'Facility',initial:true},
    email: {type: String },
    customer_name: {type: String},
    information: {type: String}
});

Booking.schema.virtual('canAccessKeystone').get(function () {
  return true;
});


//Might need to add relationship with facility
//Booking.relationship({path:"options", ref: "Facility Options", refPath:"facility"})

Booking.defaultColumns = ['startTime','endTime'];
Booking.register();
