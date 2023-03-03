import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { formatTimestamp, getTimestamp, inOrOut } from "../utils/Constants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#B1BCE9",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    fonFamily: "Poppins",
    fontWeight: 400,
    fontStyle: "bold",
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface AttendanceTableProps {
  attendance: any[];
}

const AttendanceTable: React.FunctionComponent<AttendanceTableProps> = (
  props
) => {
  const { attendance } = props;

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table sx={{ width: "100%" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">ID number</StyledTableCell>
            <StyledTableCell align="right">Time</StyledTableCell>
            <StyledTableCell align="right">IN / OUT</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.length > 0 ? (
            attendance.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.student.firstName} {row.student.middleName}{" "}
                  {row.student.lastName}
                </StyledTableCell>
                <StyledTableCell align="right">{row.studentID}</StyledTableCell>
                <StyledTableCell align="right">
                  {formatTimestamp(row.timestamp)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {inOrOut(row.inSchool)}
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableCell align="center" colSpan={4}>
              No Attendance Yet
            </StyledTableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
