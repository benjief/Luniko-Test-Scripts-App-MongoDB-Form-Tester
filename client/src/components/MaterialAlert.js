import * as React from 'react';
import PropTypes from 'prop-types';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import { Alert } from 'reactstrap';
// import { green } from '@mui/material/colors';

function MaterialAlert({
    vertical,
    horizontal,
    message,
    handleAlertClosed,
    className,
}) {

    // const [open, setOpen] = React.useState(true);

    // const handleClose = () => {
    //     handleAlertClosed();
    //     // setOpen(false);
    // };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleAlertClosed}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                className={className}
                open
                anchorOrigin={{ vertical, horizontal }}
                onClose={handleAlertClosed}
                message={message}
                action={action}
                key={vertical + horizontal}
                autoHideDuration={3000}
            >
            </Snackbar>
        </div>
    );
}

MaterialAlert.propTypes = {
    vertical: PropTypes.string,
    horizontal: PropTypes.string,
    message: PropTypes.string,
    handleAlertClosed: PropTypes.func,
    className: PropTypes.string,
}

MaterialAlert.defaultProps = {
    vertical: "top",
    horizontal: "center",
    message: "",
    handleAlertClosed: () => {},
    className: "success-alert",
}

export default MaterialAlert;
