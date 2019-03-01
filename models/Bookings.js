var keystone = require('keystone');
var Types = keystone.Field.Types;

var Bookings = new keystone.List('Bookings');


Bookings.add({
    startTime: {type: Types.Datetime,initial:true}, // description
    bookingID: {type: String, hidden:true,inital: false},
    endTime: {type: Types.Datetime,initial:true},
    price: {type: Number},
    //hopefully should work just by inserting the id in a query
    facilityID: {type: Types.Relationship,ref:'Facility',initial:true},
    email: {type: String },
    customer_name: {type: String},
    information: {type: String}
});

Bookings.schema.virtual('canAccessKeystone').get(function () {
  return true;
});


//Might need to add relationship with facility
//Booking.relationship({path:"options", ref: "Facility Options", refPath:"facility"})

Bookings.defaultColumns = ['startTime','endTime'];
Bookings.register();
