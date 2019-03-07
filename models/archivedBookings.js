var keystone = require('keystone');
var Types = keystone.Field.Types;


//the same as a booking but with no personal information
var archivedBookings = new keystone.List('archivedBookings');
archivedBookings.add({
    startTime: {type: Types.Datetime,initial:true},
    bookingID: {type: String, hidden:true,inital: false},
    endTime: {type: Types.Datetime,initial:true},
    price: {type: Number},
    facility: {type: Types.Relationship,ref:'Facility',initial:true},
});

archivedBookings.schema.virtual('canAccessKeystone').get(function () {
  return true;
});


archivedBookings.defaultColumns = ['facility','startTime','endTime', 'price'];

archivedBookings.register();
