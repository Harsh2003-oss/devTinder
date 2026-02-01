const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, 
        },
        toUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, 
        },
        status:{
            type: String,
            enum:{
                values: ["ignored", "interested", "accepted", "rejected"]
            },
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

//Compound indexing
connectionRequestSchema.index({fromUserId : 1 , toUserId:1})

connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});


const ConnectionRequest = mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports = ConnectionRequest;
