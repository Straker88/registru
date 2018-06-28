var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
moment.locale('ro')

var PacientSchema = new Schema({
    postedBy: { type: String },
    cabinet: { type: String },
    name: { type: String },
    email: { type: String, },
    permission: { type: String, default: 'moderator' },
    created: { type: String, default: () => moment(new Date).format('LLLL') },
    updated_at: { type: String }
});

PacientSchema.pre('save', function (next) {
    now = moment().format('LLLL');
    this.updated_at = now;
    next()

});

module.exports = mongoose.model('Pacient', PacientSchema); 
