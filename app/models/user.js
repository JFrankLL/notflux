var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize  = require('mongoose-title-case');
var validate = require('mongoose-validator');

// VALIDATORS
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z]+$/,
        message: 'No special characters or numbers in field [Name].'
    })
];
var emailValidator = [
     validate({
        validator: 'isEmail',
        message: 'No a valid email in field [Email].'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} character'
    })
];
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];
var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [6, 35],
        message: 'Password should be at least {ARGS[0]} characters'
    })
];

var UserSchema = new Schema({
    name:     { type: String, required: true, validate: nameValidator },
    username: { type: String, lowercase: true, require: true, unique: true, validate: usernameValidator },
    password: { type: String, required: true, validate: passwordValidator },
    email:    { type: String, required: true, unique: true, validate: emailValidator },
    tipo:     { type: String }
});

//"STORED PROC"
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });

});
// name consistency CAPITAL LETTERS only
UserSchema.plugin(titlize, {
    paths: [ 'name' ]
});
// custom method
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);