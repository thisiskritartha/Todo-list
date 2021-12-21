const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDb");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todo List"
})

const item2 = new Item({
  name: "Hit + to add to the List"
})

const item3 = new Item({
  name: "<-- to delete an item."
})

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("list", listSchema);

app.get("/", function(req, res) {
  // const day = date.getDay1();
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Item inserted Successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listOfWorks: "Today", newListItems: foundItems});
    }

  })
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);
  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        console.log("Doesn't Exist");
        //Create a new list
        const list = new List ({
         name: customListName,
         items: defaultItems
       });
       list.save();
     } else {
       //show the existing list
      res.render("list", {listOfWorks: foundList.name, newListItems: foundList.items});
     }
    }

})
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list; //from the button

  const item = new Item({
    name: itemName
  });

  if(listName == "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundlist){
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/" + listName);
})
}
})

app.post("/delete", function(req, res){
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItem, function(err){
      if (err){
        console.log(err);
      } else {
        console.log("Successfully Deleted");
      }
    })
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    })
  }

})

app.listen("3000", function() {
  console.log("The Server is running on Port 3000");
});
