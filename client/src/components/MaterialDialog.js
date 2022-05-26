import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function MaterialDialog({
    exteriorButtonText = "",
    interiorButtonText = "",
    dialogTitle = "",
    dialogDescription = ""
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div className="material-dialog-exterior-button-container">
                <Button className="material-dialog-exterior-button" variant="outlined" onClick={handleClickOpen}>
                    <img src={require("../img/exclamation_icon_blue_2.png")} alt="!"></img>
                    {exteriorButtonText}
                </Button>
            </div>
            <Dialog
                className="test"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    {dialogDescription}
                    {/* <DialogContentText id="alert-dialog-description">
                        
                    </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button className="material-dialog-interior-button" onClick={handleClose} autoFocus>
                        {interiorButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
