const mongoose = require("mongoose");

const wallet = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        balance: {
            type: Number,
            default: 1000
        }

    },
    { versionKey: false }
)

module.exports = mongoose.model("wallet", wallet);