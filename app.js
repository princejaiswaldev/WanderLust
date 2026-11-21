const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("./models/listing.js");
const port = 8080;
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



async function main() {
    await mongoose.connect(mongo_url);
}

main().then((res) => {
    console.log("db connected");
}).catch((err) => {
    console.log(err);
});



app.listen(port,() =>{
    console.log(`listening on port ${port}`);
});


app.get("/",(req,res) => {
    res.send("hii its working");    
});

//index route

app.get("/listings",async (req,res) => {
    let all_list = await List.find({});

    res.render("listings/index.ejs",{all_list});
});

//show route

app.get("/listings/:id/show",async (req,res) => {
    let {id} = req.params;

    let list = await List.findById(id);

    res.render("listings/show.ejs",{list});
});

//new form route

app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

app.post("/listings/new",async (req,res) => {
    let {listing} = req.body;
    let list = await List.insertOne(listing);

    await list.save();

    res.redirect("/listings")

});

//edit form route

app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;

    const list = await List.findById(id);

    res.render("listings/edit.ejs",{list});
});

app.put("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    
    await List.findByIdAndUpdate(id,{...req.body});

    res.redirect(`/listings/${id}/show`);
});


//delete route

app.delete("/listings/:id",async(req,res) => {
    let {id} = req.params;

    await List.findByIdAndDelete(id);

    res.redirect("/listings");
});
