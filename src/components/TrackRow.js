import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Input,
  Box,
  TextField,
  ButtonGroup,
  Button,
  Collapse,
  Select,
  MenuItem,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import {
  editTrack,
  deleteTrack,
  editMetadata,
  setOldTracks,
  changeMetaDataFromOldTrack,
} from "../actions";

const secondsToHours = secs =>
  new Date(secs * 1000)
    .toUTCString()
    .match(/(\d\d:\d\d:\d\d)/)[0]
    .replace(/^0/, "");

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const TrackRow = ({
  start,
  end,
  segment,
  duration,
  drag,
  editing,
  selectTrack,
  metaTagArtist,
  metaTagTrack,
  metaTagLabel,
  metaTagISRC,
  metaTagRegion,
  metaTagReleaseDate,
  metaTagAdditionalInfo,
  collapse,
}) => {
  const dispatch = useDispatch();
  const tracks = useSelector(state => state.selectedSessionTracks);
  const sessionList = useSelector(state => {
    const a = state.sessions;
    // return a.sort(
    //   (a, b) =>
    //     new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    // );
    return a.sort((a, b) => b.session_id - a.session_id);
  });
  const oldTrackList = useSelector(state => state.oldTrackList);
  const [oldSession, setOldSession] = useState("");
  const [oldSessionTrack, setOldSessionTrack] = useState("");
  const [initEditing, setEditingStatus] = useState(editing);
  const [lockStatus, setLockStatus] = useState(drag);
  const [initStart, setInitStart] = useState(start);
  const [initEnd, setInitEnd] = useState(end);
  const [initDuration, setInitDuration] = useState(duration);
  const [collapseOpen, setCollapseOpen] = useState(collapse);
  const [metaArtist, setMetaArtist] = useState(metaTagArtist);
  const [metaTrack, setMetaTrack] = useState(metaTagTrack);
  const [metaLabel, setMetaLabel] = useState(metaTagLabel);
  const [metaISRC, setMetaISRC] = useState(metaTagISRC);
  const [metaRegion, setMetaRegion] = useState(metaTagRegion);
  const [metaReleaseDate, setMetaReleaseDate] = useState(metaTagReleaseDate);
  const [metaAdditionalInfo, setMetaAdditionalInfo] = useState(
    metaTagAdditionalInfo
  );
  const [editedMetadata, setEditedMetadata] = useState(false);

  const handleDeleteTrack = () => {
    dispatch(deleteTrack(segment));
  };
  const handleLockClick = () => {
    tracks.forEach(track => {
      if (track.segment === segment) {
        if (!lockStatus) {
          track.resize = true;
          track.drag = true;
        } else {
          track.resize = false;
          track.drag = false;
        }
      }
    });
    let activeSegment = tracks.find(row => row.segment === segment);
    if (activeSegment) {
      dispatch(editTrack(activeSegment));
    }
  };
  const handleStartChange = e => {
    setInitStart(Math.round(e.target.value));
    setInitDuration(Math.round(initEnd) - Math.round(initStart));
  };
  const handleEndChange = e => {
    setInitEnd(Math.round(e.target.value));
    setInitDuration(Math.round(initEnd) - Math.round(initStart));
  };
  const saveMetaData = () => {
    if (collapseOpen === true) {
      tracks.forEach(track => {
        if (track.segment === segment) {
          track["metaTagArtist"] = metaArtist;
          track["metaTagTrack"] = metaTrack;
          track["metaTagLabel"] = metaLabel;
          track["metaTagISRC"] = metaISRC;
          track["metaTagReleaseDate"] = metaReleaseDate;
          track["metaTagAdditionalInfo"] = metaAdditionalInfo;
          track["metaTagRegion"] = metaRegion;
          track["collapse"] = false;
        }
      });
      let editedTrack = tracks.find(row => row.segment === segment);
      if (editedTrack && editedMetadata === true) {
        dispatch(editMetadata(editedTrack));
      }
      setCollapseOpen(false);
    }
  };
  const openCollapse = () => {
    setCollapseOpen(true);
    tracks.forEach(track => {
      if (track.segment === segment) {
        track["collapse"] = true;
      }
    });
    let openCollapseTrack = tracks.find(row => row.segment === segment);
    if (openCollapseTrack) {
      dispatch(editTrack(openCollapseTrack));
    }
  };

  const changeOldTrackList = e => {
    setOldSession(e.target.value);
    dispatch(setOldTracks(e.target.value));
  };
  const addMetadataFromOldTrack = () => {
    if (oldSessionTrack !== "" && oldSession !== "") {
      const editedTrack = tracks.find(row => row.segment === segment);
      dispatch(
        changeMetaDataFromOldTrack({
          oldTrackId: oldSessionTrack,
          currentTrack: editedTrack,
        })
      );
    }
  };

  const onArtistChange = e => {
    setEditedMetadata(true);
    setMetaArtist(e.target.value);
  };
  const onTrackChange = e => {
    setEditedMetadata(true);
    setMetaTrack(e.target.value);
  };
  const onLabelChange = e => {
    setEditedMetadata(true);
    setMetaLabel(e.target.value);
  };
  const onISRCChange = e => {
    setEditedMetadata(true);
    setMetaISRC(e.target.value);
  };
  const onReleaseDateChange = e => {
    setEditedMetadata(true);
    setMetaReleaseDate(e.target.value);
  };
  const onAdditionalInfoChange = e => {
    setEditedMetadata(true);
    setMetaAdditionalInfo(e.target.value);
  };
  const onRegionChange = e => {
    setEditedMetadata(true);
    setMetaRegion(e.target.value);
  };

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>{segment}</TableCell>
        {!initEditing && (
          <>
            <TableCell>{secondsToHours(start)}</TableCell>
            <TableCell>{secondsToHours(end)}</TableCell>
          </>
        )}
        {initEditing && (
          <>
            <TableCell>
              <Input
                id="standard-basic"
                onChange={handleStartChange}
                value={initStart}
                type="number"
              />
            </TableCell>
            <TableCell>
              <Input
                id="standard-basic"
                onChange={handleEndChange}
                value={initEnd}
                type="number"
              />
            </TableCell>
          </>
        )}

        <TableCell>{metaArtist}</TableCell>
        <TableCell>{metaTrack}</TableCell>
        <TableCell>{secondsToHours(initDuration)}</TableCell>
        <TableCell>
          <div className="btn-group">
            {!lockStatus ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleLockClick}
              >
                Unlock
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleLockClick}
              >
                Lock
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleDeleteTrack}
            >
              Remove
            </Button>
            <ButtonGroup
              orientation="vertical"
              color="primary"
              aria-label="vertical contained primary button group"
              style={{ height: "34px" }}
              variant="contained"
              color="primary"
            >
              <Button
                style={{ height: "17px" }}
                onClick={() => {
                  saveMetaData();
                }}
              >
                <ExpandLessIcon style={{ height: "17px" }} />
              </Button>
              <Button style={{ height: "17px" }} onClick={openCollapse}>
                <ExpandMoreIcon style={{ height: "17px" }} />
              </Button>
            </ButtonGroup>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div>
                <Select
                  displayEmpty
                  label="Session List"
                  value={oldSession}
                  onChange={e => changeOldTrackList(e)}
                  input={<Input />}
                  MenuProps={MenuProps}
                  inputProps={{ "aria-label": "Without label" }}
                  style={{ width: "15rem", marginTop: "1.2rem" }}
                >
                  <MenuItem disabled value="">
                    <em>Select Session</em>
                  </MenuItem>
                  {sessionList.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item["session-key"]}
                      style={{
                        fontWeight:
                          item["session-key"] === oldSession ? "bold" : "",
                      }}
                    >
                      {item["name"]}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  displayEmpty
                  label="Track"
                  value={oldSessionTrack}
                  onChange={e => setOldSessionTrack(e.target.value)}
                  input={<Input />}
                  MenuProps={MenuProps}
                  inputProps={{ "aria-label": "Without label" }}
                  style={{ width: "15rem", margin: "1.2rem 1rem 0 1rem" }}
                >
                  <MenuItem disabled value="">
                    <em>Select Track</em>
                  </MenuItem>
                  {oldTrackList.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item.id}
                      style={{
                        fontWeight: item.id === oldSessionTrack ? "bold" : "",
                      }}
                    >
                      {`${index + 1}: ${item.metaTagArtist}`}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={addMetadataFromOldTrack}
                >
                  Add
                </Button>
              </div>
              <div>
                <TextField
                  label="Artist"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaArtist}
                  onChange={onArtistChange}
                />
                <TextField
                  label="Track"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaTrack}
                  onChange={onTrackChange}
                />
                <TextField
                  label="Label"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaLabel}
                  onChange={onLabelChange}
                />
                <TextField
                  label="ISRC"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaISRC}
                  onChange={onISRCChange}
                />
                <TextField
                  label="Release Date"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaReleaseDate}
                  onChange={onReleaseDateChange}
                />
                <TextField
                  label="Additional Info"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaAdditionalInfo}
                  onChange={onAdditionalInfoChange}
                />
                <TextField
                  label="Region"
                  style={{ margin: "0.7rem 0.4rem" }}
                  value={metaRegion}
                  onChange={onRegionChange}
                />
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TrackRow;
