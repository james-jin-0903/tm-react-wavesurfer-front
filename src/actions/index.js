export const SELECT_SESSION = "SELECT_SESSION";
export const SET_SELECTED_SESSION = "SET_SELECTED_SESSION";
export const LOAD_SESSIONS = "LOAD_SESSIONS";
export const RENDER_SESSIONS = "RENDER_SESSIONS";
export const SET_SELECTED_SESSION_AUDIO_URL = "SET_SELECTED_SESSION_AUDIO_URL";
export const SELECT_TRACK = "SELECT_TRACK";
export const EDIT_TRACK = "EDIT_TRACK";
export const CREATE_TRACK = "CREATE_TRACK";
export const DELETE_TRACK = "DELETE_TRACK";
export const EDIT_GLOBAL_METADATA = "EDIT_GLOBAL_METADATA";
export const EDIT_METADATA = "EDIT_METADATA";
export const SET_METADATA_FROM_OLD_SESSION = "SET_METADATA_FROM_OLD_SESSION";
export const SET_OLD_TRACKS = "SET_OLD_TRACKS";
export const CHANGE_OLD_TRACKS = "CHANGE_OLD_TRACKS";
export const CHANGE_METADATA_FROM_OLD_TRACK = "CHANGE_METADATA_FROM_OLD_TRACK";

export function selectSession(key) {
  return {
    type: SELECT_SESSION,
    key,
  };
}

export function loadSessions(status) {
  return {
    type: LOAD_SESSIONS,
    status,
  };
}

export function selectTrack(segment) {
  return {
    type: SELECT_TRACK,
    segment,
  };
}

export function createTrack(data) {
  return {
    type: CREATE_TRACK,
    data,
  };
}

export function deleteTrack(segment) {
  return {
    type: DELETE_TRACK,
    segment,
  };
}

export function editTrack(segment) {
  return {
    type: EDIT_TRACK,
    segment,
  };
}

export function editGlobalMetaData(payload) {
  return {
    type: EDIT_GLOBAL_METADATA,
    payload,
  };
}

export function editMetadata(payload) {
  return {
    type: EDIT_METADATA,
    payload,
  };
}

export function setMetadataFromOldSession(payload) {
  return {
    type: SET_METADATA_FROM_OLD_SESSION,
    payload,
  };
}

export function setOldTracks(payload) {
  return {
    type: SET_OLD_TRACKS,
    payload,
  };
}

export function changeMetaDataFromOldTrack(payload) {
  return {
    type: CHANGE_METADATA_FROM_OLD_TRACK,
    payload,
  };
}
