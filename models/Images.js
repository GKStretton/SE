var keystone = require('keystone');
var Types = keystone.Field.Types;

var Images = new keystone.List('Images');

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "public/uploads/img/",
		publicPath: "/public/uploads/img/",
	}
});

Images.add({
	name: {type: String, required:true, initial:true, unique:true},
	image: {type:Types.File, storage:storage, required:true, initial:true},
});

Images.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Images.defaultColumns = 'name';
Images.register();
