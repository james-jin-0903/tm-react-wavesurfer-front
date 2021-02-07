import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  Input,
  Box,
  Button,
  Collapse,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { editGlobalMetaData, setMetadataFromOldSession } from "../actions";

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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};
const a11yProps = index => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginTop: "1rem",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const itemList = [
  { text: "Artist", type: "metaTagArtist" },
  { text: "Track", type: "metaTagTrack" },
  { text: "Label", type: "metaTagLabel" },
  { text: "ISRC", type: "metaTagISRC" },
  { text: "Release Date", type: "metaTagReleaseDate" },
  { text: "Additional Info", type: "metaTagAdditionalInfo" },
  { text: "Region", type: "metaTagRegion" },
];

const GlobalMetaDataSection = tracks => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [globalMetadataType, setGlobalMetadataType] = useState("");
  const [globalMetadata, setGlobalMetadata] = useState("");
  const [oldSession, setOldSession] = useState("");
  const [oldSessionMetadata, setOldSessionMetadata] = useState("");
  const sessionList = useSelector(state => {
    const a = state.sessions;
    // return a.sort(
    //   (a, b) =>
    //     new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    // );
    return a.sort((a, b) => b.session_id - a.session_id);
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAddClick = () => {
    if (globalMetadataType !== "" && globalMetadata !== "") {
      dispatch(
        editGlobalMetaData({ type: globalMetadataType, value: globalMetadata })
      );
    }
  };
  const addOldSessionMetadata = () => {
    dispatch(setMetadataFromOldSession({ oldSessionMetadata, oldSession }));
  };

  useEffect(() => {
    if (!collapseOpen) {
      setGlobalMetadataType("");
      setGlobalMetadata("");
    }
  }, [collapseOpen]);
  useEffect(() => {
    setGlobalMetadata("");
  }, [globalMetadataType]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Global MetaData"
        >
          <Tab
            label="Global MetaData"
            {...a11yProps(0)}
            onClick={() => {
              if (value === 0) {
                setCollapseOpen(!collapseOpen);
              } else {
                setCollapseOpen(true);
              }
            }}
          />
          <Tab
            label="Tools"
            {...a11yProps(1)}
            onClick={() => {
              if (value === 1) {
                setCollapseOpen(!collapseOpen);
              } else {
                setCollapseOpen(true);
              }
            }}
          />
        </Tabs>
      </AppBar>

      {/* set global metadata */}
      <TabPanel value={value} index={0}>
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <Select
            displayEmpty
            label="Metadata Type"
            value={globalMetadataType}
            onChange={e => {
              setGlobalMetadataType(e.target.value);
            }}
            input={<Input />}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
            style={{ width: "15rem", marginTop: "1.2rem" }}
          >
            <MenuItem disabled value="">
              <em>Select Global Metadata</em>
            </MenuItem>
            {itemList.map((item, index) => (
              <MenuItem
                key={index}
                value={item.type}
                style={{
                  fontWeight: item.type === globalMetadataType ? "bold" : "",
                }}
              >
                {item.text}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="MetaData"
            style={{ margin: "0.2rem 0.4rem" }}
            value={globalMetadata}
            onChange={e => {
              setGlobalMetadata(e.target.value);
            }}
          />
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleAddClick}
          >
            Add
          </Button>
        </Collapse>
      </TabPanel>

      {/* set matadata from old session */}
      <TabPanel value={value} index={1}>
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <Select
            displayEmpty
            label="Session List"
            value={oldSession}
            onChange={e => {
              setOldSession(e.target.value);
            }}
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
                  fontWeight: item["session-key"] === oldSession ? "bold" : "",
                }}
              >
                {item["name"]}
              </MenuItem>
            ))}
          </Select>
          <Select
            displayEmpty
            label="Metadata Type"
            value={oldSessionMetadata}
            onChange={e => {
              setOldSessionMetadata(e.target.value);
            }}
            input={<Input />}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
            style={{ width: "15rem", margin: "1.2rem 1rem 0 1rem" }}
          >
            <MenuItem disabled value="">
              <em>Select Global Metadata</em>
            </MenuItem>
            {itemList.map((item, index) => (
              <MenuItem
                key={index}
                value={item.type}
                style={{
                  fontWeight: item.type === oldSessionMetadata ? "bold" : "",
                }}
              >
                {item.text}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={addOldSessionMetadata}
          >
            Add
          </Button>
        </Collapse>
      </TabPanel>
    </div>
  );
};

export default GlobalMetaDataSection;
