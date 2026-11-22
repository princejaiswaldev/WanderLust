//all required modules

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("./models/listing.js");
const port = 8080;
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");


//app configuration

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



//database connection

async function main() {
    await mongoose.connect(mongo_url);
}

main().then((res) => {
    console.log("db connected");
}).catch((err) => {
    console.log(err);
});




//routes



//index route


app.get("/",(req,res) => {
    res.send("hii its working");    
});




//listings route


app.get("/listings", wrapAsync(async (req,res) => {
    let all_list = await List.find({});

    res.render("listings/index.ejs",{all_list});
}));




//show route


app.get("/listings/:id/show", wrapAsync(async (req,res) => {
    let {id} = req.params;

    let list = await List.findById(id);

    res.render("listings/show.ejs",{list});
}));





//new form route

app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});


app.post("/listings/new", wrapAsync(async(req,res,next) => {
    
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }

    let {listing} = req.body;
    let list = await List.insertOne(listing);

    await list.save();

    res.redirect("/listings")
    

}));




//edit form route

app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;

    const list = await List.findById(id);

    res.render("listings/edit.ejs",{list});
}));

app.put("/listings/:id/edit", wrapAsync(async (req,res) => {
    
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }

    let {id} = req.params;
    let {listing} = req.body;
    await List.findByIdAndUpdate(id,{...listing});

    res.redirect(`/listings/${id}/show`);
}));





//delete route

app.delete("/listings/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;

    await List.findByIdAndDelete(id);

    res.redirect("/listings");
}));





//middlewares


//error handling middleware funtion

app.all("/{*splat}",(req,res,next) => {
    next(new ExpressError(404,"page not found"));
});


app.use((err,req,res,next) => {
    let {status=500,message="something went wrong"} = err;
    console.log(err);
    res.status(status).render("Error.ejs",{message});

});









//server connection
app.listen(port,() =>{
    console.log(`listening on port ${port}`);
});