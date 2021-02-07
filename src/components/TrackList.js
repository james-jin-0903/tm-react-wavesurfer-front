import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";
import TrackRow from "./TrackRow";

const TrackList = ({ tracks, selectTrack }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Track</TableCell>
            <TableCell>Length</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks
            ? tracks.map((track, index) => {
                return (
                  <TrackRow
                    key={index}
                    {...track}
                    start={track.start}
                    end={track.end}
                    selectTrack={selectTrack}
                  />
                );
              })
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TrackList;
