

const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    options: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    }]   
    });
   
const VoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    selectedOption: {
        type: String,
        required: true
    }
});

        const Election =mongoose.model('Election',ElectionSchema);
        const Vote=mongoose.model('Vote',VoteSchema);

    module.exports={Election,Vote};