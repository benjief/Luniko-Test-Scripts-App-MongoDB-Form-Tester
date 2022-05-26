const express = require("express");
const morgan = require("morgan");
// const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const { Step, TestScript } = require("./schemas/testScript");
// const e = require("express");

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(urlencoded({ extended: true }));
// app.use(json());
app.use(cors());

// Queries
app.get("/get-test-script-names", async (req, res) => {
    try {
        const testScriptNames = await TestScript.find(
            {},
            { "name": 1, "_id": 0 }
        ).lean().exec();
        res.status(200).json(testScriptNames);
    } catch (e) {
        res.status(500).send;
    }
});

app.get("/get-test-script/:testScriptName", async (req, res) => {
    const testScriptName = req.params.testScriptName;
    console.log("fetching", testScriptName);
    try {
        const testScript = await TestScript.findOne(
            { name: testScriptName },
            {
                "name": 1,
                "description": 1,
                "owner": 1,
                "primaryWorkstream": 1,
                "steps": 1
            }
        ).lean().exec();
        res.status(200).json(testScript);
    } catch (e) {
        res.status(500).send;
    }
});

connect()
    .then(() => app.listen(5000, () => {
        console.log("Yay! Your server is running on http://localhost:5000!");
    }))
    .catch(e => console.error(e));
