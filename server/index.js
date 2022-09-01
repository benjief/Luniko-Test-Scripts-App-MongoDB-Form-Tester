const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const connect = require("./connect");
const { Step, TestingSession, StepResponse, TestScript } = require("./schemas/schemas");

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Queries
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
        await checkIfStepResponsesWereWritten(testingSession.toObject()._id.toString());
        // console.log("testing session added to DB");
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
/**
 * Writes step responses associated with a testing session to the database.
 * @param {string} testingSessionID - ID of the testing session with which step responses are associated it.
 * @param {array} stepResponsesToAdd - the step responses to be writted to the database.
 */
const addStepResponses = async (testingSessionID, stepResponsesToAdd) => {
    addTestingSessionIDToStepResponses(testingSessionID, stepResponsesToAdd);
    for (let i = 0; i < stepResponsesToAdd.length; i++) {
        try {
            // console.log("creating step response");
            await StepResponse.create(stepResponsesToAdd[i]);
        } catch (e) {
            console.log(e);
        }
    }
    // console.log("step responses added");
}

/** 
 * Adds the correct test script ID to all step responses in stepResponsesToAdd array.
 * @param {string} testingSessionID - the ID of the testing session that the step responses being added to the database are a part of.
 * @param {array} stepsToAdd - array of step responses for which an ID attribute is to be written.
*/
const addTestingSessionIDToStepResponses = (testingSessionID, stepResponsesToAdd) => {
    for (let i = 0; i < stepResponsesToAdd.length; i++) {
        stepResponsesToAdd[i]["sessionID"] = testingSessionID;
    }
}

/**
 * Determines whether or not step responses were written for a particular testing session. If none were written, the testing session is removed from the database.
 * @param {string} testingSessionID - ID of the testing session in question.
 */
const checkIfStepResponsesWereWritten = async (testingSessionID) => {
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
    // local connection code
    // .then(() => app.listen(5000, () => {
    //     console.log("Yay! Your server is running on http://localhost:5000!");
    // }))
    // .catch(e => console.error(e));

    // Heroku connection code
    .then(() => app.listen(process.env.PORT || 5000, () => {
        console.log("Yay! Your server is running on port 5000!");
    }))
    .catch(e => console.error(e));
