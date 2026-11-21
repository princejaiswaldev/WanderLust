const mongoose = require("mongoose");
const List = require("../models/listing.js");
const samdata = require("./data.js");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";


async function main() {
    await mongoose.connect(mongo_url);
}

main().then((res) => {
    console.log("db connected");
}).catch((err) => {
    console.log(err);
});

const initdb = async () => {
    await List.deleteMany({});  
    await List.insertMany(samdata.data);

    console.log("data was created and initialized");
};

initdb();