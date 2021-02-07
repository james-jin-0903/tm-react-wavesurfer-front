import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Container from "@material-ui/core/Container";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

import SessionRow from "./SessionRow";
import NavBar from "./NavBar";

const SessionList = ({ sessions }) => {
  const useStyles = makeStyles(theme => ({
    paperClass: {
      marginTop: "20px",
      marginBottom: "20px",
      padding: "10px",
    },
    mt7: {
      marginTop: "7rem",
    },
  }));
  const classes = useStyles();

  return (
    <Container className={classes.mt7}>
      <NavBar />
      <Paper className={classes.paperClass}>
        <h1>Sessions</h1>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Promoter</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Track Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session, index) => (
              <SessionRow key={index} {...session} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SessionList;
