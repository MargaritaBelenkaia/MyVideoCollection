var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');
var titlize     = require('mongoose-title-case');
var validate    = require('mongoose-validator');

//VALIDATORS
var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3,30], 
        message: 'Name should be {ARGS[0]} to {ARGS[1]} characters long.'
    }),
    validate({
        validator: 'matches',
        arguments: ['(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$'], 
        message: 'Please check your name field. No special characters or numbers allowed. A space is required in between. The firstname and the lastname should be at least 3 characters each.'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3,25], 
        message: 'Username should be {ARGS[0]} to {ARGS[1]} characters long.'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Please make shure your username contains letters and numbers only. No spaces allowed.'
    })
];

var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [8,25], 
        message: 'Password should be {ARGS[0]} to {ARGS[1]} characters long.'
    }),
    validate({
        validator: 'matches',
        arguments: ['^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d^a-zA-Z0-9]'], 
        message: 'Please check your password field. It should contain an uppercase letter, a lowercase letter, and a number. And an inspiring message. And blood of a dragon of course. P.S. Special characters are allowed.'
    })
];

//REGDATA PATTERN
var UserSchema = new Schema({
  name: { type: String, required: true, validate: nameValidator }, 
  username: { type: String, required: true, unique: true, validate: usernameValidator },
  password: { type: String, required: true, validate: passwordValidator }, 
  confirm: { type: String, required: true }
});

//ENCRYPT PASSWORD
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
    next();
    });
});

//ENCRYPT CONFIRM
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.confirm, null, null, function(err, hash) {
        if(err) return next(err);
        user.confirm = hash;
    next();
    });
});

// Attach some mongoose hooks
UserSchema.plugin(titlize, {
  paths: [ 'name' ] // Array of paths 
});


UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
