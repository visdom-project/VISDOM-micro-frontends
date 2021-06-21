/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";

const ConfigDialog = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {title.button}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
      >
        <DialogTitle id="alert-dialog-title">{title.dialog}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{title.confirm}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ConfigDialog;
