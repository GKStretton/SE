var keystone = require('keystone');
var Types = keystone.Field.Types;

var EquipmentPrice= new keystone.List('EquipmentPrice');

EquipmentPrice.add({
	item: {type: String, required:true, initial:true },
	price: { type: String, initial:true, required:true},
});

EquipmentPrice.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

EquipmentPrice.defaultColumns = 'item';
EquipmentPrice.register();
