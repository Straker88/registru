let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');


const PacientSchema = new Schema({
    numar: { type: Number, },
    cabinet: { type: String },
    nume: { type: String },
    denumire_aparat: { type: String },
    serie_aparat: { type: String },
    defectiune_reclamata: { type: String },
    constatare_cabinet: { type: String },
    garantie: { type: String },
    cutie: { type: String },
    baterie: { type: String },
    mulaj: { type: String },
    oliva: { type: String },
    data_inregistrare: { type: String, default: () => new moment().format('DD/MM/YYYY') },
    data_estimativa: { type: String, default: () => new moment().businessAdd(13).format('DD/MM/YYYY') },
    observatii_cabinet: { type: String },
    observatii_pacient: { type: String },
    iesit_cabinet: { type: String },
    predat_pacient: { type: String },
    sosit_cabinet: { type: String },

    email: { type: String, },
    updated_at: { type: String },
});

PacientSchema.pre('save', function (next) {
    now = new moment().format('DD/MM/YYYY');
    this.updated_at = now;
    next()
});

// PacientSchema.pre('save', function (next) {
//     numar = pacient._id;
//     console.log("numar");
//     next()
// });


module.exports = mongoose.model('Pacient', PacientSchema);

