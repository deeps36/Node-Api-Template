module.exports = app => {
    const user = require("../controllers/userController.js");

    var router = require("express").Router();

    router.post("/login", user.login);
    router.post("/birdView", user.birdView);
    router.post("/insertPatient", user.insertPatient);
    router.post("/deletePatient", user.deletePatient);
    
    app.use("/", router);
};
      