import * as React from 'react';
import { useValidationErrorUpdate } from '../pages/TestScriptTestingPage/Context/ValidationErrorContext';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';

/**
 * Card that allows users to retrieve test script information from the database by entering a valid test script name. Note that the validity of a test script name is determined by the page that contains this card.
 */
function EnterTestScriptNameCard({
    setFormProps,
    requestTestScript,
    isSubmitButtonDisabled,
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate();

    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered. Note that because we're dealing with test script names here, we need to eliminate any white space from the user-entered string and make it lower case. This allows the string to be properly compared to test script names that already exist in the database on the page containing this card (i.e. all the strings being compared to are lower case and don't contain any outside white space).
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
    const handleOnChange = (returnedObject) => {
        invalidTestScriptNameError("");
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim().toLowerCase() })
        );
    }

    return (
        <div>
            <Card
                sx={{
                    // minWidth: 1,
                    // maxWidth: 1,
                    minHeight: "150px",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>
                <div>
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                        title={<strong>Please enter a valid test script name</strong>}
                    />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <MaterialTextField
                                className="test-script-name"
                                label="Test Script Name"
                                inputValue={handleOnChange}
                                type="text"
                                isAuthenticationField={true}
                                field={"testScriptName"}>
                            </MaterialTextField>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <SubmitButton
                className={"submit-test-script-name-button"}
                isSubmitButtonDisabled={isSubmitButtonDisabled}
                handleOnClick={true}
                handleOnClickFunction={requestTestScript}>
            </SubmitButton>
        </div>
    );
}

EnterTestScriptNameCard.propTypes = {
    setFormProps: PropTypes.func,
    requestTestScript: PropTypes.func,
    isSubmitButtonDisabled: PropTypes.bool,
}

EnterTestScriptNameCard.defaultProps = {
    setFormProps: () => { },
    requestTestScript: () => { },
    isSubmitButtonDisabled: false,
}

export default EnterTestScriptNameCard;
