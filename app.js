const express= require("express");
const bodyParser = require("body-parser");
const date= require(__dirname+"/date.js");

const app= express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"))

const items=[];
const workItems=[]
app.set('view engine','ejs');



app.get("/",function(req,res){

    let day = date.getDate();

    res.render("list",{listTitle:day, listItem:items});
})

app.post("/",function(req,res){
    let item= req.body.newitem;
    
    if(req.body.list === "work"){
        workItems.push(item);
        res.redirect("/work")
    }else {
        items.push(item);
        res.redirect("/")
    }
 
})

app.get("/work",function(req,res){
    res.render("list",{listTitle:"work List",listItem:workItems})
})


app.get("/about",function(req,res){
  res.render("about")  ;
})

app.post("/work",function(req,res){
    let item=req.body.newitem
    workItems.push(item)
    res.redirect("/work")
})

app.listen(3000,function(){
    console.log("Server running on 3000")
})