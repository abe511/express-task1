const fs = require('fs');
const express = require('express');
const router = express.Router();
const uuid = require('uuid').v4;


const validator = (req, res, next) => {
    const isNameValid = /[a-z A-Z]{2,256}/g.test(req.body.name);
    const isPhoneValid = /(\+?\(?374\)?|0)(-?[0-9]{2}){4}\b/g.test(req.body.phone);
    if(isNameValid)
        res.locals.nameValid = true;
    if(isPhoneValid)
        res.locals.phoneValid = true;
    next();
};

router.use("/add", validator);
router.use("/edit/:id", validator);

router.get('/', (req, res, next) => {
    res.redirect('/');
});

router.get('/new', (req, res) => {
    res.render('./contacts/new-contact', {title: "New Contact"});
});

router.post("/add", (req, res) => {
    if(!res.locals.nameValid || !res.locals.phoneValid) 
        res.sendStatus(400);
    let contacts = readData();
    contacts.push({
        _id: uuid(),
        name: req.body.name,
        phone: req.body.phone
    });
    writeData(contacts);
    res.redirect('/');
});

router.get('/edit/:id', (req, res, next) => {
    const contacts = readData();
    if(req.query.delete === "true") {
        const filtered = contacts.filter((entry) => {
            return entry._id !== req.params.id;
        });
        writeData(filtered);
        res.redirect('/');
    } else {
        contacts.forEach((entry) => {
            if(entry._id === req.params.id) {
                res.render('./contacts/edit-contact', {
                    title: "Edit Contact",
                    id: entry._id,
                    name: entry.name,
                    phone: entry.phone,
                });
            }
        });
    }
});

router.post("/edit/:id", (req, res) => {
    if(!res.locals.nameValid || !res.locals.phoneValid) {
        res.sendStatus(400);
    } else {
        if(req.body._method === "Save") {
            const contacts = readData();
            const updated = contacts.map((entry) => {
                if(entry._id === req.params.id) {
                    entry.name = req.body.name;
                    entry.phone = req.body.phone;
                }
                return entry;
            });
            writeData(updated);
        }
        if(req.body._method === "Delete") {
            const contacts = readData();
            const filtered = contacts.filter((entry) => {
                return entry._id !== req.params.id;
            });
            writeData(filtered);
        }
        res.redirect('/');
    }
});


const readData = () => {
    return JSON.parse(fs.readFileSync("contacts.json"));
};

const writeData = (data) => {
    fs.writeFile("contacts.json", JSON.stringify(data), (err) => {
        if(err)
            console.log(err);
    });
};

module.exports = router;