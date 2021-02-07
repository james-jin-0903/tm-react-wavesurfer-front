import {
  RENDER_SESSIONS,
  SET_SELECTED_SESSION,
  SET_SELECTED_SESSION_AUDIO_URL,
  SELECT_TRACK,
  CREATE_TRACK,
  EDIT_TRACK,
  DELETE_TRACK,
  EDIT_GLOBAL_METADATA,
  CHANGE_OLD_TRACKS,
} from "../actions";
import { Status } from "../shared/enums";

const initialState = {
  sessions: [],
  selectedSessionStatus: Status.ANALYSED,
  selectedSession: null,
  selectedSessionAudioURL: null,
  selectedSessionTracks: [],
  selectedTrack: null,
  oldTrackList: [],
};

const regionColor = alpha => {
  return (
    "rgba(" +
    [
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      alpha || 1,
    ] +
    ")"
  );
};

export default function refMakerApp(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_SESSION:
      let selectedSession = state.sessions.find(
        s => s["session-key"] === action.payload.key
      );
      const metaDataList = action.payload.metaData
        ? action.payload.metaData
        : [];
      let selectedSessionTracks = Object.assign([], selectedSession.outputs);
      let start = 0;

      selectedSessionTracks.forEach((track, i, arr) => {
        let metaData = metaDataList.find(
          row =>
            row.id === `${selectedSession["session-key"]}-${track.audio_file}`
        );
        metaData = metaData ? metaData : {};
        let thisStart = start;
        let thisEnd = start + track.duration;
        start = thisEnd;

        arr[i].start = thisStart;
        arr[i].end = thisEnd;
        arr[i]["resize"] = false;
        arr[i]["drag"] = false;
        arr[i]["regionColor"] = regionColor(0.3);
        arr[i]["editing"] = false;
        arr[i]["collapse"] = false;
        arr[i]["metaTagArtist"] = metaData["metaTagArtist"]
          ? metaData["metaTagArtist"]
          : "";
        arr[i]["metaTagRegion"] = metaData["metaTagRegion"]
          ? metaData["metaTagRegion"]
          : "";
        arr[i]["metaTagTrack"] = metaData["metaTagTrack"]
          ? metaData["metaTagTrack"]
          : "";
        arr[i]["metaTagLabel"] = metaData["metaTagLabel"]
          ? metaData["metaTagLabel"]
          : "";
        arr[i]["metaTagISRC"] = metaData["metaTagISRC"]
          ? metaData["metaTagISRC"]
          : "";
        arr[i]["metaTagReleaseDate"] = metaData["metaTagReleaseDate"]
          ? metaData["metaTagReleaseDate"]
          : "";
        arr[i]["metaTagAdditionalInfo"] = metaData["metaTagAdditionalInfo"]
          ? metaData["metaTagAdditionalInfo"]
          : "";
      });

      return {
        ...state,
        selectedSession,
        selectedSessionTracks,
      };
    case SET_SELECTED_SESSION_AUDIO_URL:
      return {
        ...state,
        selectedSessionAudioURL: action.url,
      };
    case RENDER_SESSIONS:
      let sortedSessionsDesc = action.sessions.sort((s1, s2) => {
        if (s1.process_start_time < s2.process_start_time) {
          return 1;
        }
        return -1;
      });
      return {
        ...state,
        sessions: sortedSessionsDesc,
      };
    case SELECT_TRACK:
      let selectedTrack = state.selectedSessionTracks.find(
        t => t.segment === action.segment
      );
      return {
        ...state,
        selectedTrack,
      };
    case CREATE_TRACK:
      let createdTrack = {
        segment: state.selectedSessionTracks.length + 1,
        start: action.data.start,
        end: action.data.end,
        duration: action.data.duration,
        path: "",
        s3_object: "",
        audio_file: "",
        resize: false,
        drag: false,
        regionColor: regionColor(0.3),
        editing: false,
        collapse: false,
        metaTagArtist: "",
        metaTagRegion: "",
        metaTagTrack: "",
        metaTagLabel: "",
        metaTagISRC: "",
        metaTagReleaseDate: "",
        metaTagAdditionalInfo: "",
      };
      let tempList = [...state.selectedSessionTracks, createdTrack];
      tempList = tempList.sort((a, b) => a.start - b.start);
      tempList.map((row, index) => {
        row.segment = index + 1;
      });
      return {
        ...state,
        selectedSessionTracks: [...tempList],
      };
    case DELETE_TRACK:
      let deleteResult = state.selectedSessionTracks.filter(
        t => t.segment !== action.segment
      );
      deleteResult.map((row, index) => {
        row.segment = index + 1;
      });
      return {
        ...state,
        selectedSessionTracks: [...deleteResult],
      };
    case EDIT_TRACK:
      let editedTrack = state.selectedSessionTracks.find(
        t => t.segment === action.segment.segment
      );
      return {
        ...state,
        selectedSessionTracks: state.selectedSessionTracks.map(t => {
          return t.segment !== action.segment.segment ? t : action.segment;
        }),
      };
    case EDIT_GLOBAL_METADATA:
      return {
        ...state,
        selectedSessionTracks: state.selectedSessionTracks.map(t => {
          t[action.payload.type] = action.payload.value;
          return t;
        }),
      };
    case CHANGE_OLD_TRACKS:
      return {
        ...state,
        oldTrackList: action.tracks,
      };

    default:
      return state;
  }
}
