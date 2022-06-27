import * as React from 'react';
import { useValidationErrorUpdate } from '../pages/TestScriptTestingPage/Context/ValidationErrorContext';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
function EnterTestScriptNameCard({
    setFormProps,
    requestTestScript,
    isSubmitButtonDisabled,
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate();

    const handleOnChange = (returnedObject) => {
        invalidTestScriptNameError("");
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim() })
        );
    }

    return (
        <Card
            sx={{
                // minWidth: 1,
                // maxWidth: 1,
                minHeight: "150px",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
            }}>
            <div className="load-sheet-name-card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Please enter a valid test script name</strong>}
                />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <MaterialTextField
                            className="test-script-name"
                            label="Test Script Name"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={false}
                            type="text"
                            authenticationField={true}
                            field={"testScriptName"}>
                        </MaterialTextField>
                        <button
                            className="submit-test-script-name-button"
                            onClick={requestTestScript}
                            disabled={isSubmitButtonDisabled}>
                            Submit
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
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
