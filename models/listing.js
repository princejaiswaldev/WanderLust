const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2QKJBAUsObjczAakqfC0K6Jv9kno1FSb3SkEiaMMGOg&s",
        set: (v) => (!v || v.trim() === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2QKJBAUsObjczAakqfC0K6Jv9kno1FSb3SkEiaMMGOg&s" : v.trim()),
    },
    price:{
        type:Number,
        
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
});

const List = mongoose.model("List",listingSchema);

module.exports = List;