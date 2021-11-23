//npm packages
const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
//const require(__dirname+"/date.js")
const mongoose=require("mongoose");
const _=require("lodash");
//mongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema={
  name:String
};

const  Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist"
});

const item2=new Item({
  name:"HIt + button to add items"
});


const defaultItem=[item1,item2];

const listsSchema={
  name:String,
  item:[itemsSchema]
};


const List= mongoose.model("List",listsSchema);
//mongo end here

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// const workItems=[];
//
// const items=["Pizza","Burgur","Coak"];

//const day=date.getdate();

app.get("/",function(req,res){
//It return the Array documnet
  Item.find({},function(err,items){
    if(items.length===0){
      Item.insertMany(defaultItem,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Item added Successfully");
        }
      });
      res.redirect("/");
    }else{
        res.render("list",{Title: "Today", NewI:items});
    }
  });
});

//Dynamic route
app.get("/:para",function(req , res){
const Customlist = _.capitalize(req.params.para);
//It return the only one object documnet
List.findOne({name: Customlist},function(err,foundList){
  if(!err){
    if(!foundList){
      const Cust=new List({
        name:Customlist,
        item:defaultItem
      });
      Cust.save();
      res.redirect("/"+Customlist);
    }else{
    res.render("list",{Title: foundList.name, NewI:foundList.item});
    }
  }
});
});


app.get("/about",function(req,res){
  res.render("about");
})


//post routs
app.post("/",function(req,res){
const Nitem= req.body.In;
const listN = req.body.list;
const Ntem = new Item({
  name:Nitem
});
if(listN==="Today"){
  Ntem.save();
  res.redirect("/");
}else{
  List.findOne({name:listN},function(err,foundList){
    foundList.item.push(Ntem);
    foundList.save();
    res.redirect("/"+listN);
  });
}
});

app.post("/delete",function(req,res){
  const id=req.body.checkbox;
  const listname=req.body.ListName;
  if(listname==="Today"){
    Item.findByIdAndRemove(id,function(err){
      if(!err){
        console.log("Successfully Deleted the item");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name:listname},{$pull:{item:{_id:id}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listname);
      }
    });
  }
});

app.listen(3000,function(){
  console.log("server is running ");
});
