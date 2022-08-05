const express = require("express");
const morgan = require("morgan");
// const { urlencoded, json } = require("body-parser");
const cors = require("cors");
const app = express();

const connect = require("./connect");
const { Step, TestingSession, StepResponse, TestScript } = require("./schemas/schemas");

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(urlencoded({ extended: true }));
// app.use(json());
app.use(cors());

// Queries
// app.post("/upload-image", async (req, res) => {
//     console.log(req.body);
// })

app.post("/add-testing-session", async (req, res) => {
    const testScriptID = req.body.testScriptID;
    const testingSessionTester = req.body.testingSessionTester;
    const testingSessionPass = req.body.testingSessionPass;
    const testingSessionComplete = req.body.testingSessionComplete;
    const testingSessionStoppedAt = req.body.testingSessionStoppedAt;
    const testingSessionFailedSteps = req.body.testingSessionFailedSteps;
    const testingSessionStepsWithMinorIssues = req.body.testingSessionStepsWithMinorIssues;
    const testingSessionStepResponses = req.body.testingSessionStepResponses;
    try {
        // console.log(testingSessionFailedSteps);
        const testingSession = await TestingSession.create({
            testScriptID: testScriptID,
            tester: testingSessionTester,
            pass: testingSessionPass,
            complete: testingSessionComplete,
            stoppedTestingAtStep: testingSessionStoppedAt,
            failedSteps: testingSessionFailedSteps,
            stepsWithMinorIssues: testingSessionStepsWithMinorIssues,
        });
        await addStepResponses(testingSession.toObject()._id.toString(), testingSessionStepResponses);
        await checkNumberOfStepResponsesWritten(testingSession.toObject()._id.toString());
        console.log("testing session added to DB");
        res.status(201).json(testingSession.toObject());
    } catch (e) {
        res.status(500).send;
    }
});

app.get("/get-test-script-names", async (req, res) => {
    try {
        const testScriptNames = await TestScript.find(
            {},
            { "name_lowercase": 1, "_id": 0 }
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
            { name_lowercase: testScriptName },
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

app.get("/get-test-script-steps/:testScriptID", async (req, res) => {
    const testScriptID = req.params.testScriptID;
    try {
        const steps = await Step.find(
            { testScriptID: testScriptID }
        ).sort({ number: "asc" }).lean().exec();
        res.status(200).json(steps);
    } catch (e) {
        res.status(500).send;
    }
});

// Helper functions
const addStepResponses = async (testingSessionID, stepResponsesToAdd) => {
    addTestingSessionIDToStepResponses(testingSessionID, stepResponsesToAdd);
    for (let i = 0; i < stepResponsesToAdd.length; i++) {
        try {
            console.log("creating step response");
            await StepResponse.create(stepResponsesToAdd[i]);
        } catch (e) {
            console.log(e);
        }
    }
    console.log("step responses added");
}

const addTestingSessionIDToStepResponses = (testingSessionID, stepResponsesToAdd) => {
    for (let i = 0; i < stepResponsesToAdd.length; i++) {
        stepResponsesToAdd[i]["sessionID"] = testingSessionID;
    }
}

const checkNumberOfStepResponsesWritten = async (testingSessionID) => {
    try {
        const stepResponses = await StepResponse.find(
            { sessionID: testingSessionID }
        ).lean().exec();
        if (!stepResponses.length) {
            await TestingSession.findByIdAndDelete(testingSessionID).exec();
        }
    } catch (e) {
        console.log(e);
    }
}

connect()
    // .then(() => app.listen(5000, () => {
    //     console.log("Yay! Your server is running on http://localhost:5000!");
    // }))
    // .catch(e => console.error(e));

    .then(() => app.listen(process.env.PORT || 5000, () => {
        console.log("Yay! Your server is running on port 5000!");
    }))
    .catch(e => console.error(e));
