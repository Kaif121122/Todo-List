const express = require('express');
const bodyParser = require('body-parser');
let ejs = require('ejs');
const date = require(__dirname + '/date.js');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kaif9987699:Kaif121122@cluster0.vavz40m.mongodb.net/todolistDB');


const app = express();

// let items = ["Buy Food", "Cook Food", "Eat Food"];
// let workItems = [];

const itemSchema = {
    name: String,

};

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: "Welcome"
});

const item2 = new Item({
    name: "Hit the + button"
});

const item3 = new Item({
    name: "<-- delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema],

}

const List = mongoose.model("List", listSchema)

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {

        // let myDay = date.getDay();


        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("successfully added!")
                }
            });
            res.redirect('/');
        } else {
            res.render('list', { listTitle: "Today", newListItems: foundItems });
        }
    });
});

app.get('/:customListName', (req, res) => {
    if (req.params.customListName != "favicon.ico") {

        const customListName = _.capitalize(req.params.customListName);
        List.findOne({ name: customListName }, (err, foundList) => {
            if (!err) {
                if (!foundList) {
                    const list = new List({
                        name: customListName,
                        items: defaultItems
                    })
                    list.save();
                    res.redirect("/" + customListName)

                } else {
                    res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
                }
            }
        })

    }
})

app.post('/', (req, res) => {

    let itemName = req.body.firstItem;
    let listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {

        item.save();

        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }

})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {

        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (!err) {
                console.log("successfully deleted")
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        })

    }

})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
})