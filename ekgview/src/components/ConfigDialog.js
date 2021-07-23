/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";


/**
 *
 * @param {title} param0 title.button && title.dialog && title.confirm
 * @returns Dialog
 */
const ConfigDialog = ({ title, children, openDialog, setOpenDialog, showButton=true, fullWitdh=false }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () =>
  {
    setOpen(true);
    if (setOpenDialog) {
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (setOpenDialog) {
      setOpenDialog(false);
    }
  };
  useEffect(() => {
      setOpen(openDialog);
  }, [openDialog]);
  return (
    <div>
      {
        showButton &&
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          {title.button}
        </Button>
      }
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={fullWitdh}
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
