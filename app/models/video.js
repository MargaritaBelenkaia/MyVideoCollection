var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var validate    = require('mongoose-validator');

//VALIDATORS
var linkValidator = [
    validate({
        validator: 'matches',
        arguments: ['(?:youtube\.com|youtu\.be)'],  
        message: 'Please make sure it\'s an original YouTube link. Use the placeholder as a reference.'
    })
];

var titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [3,25], 
        message: 'Title should be {ARGS[0]} to {ARGS[1]} characters long.'
    }),
];

var categoryValidator = [
    validate({
        validator: 'isLength',
        arguments: [3,25], 
        message: 'Category should be {ARGS[0]} to {ARGS[1]} characters long.'
    }),
];

//VIDEODATA PATTERN
var VideoSchema = new Schema({
    title: { type: String, required: true, validate: titleValidator }, 
    description: { type: String },
    category: { type: String, required: true, validate: categoryValidator }, 
    link: { type: String, required: true, unique: true, validate: linkValidator }
});

module.exports = mongoose.model('Video', VideoSchema);

