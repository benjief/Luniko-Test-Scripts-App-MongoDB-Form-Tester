import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import NavBar from '../../../components/Navbar';
import "../../../styles/TestScriptTestingPage.css";

function LoadingWrapper({
    // children,
    rendering,
    transitionElementOpacity,
    transitionElementVisibility,
    // activeError,
    // alert,
    // isValidTestScriptNameEntered,
    // isUserCurrentlyTesting,
}) {
    return (
        <Fragment>
            <div
                className={rendering ? "loading-spinner" : "transition-element"}
                style={{ opacity: rendering ? "100%" : transitionElementOpacity, visibility: rendering ? "visible" : transitionElementVisibility }}>
                {/* {children} */}
            </div >
            <NavBar></NavBar>
        </Fragment>
    )
};

LoadingWrapper.propTypes = {
    // children: PropTypes.node.isRequired,
    rendering: PropTypes.bool,
    transitionElementOpacity: PropTypes.string,
    transitionElementVisibility: PropTypes.string,
};

export default LoadingWrapper;
