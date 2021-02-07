import React from "react";
import TextField from "@material-ui/core/TextField";

const TrackDetail = ({ track }) => {
  return (
    <>
      <div>Track Detail</div>
      {track ? (
        <>
          <div>
            <TextField
              id="standard-basic"
              label="Track No"
              InputProps={{
                readOnly: true,
              }}
              value={track.segment}
            />

            <TextField
              id="standard-basic"
              label="Duration"
              InputProps={{
                readOnly: true,
              }}
              value={track.duration}
            />
          </div>
          <div>
            <TextField id="outlined-basic" label="Artist" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" label="Track" variant="outlined" />
          </div>
        </>
      ) : (
        <div>
          <h3>Please select a track.</h3>
        </div>
      )}
    </>
  );
};

export default TrackDetail;
