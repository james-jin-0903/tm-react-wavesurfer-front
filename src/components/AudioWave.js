import React, { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { editTrack, createTrack, deleteTrack } from "../actions";
import { useDispatch } from "react-redux";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const minPxPerSec = 5;

const AudioWave = ({ session, sessionAudioURL, tracks }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const [contextState, setContextState] = useState(initialState);
  const [contextMenuSegment, setContextMenuSegment] = useState(null);
  const playButton = useRef(null);
  const forOutFocusRegion = useRef(null);
  const pauseButton = useRef(null);

  const dispatch = useDispatch();

  const playPause = () => {
    if (waveSurfer) waveSurfer.playPause();
  };

  const createWavesurferInstance = () => {
    if (waveSurfer) return;

    setWaveSurfer(
      WaveSurfer.create({
        container: ".waveform",
        height: 150,
        scrollParent: true,
        normalize: true,
        minimap: true,
        minPxPerSec: minPxPerSec,
        plugins: [
          RegionsPlugin.create(),
          MinimapPlugin.create({
            height: 30,
            waveColor: "#ddd",
            progressColor: "#999",
            cursorColor: "#999",
          }),
          TimelinePlugin.create({
            container: ".waveformTimeLine",
          }),
        ],
      })
    );
  };

  const handleClick = event => {
    event.preventDefault();
    if ("wavesurfer-region" === event.target.className) {
      setContextMenuSegment(Number(event.target.getAttribute("data-id")));
      setContextState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  const handleClose = () => {
    setContextState(initialState);
  };

  const handleLockMenu = () => {
    if (tracks) {
      var lockStatus = false;
      tracks.map(row => {
        if (row.segment === contextMenuSegment) {
          lockStatus = row.drag;
        }
      });
      tracks.forEach(track => {
        if (track.segment === contextMenuSegment) {
          if (!lockStatus) {
            track.resize = true;
            track.drag = true;
          } else {
            track.resize = false;
            track.drag = false;
          }
        }
      });
      let activeSegment = tracks.find(
        row => row.segment === contextMenuSegment
      );
      if (activeSegment) {
        dispatch(editTrack(activeSegment));
      }
      setContextState(initialState);
    }
  };

  const handleRemoveMenu = () => {
    if (contextMenuSegment) {
      dispatch(deleteTrack(contextMenuSegment));
    }
    setContextState(initialState);
  };

  const handleMetaMenu = () => {
    setContextState(initialState);
    tracks.forEach(track => {
      if (track.segment === contextMenuSegment) {
        track["collapse"] = true;
      }
    });
    let openCollapseTrack = tracks.find(
      row => row.segment === contextMenuSegment
    );
    if (openCollapseTrack) {
      dispatch(editTrack(openCollapseTrack));
    }
  };

  const handleMergePrevMenu = () => {
    setContextState(initialState);
    if (contextMenuSegment > 1) {
      let selectedTrack = tracks.find(
        row => row.segment === contextMenuSegment
      );
      let previousTrackSegment = contextMenuSegment - 1;
      let perviousTrack = tracks.find(
        row => row.segment === previousTrackSegment
      );

      selectedTrack.start = perviousTrack.start;
      selectedTrack.end =
        perviousTrack.end > selectedTrack.end
          ? perviousTrack.end
          : selectedTrack.end;
      selectedTrack.duration =
        Math.round(selectedTrack.end) - Math.round(selectedTrack.start);

      dispatch(editTrack(selectedTrack));
      dispatch(deleteTrack(previousTrackSegment));
    }
  };

  const handleMergeNextMenu = () => {
    setContextState(initialState);
    if (contextMenuSegment < tracks.length) {
      let selectedTrack = tracks.find(
        row => row.segment === contextMenuSegment
      );
      let nextTrackSegment = contextMenuSegment + 1;
      let nextTrack = tracks.find(row => row.segment === nextTrackSegment);

      selectedTrack.start = selectedTrack.start;
      selectedTrack.end =
        nextTrack.end > selectedTrack.end ? nextTrack.end : selectedTrack.end;
      selectedTrack.duration =
        Math.round(selectedTrack.end) - Math.round(selectedTrack.start);

      dispatch(editTrack(selectedTrack));
      dispatch(deleteTrack(nextTrackSegment));
    }
  };

  useEffect(() => {
    const loadRegions = () => {
      if (!session) return;
      waveSurfer.clearRegions();

      tracks.forEach((track, index) => {
        let region = {
          id: track.segment,
          start: track.start,
          end: track.end,
          resize: track.resize,
          drag: track.drag,
          color: track.regionColor,
        };
        waveSurfer.addRegion(region);
      });
    };

    if (audioReady) {
      loadRegions();
    }
  }, [tracks, audioReady, session, waveSurfer]);

  useEffect(() => {
    if (!waveSurfer) return;
    waveSurfer.un("region-click");
    waveSurfer.un("region-dblclick");
    waveSurfer.un("region-update-end");
    waveSurfer.un("region-mouseleave");
    waveSurfer.un("seek");

    waveSurfer.on("loading", async loadedProgress => {
      setLoadingProgress(loadedProgress);
    });

    waveSurfer.on("ready", () => {
      waveSurfer.enableDragSelection({
        color: "rgba(100,100,100,0.1)",
      });
      setAudioReady(true);
    });

    waveSurfer.on("region-click", (region, e) => {
      e.stopPropagation();
      waveSurfer.play(region.start + e.offsetX / minPxPerSec);
    });

    waveSurfer.on("seek", position => {
      waveSurfer.play(position * waveSurfer.getDuration());
    });

    waveSurfer.on("region-dblclick", (region, e) => {
      e.stopPropagation();
      let start = region.start - 3 < 0 ? 0 : region.start - 3;
      waveSurfer.play(start, region.end);
    });

    waveSurfer.on("region-mouseleave", (region, e) => {
      forOutFocusRegion.current.click();
    });

    waveSurfer.on("play", () => {
      playButton.current.style.display = "none";
      pauseButton.current.style.display = "";
    });

    waveSurfer.on("region-update-end", region => {
      if (isNaN(region.id)) {
        let newRegion = {
          start: Math.round(region.start),
          end: Math.round(region.end),
          duration: Math.round(region.end) - Math.round(region.start),
        };
        dispatch(createTrack(newRegion));
        return;
      }

      tracks.forEach(track => {
        if (track.segment === region.id) {
          track.start = Math.round(region.start);
          track.end = Math.round(region.end);
          track.duration = Math.round(region.end) - Math.round(region.start);
        }
      });
      let updatedRegion = tracks.find(row => row.segment === region.id);
      dispatch(editTrack(updatedRegion));
    });

    waveSurfer.on("pause", () => {
      playButton.current.style.display = "";
      pauseButton.current.style.display = "none";
    });
  }, [waveSurfer, tracks]);

  useEffect(() => {
    if (!waveSurfer) {
      createWavesurferInstance();
    }
  }, []);

  useEffect(() => {
    if (waveSurfer && sessionAudioURL) {
      waveSurfer.load(sessionAudioURL);
      window.addEventListener("keyup", e => {
        if (e.keyCode === 32 && waveSurfer) {
          waveSurfer.playPause();
        }
      });
    }
  }, [waveSurfer, sessionAudioURL]);

  const useStyles = makeStyles(theme => ({
    timelineContainer: {
      padding: "10px",
    },
    rmButton: {
      marginTop: "20px",
      width: "120px",
    },
    waveformContainer: {
      height: "180px",
    },
    waveformTimelineContainer: {
      height: "20px",
      position: "relative",
    },
    contextMenuTitle: {
      textAlign: "center",
    },
  }));
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper className={classes.timelineContainer} elevation={3}>
        <div
          className={`waveform ${classes.waveformContainer}`}
          onContextMenu={handleClick}
          style={{ cursor: "context-menu" }}
        />
        <div
          className={`waveformTimeLine ${classes.waveformTimelineContainer}`}
        />
      </Paper>
      <Menu
        keepMounted
        open={contextState.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        transitionDuration={0}
        anchorPosition={
          contextState.mouseY !== null && contextState.mouseX !== null
            ? { top: contextState.mouseY, left: contextState.mouseX }
            : undefined
        }
      >
        <h6 className={classes.contextMenuTitle}>
          Segment : {contextMenuSegment}
        </h6>
        <MenuItem onClick={handleLockMenu} key="Unlock/Lock">
          Unlock/Lock
        </MenuItem>
        <MenuItem onClick={handleRemoveMenu} key="Remove">
          Remove
        </MenuItem>
        <MenuItem onClick={handleMetaMenu} key="Add Meta Data">
          Add Meta Data
        </MenuItem>
        {contextMenuSegment > 1 && (
          <MenuItem onClick={handleMergePrevMenu} key="Merge with previous">
            Merge with previous
          </MenuItem>
        )}
        {contextMenuSegment < tracks.length && (
          <MenuItem onClick={handleMergeNextMenu} key="Merge with next">
            Merge with next
          </MenuItem>
        )}
      </Menu>
      {loadingProgress && loadingProgress > 0 && loadingProgress < 100 ? (
        <LinearProgressWithLabel value={loadingProgress} />
      ) : null}
      <div className="col-sm-2" ref={forOutFocusRegion}>
        <Button
          variant="contained"
          className={classes.rmButton}
          onClick={playPause}
          data-action="play"
        >
          <span id="play" className="playButton" ref={playButton}>
            <PlayArrowIcon style={{ color: "white" }} />
            &nbsp;Play
          </span>

          <span
            ref={pauseButton}
            id="pause"
            className="pauseButton"
            style={{ display: "none" }}
          >
            <PauseIcon style={{ color: "white" }} />
            &nbsp;Pause
          </span>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default AudioWave;
