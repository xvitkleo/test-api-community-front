const mongoose = require('mongoose')

const MemberScheme = new mongoose.Schema({
    id: {
        type: String
    },
    code: {
        type: String
    },
    name: {
        type: String
    },
    mentor: {
        type: Boolean
    },
    status: {
        type: String
    },
    responsible: {
        type: String
    },
    project: {
        type: String
    },
    technology: {
        type: String
    },
    communityId: {
        type: String
    },
    notes: {
        type: String
    },
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('members', MemberScheme)