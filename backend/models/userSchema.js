const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    birthdate: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isAdmin:{type:Boolean,required:true},
    orders: {
        quantity: { type: Number},
        flight: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flight'
        }
    }
});

module.exports = mongoose.model("User", userSchema);

