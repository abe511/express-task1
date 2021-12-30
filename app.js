const path = require('path');
const express = require('express');
const app = express();

const indexRouter = require("./routes/index");
const contactsRouter = require("./routes/contacts");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/',indexRouter);
app.use('/contacts', contactsRouter);

app.listen(process.env.PORT || 3000);