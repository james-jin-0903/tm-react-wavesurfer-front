import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import AudioWave from "./AudioWave";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TrackList from "./TrackList";
import GlobalMetaDataSection from "./GlobalMetaDataSection";
import SessionDetail from "./SessionDetail";
import NavBar from "./NavBar";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

const Session = ({
  session,
  selectSession,
  sessionAudioURL,
  tracks,
  selectTrack,
}) => {
  const [tabValue, setTabValue] = useState(0);

  let { key } = useParams();

  useEffect(() => {
    selectSession(key);
  }, [selectSession, key]);

  const useStyles = makeStyles(theme => ({
    tabContainer: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      marginTop: "20px",
    },
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

  const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {/*<Typography>{children}</Typography>*/}
            {children}
          </Box>
        )}
      </div>
    );
  };

  const a11yProps = index => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container className={classes.mt7}>
      <NavBar {...{ session }} />
      <Paper className={classes.paperClass}>
        <h2>{session ? session.name : "Unknown"}</h2>
        <h6>SessionID: {session ? session["session-key"] : "Unknown"}</h6>
      </Paper>

      <AudioWave {...{ session, sessionAudioURL, tracks, selectTrack }} />
      <GlobalMetaDataSection tracks={tracks} />
      <div className={classes.tabContainer}>
        <AppBar position="static">
          <Tabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="simple tabs example"
          >
            <Tab label="Tracks" {...a11yProps(0)} />
            <Tab label="Session Info" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
          {session && tracks ? (
            <TrackList tracks={tracks} selectTrack={selectTrack} />
          ) : null}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <SessionDetail {...{ session }} />
        </TabPanel>
      </div>
    </Container>
  );
};

export default Session;
