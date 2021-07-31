var express = require("express");
var userRouter = require("./user");
var amenityRouter = require("./amenity");
var propertyRouter = require("./property");
var locationRouter = require("./location");
var app = express();

app.use("/user/", userRouter);
app.use("/amenity/", amenityRouter);
app.use("/property/", propertyRouter);
app.use("/location/", locationRouter);

module.exports = app;
