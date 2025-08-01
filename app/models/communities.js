const mongoose = require('mongoose')

const ComunityScheme = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    leader: {
        type: String
    },
    startDate: {
        type: String
    },
    status: {
        type: String
    },
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('communities', ComunityScheme)