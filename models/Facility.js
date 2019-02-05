var keystone = require('keystone');
var Types = keystone.Field.Types;

var Facility = new keystone.List('Facility', {
	map:{name:"title"}
});

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "public/uploads/img",
		publicPath: "/public/uploads/img/",
	}
});

Facility.add({
	title: {type: String, required: true, initial: true, unique: true},
	description: {type: Types.Markdown}, // description
	availability: {type: Types.Markdown}, // Availability description
	pricing: {type: Types.Markdown}, // Pricing description
	automated: {type: Boolean},
	extras: {type: Types.Relationship, ref: "EquipmentPrice", many: true},
	topImage: {type: Types.Relationship, ref: "Images"},
	galleryImages: {type: Types.Relationship, ref: "Images", many: true}
});

Facility.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Facility.relationship({path:"options", ref: "Facility Options", refPath:"facility"})
Facility.relationship({path:"prices", ref: "Facility Prices", refPath:"facility"})
Facility.relationship({path:"availability", ref: "Facility Availability", refPath:"facility"})

Facility.defaultColumns = ['title', "automated"];
Facility.register();
