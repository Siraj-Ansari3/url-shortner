const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
    shortId: {
        type: String,
        unique: true,
        required: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    visitHistory: [{                  //visitHistory is an array of the times when link is clicked.
        timestamps: { type: Number } 
    }]
}, { timestamps : true } );

const URL = mongoose.model('url', urlSchema);

module.exports = URL;