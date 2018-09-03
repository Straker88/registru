let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
// moment.locale('ro')


const PacientSchema = new Schema({
    data_inregistrare: { type: String, default: () => new moment().format('DD/MM/YYYY') },
    cabinet: { type: String },
    nume: { type: String },
    denumire_aparat: { type: String },
    serie_aparat: { type: String },
    defectiune_reclamata: { type: String },
    garantie: { type: String },
    cutie: { type: String },
    baterie: { type: String },
    mulaj: { type: String },
    oliva: { type: String },
    observatii_cabinet: { type: String },
    observatii_pacient: { type: String },
    iesit_cabinet: { type: String },
    predat_pacient: { type: String },
    sosit_cabinet: { type: String },

    // postedBy: { type: String },
    email: { type: String, },
    permission: { type: String, default: 'moderator' },
    updated_at: { type: String }
});

PacientSchema.pre('save', function (next) {
    now = new moment().format('DD/MM/YYYY');
    this.updated_at = now;
    next()
});

module.exports = mongoose.model('Pacient', PacientSchema);

