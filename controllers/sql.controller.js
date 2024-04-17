const testController = (req, res) => {
    res.send("Hello, World!");
};

const anotherController = (req, res) => {
    res.send("Another controller function");
};

module.exports = {
    testController,
    anotherController
};

