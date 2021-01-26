const express= require("express");
const bodyParser = require("body-parser");
// const date= require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash")
const app= express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"))



app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/todo;istDB",{useNewUrlParser:true})

const itemSchema= new mongoose.Schema( {
    name:String
})

const Item = mongoose.model("Item",itemSchema)

const item1 = new Item ({
    name: "Welcome to your todolist!"
})


const item2 = new Item ({
    name: "Hit the + button to add a new item."
})


const item3 = new Item ({
    name: "<-- Hit this to delete an item"
})

const listSchema = {
    name:String,
    items: [itemSchema]
};

const List = mongoose.model("List",listSchema);

const defaultItem = [item1,item2,item3]
app.get("/",function(req,res){
    
Item.find(function(err,items){
    if(items.length === 0){
       Item.insertMany(defaultItem, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("successfully added");
    }
})
    }else{
        res.render("list",{listTitle:"Today", listItem:items});
    }
})

    // let day = date.getDate();
})

app.post("/",function(req,res){
    const itemName = req.body.newitem;
    const listName= req.body.list
    const itemInput = new Item ({
        name:itemName
    })

    if(listName === "Today"){
        itemInput.save();
        res.redirect("/");
    } else{
       List.findOne({name:listName},function(err,foundList){
           foundList.items.push(itemInput)
           foundList.save();
           res.redirect("/"+listName)
       })
    }
    
    
})

app.post("/delete",function(req,res){
  const checkedId= req.body.checkbox;
  const listName= req.body.listName

  if(listName==="Today"){
    Item.findByIdAndRemove(checkedId,function(err){
        console.log(err);
    })
    res.redirect("/") 
  } else {
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedId}}},function(err,foundList){
       if(!err){
           res.redirect("/"+listName)
       } })

  }

})

 

 
app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list = new List ({
                    name:customListName,
                    items:defaultItem
                })
                list.save();
                res.redirect("/"+customListName)
                
            } else {
                res.render("list",{listTitle:foundList.name, listItem:foundList.items})
            }
        }
    })
     
    
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