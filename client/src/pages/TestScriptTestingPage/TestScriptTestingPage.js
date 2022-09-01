import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "./Context/ValidationErrorContext";
import Axios from "axios";
import { uploadStepResponseImage } from "../../firebase/config";
import { v4 as uuidv4 } from "uuid";
import LoadingWrapper from "./wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "./wrappers/AlertWrapper";
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

/**
 * This page allows users to test test scripts by going through and creating responses for steps associated with test scripts in the database.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
function TestScriptTestingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isRequestTestScriptButtonDisabled, setIsRequestTestScriptButtonDisabled] = useState(true);
    const [isBeginTestingButtonDisabled, setIsBeginTestingButtonDisabled] = useState(true);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [isCancelButtonDisabled, setIsCancelButtonDisabled] = useState(false);
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
        pass: "P",
        uploadedImage: null,
    });
    const allFailedSteps = useRef([]);
    const stepsWithMinorIssues = useRef([]);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const successAlertMessage = useRef("Test script results successfully submitted!");
    const alertType = useRef("success-alert");
    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [areTestScriptResultsSubmitted, setAreTestScriptResultsSubmitted] = useState(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = "Apologies! We've encountered an error. Please attempt to re-submit your test script results.";

    /** 
     * Displays an alert with the correct type of error. 
     * @param {string} errorType 
    */
    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? successAlertMessage.current = loadErrorMessage // read error message
            : successAlertMessage.current = writeErrorMessage; // write error message

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);
    }, [alertType, rendering]);

    /**
     * Closes an alert that is on display and redirects the user to the app homepage. 
     */
    const handleAlertClosed = () => {
        console.log("closing alert");
        window.location.reload();
        setIsErrorThrown(false);
    }

    useEffect(() => {
        /**
         * Calls functions that gather information required for the initial page load. Once all required information is gathered, rendering is set to false and the page is displayed.
         */
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchAndWriteTestScriptNamesAlreadyInDB();
            setRendering(false);
        }

        const fetchAndWriteTestScriptNamesAlreadyInDB = async () => {
            try {
                async.current = true;
                await Axios.get("https://test-scripts-app-tester.herokuapp.com/get-test-script-names", {
                    timeout: 5000
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name_lowercase }) => name_lowercase);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        /**
         * Calls functions that fetch and write information required for displaying the steps associated with a test script.
         * @param {string} testScriptName - the test script name corresponding to the test script for which information is being fetched.
         */
        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchTestScriptInformation(testScriptName);
            await fetchAndWriteTestScriptSteps(testScriptID.current);
            setRendering(false);
        }

        /**
         * Fetches test script information from the database.
         * @param {string} testScriptName - the test script name corresponding to the test script for which information is being fetched.
         */
        const fetchTestScriptInformation = async (testScriptName) => {
            try {
                async.current = true;
                await Axios.get(`https://test-scripts-app-tester.herokuapp.com/get-test-script/${testScriptName}`, {
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

        /**
         * Writes test script information to formProps, in addition to writing the loaded test script's ID to the testScriptID prop.
         * @param {object} testScriptInformation - test script information object returned by Axios from the database.
         */
        const populateTestScriptInformation = (testScriptInformation) => {
            if (testScriptInformation) {
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
            } else {
                handleError("r");
            }
        }

        /**
         * Fetches steps associated with the currently-loaded test script from the database and writes them to testScriptSteps.
         * @param {string} testScriptID - ID of the currently-loaded test script.
         */
        const fetchAndWriteTestScriptSteps = async (testScriptID) => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://test-scripts-app-tester.herokuapp.com/get-test-script-steps/${testScriptID}`, {
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
            // runs fetch/write functions, depending on the page's state
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
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsRequestTestScriptButtonDisabled(false) : setIsRequestTestScriptButtonDisabled(true);
            } else {
                if (!areTestScriptResultsSubmitted) {
                    (formProps["testerFirstName"].trim() !== "" && formProps["testerLastName"].trim() !== "" && testScriptSteps.length)
                        ? setIsBeginTestingButtonDisabled(false) : setIsBeginTestingButtonDisabled(true);
                    stepResponses.length ? setIsSubmitButtonDisabled(false) : setIsSubmitButtonDisabled(true);
                }
            }
        }
    }, [rendering, isDataBeingFetched, cardChanged, formProps, testScriptSteps, isValidTestScriptNameEntered, isTestingInProgress, areTestScriptResultsSubmitted, stepResponses, stepChanged, handleError]);

    /**
     * Handles the card change when a user flips back and forth between completing steps and other test script information. A brief period of rendering is forced in between each card to make the application appear more consistent.
     */
    const handleChangeCard = () => {
        setRendering(true);
        cardChanged.current = true;
        isTestingInProgress ? setIsTestingInProgress(false) : setIsTestingInProgress(true);
    }

    /**
     * When the user requests a test script name that has previously been written to the database, that test script name is validated (through a call to validateTestScriptNameEntered). If the test script name entered is indeed valid, setValidTestScriptName is set to true, as is rendering, and the "request test script" button is disabled. Then, the useEffect hook carries out secondary read async functions to fetch/write all of the necessary test script information to the page. If the test script name entered isn't valid, an error message is displayed. 
     */
    const handleRequestTestScript = () => {
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
    /**
     * Compares the test script name entered by the user to test script names obtained by the page's primary read functions. If the entered test script name is matched against the set of valid test script names, the function returns true. If not, it returns false.
     * @returns true if the entered test script name is matched against the set of valid test script names, false otherwise.
     */
    const validateTestScriptNameEntered = () => {
        for (let i = 0; i < testScriptNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["testScriptName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(testScriptNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Saves a step response to stepResponses when the user navigates away from that step (by changing steps or switching to the main testing card). If the step response already exists in stepResponses, it will be overwritten with the current information (regardless of whether or not anything has been updated). If the step response doesn't already exist in stepResponses, it will be added to the array. 
     * @param {number} newStepNumber - the number of the step to which the user has moved (will not change if the user switches cards vs. moving to the previous or next step).
     */
    const handleSaveStepResponse = (newStepNumber) => {
        let copyOfCurrentStepResponseProps = currentStepResponseProps;
        copyOfCurrentStepResponseProps["stepID"] = testScriptSteps[currentStepNumber - 1]._id; // copies the current step response props (index of this response will be the current step number less one)
        setStepResponses(prev => {
            let copyOfStepResponses = prev;
            if (currentStepNumber > stepResponses.length) {
                copyOfStepResponses.push(copyOfCurrentStepResponseProps); // add the step response to copyOfStepResponses, because it doesn't yet exist there
            } else {
                copyOfStepResponses[currentStepNumber - 1] = currentStepResponseProps; // overwrite the step response that already exists
            }
            return copyOfStepResponses;
        })
        if (newStepNumber !== currentStepNumber) {
            handleChangeStep(newStepNumber);
            setRendering(true);
        }
    }

    /**
     * Changes the current step number with setCurrentStepNumber. A call to resetCurrentResponseProps ensures the new step response information is loaded.
     * @param {number} newStepNumber 
     */
    const handleChangeStep = (newStepNumber) => {
        setCurrentStepNumber(newStepNumber);
        resetCurrentResponseProps(newStepNumber);
    }

    /**
     * Loads step response information with setCurrentResponseProps. If a step response doesn't exist for the current step, a default template is used; otherwise, response props are pulled from the stepResponses array. 
     * @param {number} stepNumber - the number of the step for which response props are to be loaded.
     */
    const resetCurrentResponseProps = (stepNumber) => {
        setCurrentStepResponseProps(
            stepNumber > stepResponses.length
                ? prev => ({
                    ...prev,
                    stepID: "",
                    comments: "",
                    pass: "P",
                    uploadedImage: null,
                })
                : stepResponses[stepNumber - 1]
        );
        stepChanged.current = true;
    }

    /**
     * When the user clicks on the submit button, the areTestScriptResultsSubmitted prop is set to true, and said button is disabled, along with the "begin testing" and cancel buttons (to prevent multiple submission clicks). A set of fading balls is then displayed (to indicate that the page is working on a request), and the page's write functions are triggered through runWriteAysncFunctions.
     */
    const handleSubmitTestScriptResults = () => {
        setAreTestScriptResultsSubmitted(true);
        setIsBeginTestingButtonDisabled(true);
        setIsSubmitButtonDisabled(true);
        setIsCancelButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    /**
     * Runs functions that write the user's testing session results to the database. An alert is displayed once this process is complete.
     */
    const runWriteAsyncFunctions = async () => {
        await addTestingSessionResultsToDB();
        console.log("setting alert to true")
        setAlert(true);
    }

    /**
     * Creates a new record by writing the submitted testing session information to the database. Calls to identifyProblematicSteps and uploadStepResponseImages ensure that a) any step responses marked as "fail" or "pass with minor issues" by the user during testing are flagged, and that b) any images attached to step responses by the user during testing are uploaded to Google Firebase Cloud Storage.
     */
    const addTestingSessionResultsToDB = async () => {
        async.current = true;
        try {
            identifyAndStoreProblematicSteps();
            await uploadStepResponseImages();
            await Axios.post("https://test-scripts-app-tester.herokuapp.com/add-testing-session", {
                testScriptID: testScriptID.current,
                testingSessionTester: { firstName: formProps["testerFirstName"], lastName: formProps["testerLastName"] },
                testingSessionPass: allFailedSteps.current.length ? false : true,
                testingSessionComplete: !(stepResponses.length < testScriptSteps.length),
                testingSessionStoppedAt: currentStepNumber,
                testingSessionFailedSteps: allFailedSteps.current,
                testingSessionStepsWithMinorIssues: stepsWithMinorIssues.current,
                testingSessionStepResponses: stepResponses,
            }, { timeout: 5000 })
                .then(res => {
                    // console.log(res);
                    async.current = false;
                    // console.log("test script results written to DB");
                })
        } catch (e) {
            console.log(e);
            handleError("w");
        }
    }

    /**
     * Identifies any step responses marked as "fail" or "pass with minor issues" by the user during testing and stores them in allFailedSteps and stepsWithMinorIssues, respectively. These arrays used on the server side of the application to store important information about problematic steps for test script creators to later view.
     */
    const identifyAndStoreProblematicSteps = () => {
        let allFailedStepsTemp = [];
        let stepsWithMinorIssuesTemp = [];
        for (let i = 0; i < stepResponses.length; i++) {
            if (stepResponses[i].pass === "F") {
                allFailedStepsTemp.push(i + 1);
            } else if (stepResponses[i].pass === "I") {
                stepsWithMinorIssuesTemp.push(i + 1);
            }
        }
        allFailedSteps.current = allFailedStepsTemp;
        stepsWithMinorIssues.current = stepsWithMinorIssuesTemp;
    }

    /**
     * Handles the uploading of any images attached to step responses by the user during testing to Google Firebase Cloud Storage with a call to uploadStepResponseImage. This function is responsible for piecing together a proper image name. Note that images are assigned a unique ID (using uuidv4) that does NOT correspond to the testing session ID that is eventually stored in the database. This is because images are uploaded before a testing session ID is assigned server side. Unfortunately, I haven't been able to successfully transfer image data to the server, and so at the moment, this is the best I can do.
     */
    const uploadStepResponseImages = async () => {
        // console.log("uploading step response images");
        const uniqueSessionIDForImages = uuidv4();
        for (let i = 0; i < stepResponses.length; i++) {
            if (stepResponses[i]["uploadedImage"]) {
                const image = stepResponses[i]["uploadedImage"];
                const imageType = image["type"].split("/").pop();
                const imageName = uniqueSessionIDForImages + "_" + (i + 1) + "." + imageType;
                const uploadedImageURL = await uploadStepResponseImage(imageName, image);
                stepResponses[i]["uploadedImage"] = uploadedImageURL === "e" ? null : { imageName: imageName, imageURL: uploadedImageURL };
            } /* else {
                stepResponses[i]["uploadedImage"] = "";
            } */
        }
    }

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transtitionElementVisibility}>
            </LoadingWrapper>
            <AlertWrapper
                alert={alert}
                alertMessage={successAlertMessage.current}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}> {/* TODO: change alertType hook to useState? */}
            </AlertWrapper>
            {isValidTestScriptNameEntered
                ? <CardWrapper
                    rendering={rendering}
                    alert={alert}
                    isErrorThrown={isErrorThrown}
                    isTestingInProgress={isTestingInProgress}>
                    {isTestingInProgress
                        ? <TestStepCard
                            goBackToTestingLandingPage={handleChangeCard}
                            setCurrentStepResponseProps={setCurrentStepResponseProps}
                            saveStepResponse={handleSaveStepResponse}
                            existingComments={currentStepResponseProps["comments"]}
                            existingPass={currentStepResponseProps["pass"]}
                            existingUploadedImage={currentStepResponseProps["uploadedImage"]}
                            stepID={testScriptSteps[currentStepNumber - 1]._id}
                            stepNumber={testScriptSteps[currentStepNumber - 1].number}
                            stepDescription={testScriptSteps[currentStepNumber - 1].description}
                            stepDataInputtedByUser={testScriptSteps[currentStepNumber - 1].dataInputtedByUser}
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
                            isCancelButtonDisabled={isCancelButtonDisabled}
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
