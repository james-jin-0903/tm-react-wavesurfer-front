import React, { useEffect, useState } from "react";
import {
  TableRow,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  Paper,
} from "@material-ui/core";

const SessionDetail = session => {
  const [sessoinDetail, setSessionDetail] = useState([]);
  useEffect(() => {
    if (session.session) {
      var temp = [];
      Object.keys(session.session).map(row => {
        switch (row) {
          case "name":
            temp.push(["Name", session.session["name"]]);
            break;
          case "artist":
            temp.push(["Artist", session.session["artist"]]);
            break;
          case "venue":
            temp.push(["Venue", session.session["venue"]]);
            break;
          case "start_time":
            temp.push(["Start Time", session.session["start_time"]]);
            break;
          case "end_time":
            temp.push(["End Time", session.session["end_time"]]);
            break;
          case "promoter_name":
            temp.push(["Promoter Name", session.session["promoter_name"]]);
            break;
          case "length":
            temp.push(["Length", session.session["length"]]);
            break;
        }
      });
      setSessionDetail(temp);
    }
  }, [session]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {sessoinDetail.map((row, index) => {
            return (
              <TableRow hover key={index}>
                <TableCell>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionDetail;
