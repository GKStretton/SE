var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event');

Event.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Html, wysiwyg: true },
  cost: { type: Number, default: 0, size: 'small' },
  startTime: { type: Types.Datetime, required: true, initial: true, index: true },
  endTime: { type: Types.Datetime, required: true, initial: true, index: true },
  location: { type: Types.Location, initial: true },
  published: { type: Boolean },
  publishDate: { type: Types.Date, index: true },
});

Event.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Event.schema.pre('save', function (next) {
  let event = this;
  if (event.isModified('published') && event.published) {
    this.publishDate = Date.now();
  }
  return next();
});

Event.defaultColumns = 'displayName, email';
Event.register();
