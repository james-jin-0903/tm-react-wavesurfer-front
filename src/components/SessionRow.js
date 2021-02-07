import React from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const secondsToHours = (secs) => {
  return new Date(secs * 1000)
    .toUTCString()
    .match(/(\d\d:\d\d:\d\d)/)[0]
    .replace(/^0/, "");
};

const SessionRow = ({
  "session-key": sessionKey,
  start_time,
  name,
  artist,
  venue,
  promoter_name,
  length,
  outputs,
}) => {
  let history = useHistory();

  const useStyles = makeStyles({
    row: {
      cursor: "pointer",
    },
  });
  const classes = useStyles();

  const handleClick = (sessionKey) => {
    history.push(`/session/${sessionKey}`);
  };

  return (
    <TableRow
      hover
      className={classes.row}
      onClick={() => handleClick(sessionKey)}
    >
      <TableCell>{start_time}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{artist}</TableCell>
      <TableCell>{venue}</TableCell>
      <TableCell>{promoter_name}</TableCell>
      <TableCell>{secondsToHours(length)}</TableCell>
      <TableCell>{(outputs || []).length}</TableCell>
    </TableRow>
  );
};

SessionRow.propTypes = {
  // ['session-key']: PropTypes.string.isRequired,
  start_time: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artist: PropTypes.string,
  venue: PropTypes.string,
  promoter_name: PropTypes.string,
  // length: PropTypes.number,
  outputs: PropTypes.array,
};

export default SessionRow;
