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
	imageTop: {type: Types.File, storage:storage},
	image1: {type: Types.File, storage:storage},
	image2: {type: Types.File, storage:storage},
	image3: {type: Types.File, storage:storage}
});

Activity.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

Activity.defaultColumns = 'name';
Activity.register();
