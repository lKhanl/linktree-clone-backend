const { Schema, model } = require('mongoose');

// Create Schema
const ListSchema = new Schema({
  desc: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  links: {
    type: Array,
    required: false,
  },
  slug: {
    type: String,
    required: true,
  }
});

const List = model('list', ListSchema);

module.exports = List;
