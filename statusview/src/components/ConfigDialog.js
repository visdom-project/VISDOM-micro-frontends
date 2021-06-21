/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";

const ConfigDialog = ({ title, children, openDialog, setOpenDialog }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () =>
  {
    setOpen(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };
  useEffect(() => {
      setOpen(openDialog);
  }, [openDialog]);
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
