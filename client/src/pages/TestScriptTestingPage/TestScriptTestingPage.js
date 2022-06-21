import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "./Context/ValidationErrorContext";
// import { useNavigate } from "react-router-dom";
import Axios from "axios";
// import { v4 as uuidv4 } from "uuid";
import LoadingWrapper from "./wrappers/LoadingWrapper/LoadingWrapper";
import ErrorWrapper from "./wrappers/ErrorWrapper";
import CardWrapper from "./wrappers/CardWrapper";
// import NavBar from "../../components/Navbar";
// import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import EnterTestScriptNameCard from "../../components/EnterTestScriptNameCard";
import TestingFormCard from "../../components/TestingFormCard";
import TestStepCard from "../../components/TestStepCard";
// import MaterialAlert from "../../components/MaterialAlert";
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
    // const [invalidTestScriptNameError, setInvalidTestScriptNameError] = useState("");
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
        pass: false
    });
    // const [isTestingCompleted, setIsTestingCompleted] = useState(false);
    // const [testScriptSteps, setTestScriptSteps] = useState([]);
    // const [addOrModifySteps, setAddOrModifySteps] = useState(false);
    // const [isAddOrModifyStepsButtonDisabled, setIsAddOrModifyStepsButtonDisabled] = useState(false);
    // const [isAddStepButtonDisabled, setAddStepButtonDisabled] = useState(false);
    // const [isRemoveStepButtonDisabled, setRemoveStepButtonDisabled] = useState(true);
    // const [isModifyButtonDisabled, setIsModifyButtonDisabled] = useState(true);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Test script results successfully submitted!");
    const alertType = useRef("success-alert");
    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [areTestScriptResultsSubmitted, setAreTestScriptResultsSubmitted] = useState(false);
    // const resetStepResponseProps = useRef(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = "Apologies! We've encountered an error. Please attempt to re-submit your test script results.";

    // const navigate = useNavigate();

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
        // setAlert(false);
        // if (isValidTestScriptNameEntered) {
        //     setIsValidTestScriptNameEntered(false);
        // }
        // navigate("/");
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
            // setFormProps({
            //     testScriptName: testScriptInformation.name,
            //     testScriptDescription: testScriptInformation.description,
            //     testScriptPrimaryWorkstream: testScriptInformation.primaryWorkstream,
            // });
            // setTestScriptSteps(testScriptInformation.steps);
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
                            // setCurrentStep(res.data[0]);
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
                    // testScriptSteps.length && !testScriptSteps.slice(-1)[0]["description"].trim().length
                    //     ? setAddStepButtonDisabled(true)
                    //     : setAddStepButtonDisabled(false);
                    // testScriptSteps.length === 1
                    //     ? setRemoveStepButtonDisabled(true)
                    //     : setRemoveStepButtonDisabled(false);
                    // TODO: look into abstracting functions in useEffect hook... can this be done?
                }
            }
        }
    }, [rendering, isDataBeingFetched, cardChanged, formProps, isValidTestScriptNameEntered, isTestingInProgress, areTestScriptResultsSubmitted, stepResponses, stepChanged, handleError]);



    // const handleFormCallback = (returnedObject) => {
    //     const field = returnedObject.field;
    //     const value = returnedObject.value;
    //     if (field === "testScriptName") {
    //         console.log("resetting test script name error");
    //         // setInvalidTestScriptNameError("");
    //         invalidTestScriptNameError("");
    //     }
    //     setFormPropsForFieldAndValue(field, value);
    // }

    // const setFormPropsForFieldAndValue = (field, value) => {
    //     setFormProps((prevState) => ({
    //         ...prevState,
    //         [field]: value,
    //     }));
    // }

    // const handleChangeCard = (changeCard) => {
    //     if (changeCard) {
    //         setRendering(true);
    //         cardChanged.current = true;
    //         addOrModifySteps
    //             ? setAddOrModifySteps(false)
    //             : setAddOrModifySteps(true);
    //     }
    // }

    // const handleAddStep = (addStep) => {
    //     if (addStep) {
    //         console.log("adding step");
    //         let stepCount = testScriptSteps.length;
    //         let uniqueID = uuidv4();
    //         let newStep = { number: stepCount + 1, description: "", pass: false, id: uniqueID };
    //         let tempArray = testScriptSteps;
    //         tempArray.push(newStep);
    //         setTestScriptSteps([...tempArray]);
    //     }
    // }

    // const handleUpdateStepDescription = (updateInfo) => {
    //     const stepNumber = updateInfo["number"];
    //     const updatedDescription = updateInfo["description"];
    //     let copyOfSteps = testScriptSteps;
    //     let stepToUpdate = copyOfSteps.filter(obj => {
    //         return obj["number"] === stepNumber
    //     });
    //     stepToUpdate = stepToUpdate[0];
    //     let indexOfStepToUpdate = copyOfSteps.indexOf(stepToUpdate);
    //     stepToUpdate["description"] = updatedDescription;
    //     setTestScriptSteps([...copyOfSteps]);
    // }

    // const handleRemoveStep = async (stepInfo) => {
    //     const stepNumber = stepInfo["number"];
    //     let copyOfSteps = testScriptSteps;
    //     copyOfSteps = copyOfSteps.filter(obj => {
    //         return obj["number"] !== stepNumber
    //     });
    //     if (testScriptSteps.length) {
    //         copyOfSteps = await updateStepNumbers(copyOfSteps, stepNumber);
    //     }
    //     console.log(copyOfSteps);
    //     setTestScriptSteps([...copyOfSteps]);
    // }

    // const updateStepNumbers = (listOfSteps, startingStepNumber) => {
    //     console.log("updating steps");
    //     for (let i = startingStepNumber - 1; i < listOfSteps.length; i++) {
    //         listOfSteps[i]["number"]--;
    //     }
    //     return listOfSteps;
    // }

    const handleRequestTestScript = () => { // TODO: make this more direct
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsRequestTestScriptButtonDisabled(true);
            } else {
                // setInvalidTestScriptNameError("Invalid test script name");
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
        // console.log("changing step");
        setCurrentStepNumber(newStepNumber);
        // console.log("finished changing step");
        // resetStepResponseProps.current = true;
        // setRendering(true);
        resetCurrentResponseProps(newStepNumber);
        // handleResetStepResponseProps(newStepNumber);
    }

    const resetCurrentResponseProps = (stepNumber) => {
        setCurrentStepResponseProps(
            stepNumber > stepResponses.length
                ? prev => ({
                    ...prev,
                    stepID: "",
                    comments: "",
                    pass: false
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
            await Axios.post("http://localhost:5000/add-testing-session", {
                testScriptID: testScriptID.current,
                testingSessionTester: { firstName: formProps["testerFirstName"], lastName: formProps["testerLastName"] },
                testingSessionPass: checkIfTestingSessionPassed(),
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

    const checkIfTestingSessionPassed = () => {
        for (let i = 0; i < stepResponses.length; i++) {
            if (!stepResponses[i]["pass"]) {
                return false;
            }
        }
        return true;
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
                            setRendering={setRendering}
                            setIsTestingInProgress={setIsTestingInProgress}
                            // handleChangeStep={handleChangeStep}
                            setCurrentStepResponseProps={setCurrentStepResponseProps}
                            saveStepResponse={handleSaveStepResponse}
                            existingComments={currentStepResponseProps["comments"]}
                            existingPass={currentStepResponseProps["pass"]}
                            stepID={testScriptSteps[currentStepNumber - 1]._id}
                            stepNumber={testScriptSteps[currentStepNumber - 1].number}
                            stepDescription={testScriptSteps[currentStepNumber - 1].description}
                            isLastStep={currentStepNumber === testScriptSteps.length}>
                        </TestStepCard>
                        : <TestingFormCard
                            setFormProps={setFormProps}
                            testScriptName={formProps["testScriptName"]}
                            testScriptDescription={formProps["testScriptDescription"]}
                            testScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                            // testerFirstName={setFormProps}
                            existingTesterFirstName={formProps["testerFirstName"]}
                            // testerLastName={setFormProps}
                            existingTesterLastName={formProps["testerLastName"]}
                            setRendering={setRendering}
                            setIsTestingInProgress={setIsTestingInProgress}
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
                                // testScriptName={handleFormCallback}
                                requestTestScript={handleRequestTestScript}
                                isSubmitButtonDisabled={isRequestTestScriptButtonDisabled}
                                /*textAuthenticationError={invalidTestScriptNameError}*/>
                            </EnterTestScriptNameCard>
                        </div>
                    </div>
                </div>}
            {/* <Fragment>
                {isValidTestScriptNameEntered
                    ? <Fragment>
                        {isTestingInProgress
                            ? <div className="complete-step">
                                <div className="page-message">
                                    Please Complete the Instructions Outlined Below:
                                </div>
                                <div className="complete-step-container">
                                    <div className="complete-step-card">
                                        CARD PLACEHOLDER
                                    </div>
                                </div>
                            </div >
                            : <div className="test-landing-page">
                                <div className="page-message">
                                    Please Fill in the Fields Below:
                                </div>
                                <div className="test-landing-page-container">
                                    <div className="test-landing-page-card">
                                        <TestingForm
                                            testScriptName={formProps["testScriptName"]}
                                            testScriptDescription={formProps["testScriptDescription"]}
                                            testScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                                            testerFirstName={handleFormCallback}
                                            existingTesterFirstName={formProps["testerFirstName"]}
                                            testerLastName={handleFormCallback}
                                            existingTesterLastName={formProps["testerLastName"]}
                                            setIsTestingInProgress={setIsTestingInProgress}
                                            isBeginTestingButtonDisabled={isBeginTestingButtonDisabled}
                                            setIsTestScriptSubmitted={setIsTestScriptSubmitted}
                                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                                            displayFadingBalls={displayFadingBalls}>
                                        </TestingForm>
                                    </div>
                                </div>
                            </div>}
                    </Fragment>
                    : <Fragment>
                        <div className="enter-valid-test-script-name">
                            <div className="enter-valid-test-script-name-container">
                                <div className="page-message">
                                    Retrieve Your Test Script Below:
                                </div>
                                <div className="enter-valid-test-script-name-card">
                                    <EnterTestScriptNameCard
                                        testScriptName={handleFormCallback}
                                        submitted={handleRequestTestScript}
                                        isSubmitButtonDisabled={isRequestTestScriptButtonDisabled}
                                        textAuthenticationError={invalidTestScriptNameError}>
                                    </EnterTestScriptNameCard>
                                </div>
                            </div>
                        </div>
                    </Fragment>}
            </Fragment> */}
        </Fragment >
    )
};

export default TestScriptTestingPage;
