import React, { useState } from "react";
import { Snackbar, Button, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface AlertPageProps {
  message: string;
  open: boolean;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertPage: React.FunctionComponent<AlertPageProps> = (props) => {
  const { message, open } = props;
  return (
    <Stack>
      <Snackbar open={open} autoHideDuration={1} message={message}>
        <Alert severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default AlertPage;
