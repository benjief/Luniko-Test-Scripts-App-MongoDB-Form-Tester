import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "./Context/ValidationErrorContext";
import Axios from "axios";
import LoadingWrapper from "./wrappers/LoadingWrapper/LoadingWrapper";
import ErrorWrapper from "./wrappers/ErrorWrapper";
import CardWrapper from "./wrappers/CardWrapper";
import EnterTestScriptNameCard from "../../components/EnterTestScriptNameCard";
import TestingFormCard from "../../components/TestingFormCard";
import TestStepCard from "../../components/TestStepCard";
import "../../styles/TestScriptTestingPage.css";
import "../../styles/InputComponents.css";
import "../../styles/CardComponents.css";
import "../../styles/SelectorComponents.css";
import "../../styles/AlertComponents.css";
import "../../styles/DialogComponents.css";

function TestScriptTestingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isRequestTestScriptButtonDisabled, setIsRequestTestScriptButtonDisabled] = useState(true);
    const [isBeginTestingButtonDisabled, setIsBeginTestingButtonDisabled] = useState(true);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [formProps, setFormProps] = useState({
        testScriptName: "",
        testScriptDescription: "",
        testScriptPrimaryWorkstream: "",
        testerFirstName: "",
        testerLastName: "",
    });
    const testScriptID = useRef("");
    const [testScriptSteps, setTestScriptSteps] = useState([]);
    const [currentStepNumber, setCurrentStepNumber] = useState(1);
    const [stepResponses, setStepResponses] = useState([]);
    const cardChanged = useRef(false);
    const stepChanged = useRef(false);
    const [isTestingInProgress, setIsTestingInProgress] = useState(false);
    const [currentStepResponseProps, setCurrentStepResponseProps] = useState({
        sessionID: "",
        stepID: "",
        comments: "",
        pass: true,
    });
    const allFailedSteps = useRef([]);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Test script results successfully submitted!");
    const alertType = useRef("success-alert");
    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [areTestScriptResultsSubmitted, setAreTestScriptResultsSubmitted] = useState(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = "Apologies! We've encountered an error. Please attempt to re-submit your test script results.";

    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage
            : alertMessage.current = writeErrorMessage;

        // Delay is set up just in case an error is generated before the is fully-displayed
        // let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;
        let delay = 0; // TODO: test this and amend if necessary

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            setAlert(true);
        }, delay);
    }, [alertType, rendering]);

    const handleAlertClosed = () => {
        console.log("closing alert");
        window.location.reload();
        setIsErrorThrown(false); // TODO: test this... is it needed anymore?
    }

    useEffect(() => {
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchTestScriptNamesAlreadyInDB();
            setRendering(false);
        }

        const fetchTestScriptNamesAlreadyInDB = async () => {
            console.log("fetching existing test script names");
            try {
                async.current = true;
                await Axios.get("http://localhost:5000/get-test-script-names", {
                    timeout: 5000
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name }) => name);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchTestScriptInformation(testScriptName);
            await fetchTestScriptSteps(testScriptID.current);
            setRendering(false);
        }

        const fetchTestScriptInformation = async (testScriptName) => {
            try {
                async.current = true;
                await Axios.get(`http://localhost:5000/get-test-script/${testScriptName}`, {
                    timeout: 5000
                })
                    .then(res => {
                        populateTestScriptInformation(res.data);
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const populateTestScriptInformation = (testScriptInformation) => {
            setFormProps(
                prev => ({
                    ...prev,
                    "testScriptName": testScriptInformation.name,
                    "testScriptDescription": testScriptInformation.description,
                    "testScriptPrimaryWorkstream": testScriptInformation.primaryWorkstream
                })
            );
            testScriptID.current = testScriptInformation._id;
            async.current = false;
        }

        const fetchTestScriptSteps = async (testScriptID) => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`http://localhost:5000/get-test-script-steps/${testScriptID}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            setTestScriptSteps(res.data);
                            async.current = false;
                        })
                } catch (e) {
                    console.log(e);
                    handleError("r");
                }
            }
        }

        if (rendering) {
            if (!isValidTestScriptNameEntered && !isDataBeingFetched.current && !isTestingInProgress) { // TODO: go over logic here
                runPrimaryReadAsyncFunctions();
            } else if (isValidTestScriptNameEntered) {
                if (!isTestingInProgress && !isDataBeingFetched.current) {
                    runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                } else if (cardChanged.current) {
                    setRendering(false);
                } else if (stepChanged.current) {
                    setRendering(false);
                }
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsRequestTestScriptButtonDisabled(false) : setIsRequestTestScriptButtonDisabled(true);
            } else {
                stepResponses.length ? setIsSubmitButtonDisabled(false) : setIsSubmitButtonDisabled(true);
                if (!areTestScriptResultsSubmitted) {
                    (formProps["testerFirstName"].trim() !== "" && formProps["testerLastName"].trim() !== "")
                        ? setIsBeginTestingButtonDisabled(false) : setIsBeginTestingButtonDisabled(true);
                }
            }
        }
    }, [rendering, isDataBeingFetched, cardChanged, formProps, isValidTestScriptNameEntered, isTestingInProgress, areTestScriptResultsSubmitted, stepResponses, stepChanged, handleError]);

    const handleChangeCard = () => {
        setRendering(true);
        cardChanged.current = true;
        isTestingInProgress ? setIsTestingInProgress(false) : setIsTestingInProgress(true);
    }

    const handleRequestTestScript = () => { // TODO: make this more direct
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsRequestTestScriptButtonDisabled(true);
            } else {
                invalidTestScriptNameError("Invalid test script name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const validateTestScriptNameEntered = () => {
        for (let i = 0; i < testScriptNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["testScriptName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(testScriptNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    const handleSaveStepResponse = (newStepNumber) => {
        let copyOfCurrentStepResponseProps = currentStepResponseProps;
        copyOfCurrentStepResponseProps["stepID"] = testScriptSteps[currentStepNumber - 1]._id;
        let copyOfStepResponses = stepResponses;
        if (currentStepNumber > stepResponses.length) {
            copyOfStepResponses.push(copyOfCurrentStepResponseProps);
        } else {
            copyOfStepResponses[currentStepNumber - 1] = currentStepResponseProps;
        }
        setStepResponses(copyOfStepResponses);
        if (newStepNumber !== currentStepNumber) {
            handleChangeStep(newStepNumber);
            setRendering(true);
        }
    }

    const handleChangeStep = (newStepNumber) => {
        setCurrentStepNumber(newStepNumber);
        resetCurrentResponseProps(newStepNumber);
    }

    const resetCurrentResponseProps = (stepNumber) => {
        setCurrentStepResponseProps(
            stepNumber > stepResponses.length
                ? prev => ({
                    ...prev,
                    stepID: "",
                    comments: "",
                    pass: true,
                })
                : stepResponses[stepNumber - 1]
        );
        stepChanged.current = true;
    }

    const handleSubmitTestScriptResults = () => {
        setAreTestScriptResultsSubmitted(true);
        setIsBeginTestingButtonDisabled(true);
        setIsSubmitButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    const runWriteAsyncFunctions = async () => {
        console.log("running write async functions");
        await addTestScriptResultsToDB();
        console.log("setting alert to true")
        setAlert(true);
    }

    const addTestScriptResultsToDB = async () => {
        console.log("adding test script results to DB");
        console.log(stepResponses);
        async.current = true;
        try {
            identifyAllFailedSteps();
            await Axios.post("http://localhost:5000/add-testing-session", {
                testScriptID: testScriptID.current,
                testingSessionTester: { firstName: formProps["testerFirstName"], lastName: formProps["testerLastName"] },
                testingSessionPass: allFailedSteps.current.length ? false : true,
                testingSessionComplete: !(stepResponses.length < testScriptSteps.length),
                testingSessionStoppedAt: currentStepNumber,
                testingSessionFailedSteps: allFailedSteps.current,
                testingSessionStepResponses: stepResponses,
            }, { timeout: 5000 })
                .then(res => {
                    console.log(res);
                    async.current = false;
                    console.log("test script results written to DB");
                })
        } catch (e) {
            console.log(e);
            handleError("w");
        }
    }

    const identifyAllFailedSteps = () => {
        let tempArray = [];
        for (let i = 0; i < stepResponses.length; i++) {
            if (!stepResponses[i].pass) {
                tempArray.push(i + 1);
            }
        }
        allFailedSteps.current = tempArray;
    }

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transtitionElementVisibility}>
            </LoadingWrapper>
            <ErrorWrapper
                alert={alert}
                alertMessage={alertMessage.current}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}> {/* TODO: change alertType hook to useState? */}
            </ErrorWrapper>
            {isValidTestScriptNameEntered
                ? <CardWrapper
                    rendering={rendering}
                    isErrorThrown={isErrorThrown}
                    isTestingInProgress={isTestingInProgress}>
                    {isTestingInProgress
                        ? <TestStepCard
                            goBackToTestingLandingPage={handleChangeCard}
                            setCurrentStepResponseProps={setCurrentStepResponseProps}
                            saveStepResponse={handleSaveStepResponse}
                            existingComments={currentStepResponseProps["comments"]}
                            existingPass={currentStepResponseProps["pass"]}
                            stepID={testScriptSteps[currentStepNumber - 1]._id}
                            stepNumber={testScriptSteps[currentStepNumber - 1].number}
                            stepDescription={testScriptSteps[currentStepNumber - 1].description}
                            totalNumberOfSteps={testScriptSteps.length}>
                        </TestStepCard>
                        : <TestingFormCard
                            setFormProps={setFormProps}
                            testScriptName={formProps["testScriptName"]}
                            testScriptDescription={formProps["testScriptDescription"]}
                            testScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                            existingTesterFirstName={formProps["testerFirstName"]}
                            existingTesterLastName={formProps["testerLastName"]}
                            beginTesting={handleChangeCard}
                            isBeginTestingButtonDisabled={isBeginTestingButtonDisabled}
                            setIsTestScriptSubmitted={setAreTestScriptResultsSubmitted}
                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                            hasUserCompletedAnyStepResponses={stepResponses.length > 0}
                            hasUserCompletedAllStepResponses={stepResponses.length === testScriptSteps.length}
                            submitTestScriptResults={handleSubmitTestScriptResults}
                            displayFadingBalls={displayFadingBalls}>
                        </TestingFormCard>}
                </CardWrapper >
                : <div className="enter-valid-test-script-name">
                    <div className="enter-valid-test-script-name-container">
                        <div className="page-message">
                            Retrieve Your Test Script Below:
                        </div>
                        <div className="enter-valid-test-script-name-card">
                            <EnterTestScriptNameCard
                                setFormProps={setFormProps}
                                requestTestScript={handleRequestTestScript}
                                isSubmitButtonDisabled={isRequestTestScriptButtonDisabled}>
                            </EnterTestScriptNameCard>
                        </div>
                    </div>
                </div>}
        </Fragment >
    )
};

export default TestScriptTestingPage;
