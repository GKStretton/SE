var keystone = require('keystone');
var Types = keystone.Field.Types;

var Activity = new keystone.List('Activity',{
	map:{name:"name"}
});

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "public/uploads",
		publicPath: "/public/uploads/",
	}
});

Activity.add({
	name: {type: String, required:true, initial:true, unique:true },
	description: {type:Types.Markdown, required:true, initial:true},
	url : {type:Types.Url},
	topImage: {type: Types.Relationship, ref: "Images"},
	galleryImages: {type: Types.Relationship, ref: "Images", many: true},
});

Activity.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

Activity.defaultColumns = 'name';
Activity.register();
