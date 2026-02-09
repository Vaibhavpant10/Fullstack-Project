const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    title:String,
    content:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

});

module.exports = mongoose.model("Note",NoteSchema);
