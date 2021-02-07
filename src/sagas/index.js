import { call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import {
  LOAD_SESSIONS,
  RENDER_SESSIONS,
  SELECT_SESSION,
  SET_SELECTED_SESSION,
  SET_SELECTED_SESSION_AUDIO_URL,
  EDIT_METADATA,
  EDIT_TRACK,
  EDIT_GLOBAL_METADATA,
  SET_METADATA_FROM_OLD_SESSION,
  SET_OLD_TRACKS,
  CHANGE_OLD_TRACKS,
  CHANGE_METADATA_FROM_OLD_TRACK,
} from "../actions";
import {
  getSessions,
  getSelectedSessionStatus,
  getSelectedSession,
  getSelectedSessionTracks,
  getOldTrackList,
} from "./selectors";
import {
  getSessionsURL,
  getSessionAudioURL,
  getMetaDataURL,
  createOrUpdateMetadata,
  updateGlobalMetadata,
} from "../shared/endpoints";

export function* fetchSessions() {
  let status = yield select(getSelectedSessionStatus);
  const endpoint = getSessionsURL(status.enumKey);
  const response = yield call(fetch, endpoint);
  const data = yield response.json();
  yield put({ type: RENDER_SESSIONS, sessions: data });
}

export function* selectSession(action) {
  const sessions = yield select(getSessions);
  if (!sessions || sessions.length === 0) {
    yield call(fetchSessions);
  }

  // fetch metadata from session id
  const metaDataURL = getMetaDataURL(action.key);
  const response = yield fetch(metaDataURL, {
    method: "GET",
  });
  const metaData = yield response.json();

  const payload = {
    key: action.key,
    metaData: metaData.result,
  };
  yield put({ type: SET_SELECTED_SESSION, payload });
  yield call(fetchSessionAudioURL);
}

export function* fetchSessionAudioURL() {
  const { s3_object } = yield select(getSelectedSession);
  const endpoint = getSessionAudioURL(s3_object);
  const response = yield call(fetch, endpoint);
  const url = yield response.text();
  yield put({ type: SET_SELECTED_SESSION_AUDIO_URL, url });
}

export function* editMetadata(action) {
  const selectedSession = yield select(getSelectedSession);
  const url = createOrUpdateMetadata(
    `${selectedSession["session-key"]}-${action.payload.audio_file}`
  );
  const response = yield fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: `${selectedSession["session-key"]}-${action.payload.audio_file}`,
      sessionId: selectedSession["session-key"],
      metaTagAdditionalInfo: action.payload.metaTagAdditionalInfo,
      metaTagArtist: action.payload.metaTagArtist,
      metaTagISRC: action.payload.metaTagISRC,
      metaTagLabel: action.payload.metaTagLabel,
      metaTagRegion: action.payload.metaTagRegion,
      metaTagReleaseDate: action.payload.metaTagReleaseDate,
      metaTagTrack: action.payload.metaTagTrack,
    }),
  });
  yield put({ type: EDIT_TRACK, segment: action.payload });
}

export function* editGlobalMetaData(action) {
  const selectedSessionTracks = yield select(getSelectedSessionTracks);
  const selectedSession = yield select(getSelectedSession);
  const payload = [];
  selectedSessionTracks.map(row => {
    const temp = {
      id: `${selectedSession["session-key"]}-${row.audio_file}`,
      sessionId: selectedSession["session-key"],
      metaTagAdditionalInfo: row.metaTagAdditionalInfo,
      metaTagArtist: row.metaTagArtist,
      metaTagISRC: row.metaTagISRC,
      metaTagLabel: row.metaTagLabel,
      metaTagRegion: row.metaTagRegion,
      metaTagReleaseDate: row.metaTagReleaseDate,
      metaTagTrack: row.metaTagTrack,
    };
    temp[action.payload.type] = action.payload.value;
    payload.push(temp);
  });
  const response = yield fetch(updateGlobalMetadata, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const result = yield response.json();
}

export function* setMetaDataFromOldSession(action) {
  const selectedSessionTracks = yield select(getSelectedSessionTracks);
  const selectedSession = yield select(getSelectedSession);

  const response = yield fetch(getMetaDataURL(action.payload.oldSession), {
    method: "GET",
  });
  const metaData = yield response.json();

  if (metaData.result) {
    for (let i = 0; i < metaData.result.length; i++) {
      const row = metaData.result[i];
      if (i < selectedSessionTracks.length) {
        const url = createOrUpdateMetadata(
          `${selectedSession["session-key"]}-${selectedSessionTracks[i].audio_file}`
        );
        let temp = {
          id: `${selectedSession["session-key"]}-${selectedSessionTracks[i].audio_file}`,
          sessionId: selectedSession["session-key"],
          metaTagAdditionalInfo: selectedSessionTracks[i].metaTagAdditionalInfo,
          metaTagArtist: selectedSessionTracks[i].metaTagArtist,
          metaTagISRC: selectedSessionTracks[i].metaTagISRC,
          metaTagLabel: selectedSessionTracks[i].metaTagLabel,
          metaTagRegion: selectedSessionTracks[i].metaTagRegion,
          metaTagReleaseDate: selectedSessionTracks[i].metaTagReleaseDate,
          metaTagTrack: selectedSessionTracks[i].metaTagTrack,
        };
        temp[action.payload.oldSessionMetadata] =
          row[action.payload.oldSessionMetadata];
        selectedSessionTracks[i][action.payload.oldSessionMetadata] =
          row[action.payload.oldSessionMetadata];
        const res = yield fetch(url, {
          method: "POST",
          body: JSON.stringify(temp),
        });
        yield put({ type: EDIT_TRACK, segment: selectedSessionTracks });
      }
    }
  }
}

export function* setOldTrackList(action) {
  const response = yield fetch(getMetaDataURL(action.payload), {
    method: "GET",
  });
  const metaData = yield response.json();
  yield put({ type: CHANGE_OLD_TRACKS, tracks: metaData.result });
}

export function* changeMetaDataFromOldTrack(action) {
  const oldTrackList = yield select(getOldTrackList);
  const selectedSession = yield select(getSelectedSession);
  let selectedOldTrack = oldTrackList.find(
    row => row.id === action.payload.oldTrackId
  );
  if (selectedOldTrack) {
    const url = createOrUpdateMetadata(
      `${selectedSession["session-key"]}-${action.payload.currentTrack.audio_file}`
    );
    const response = yield fetch(url, {
      method: "POST",
      body: JSON.stringify({
        ...selectedOldTrack,
        id: `${selectedSession["session-key"]}-${action.payload.currentTrack.audio_file}`,
      }),
    });
    delete selectedOldTrack.id;
    yield put({
      type: EDIT_TRACK,
      segment: {
        ...action.payload.currentTrack,
        ...selectedOldTrack,
      },
    });
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_SESSIONS, fetchSessions);
  yield takeLatest(SELECT_SESSION, selectSession);
  yield takeEvery(EDIT_METADATA, editMetadata);
  yield takeEvery(EDIT_GLOBAL_METADATA, editGlobalMetaData);
  yield takeLatest(SET_METADATA_FROM_OLD_SESSION, setMetaDataFromOldSession);
  yield takeLatest(SET_OLD_TRACKS, setOldTrackList);
  yield takeLatest(CHANGE_METADATA_FROM_OLD_TRACK, changeMetaDataFromOldTrack);
}
