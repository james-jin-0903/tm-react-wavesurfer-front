export const stage = "test";

export const getSessionsURL = status =>
  `https://4udw2uaqc6.execute-api.us-east-1.amazonaws.com/${stage}/sessions/status/${status}`;

export const getSessionAudioURL = objectKey =>
  `https://4udw2uaqc6.execute-api.us-east-1.amazonaws.com/${stage}/session/audio/${encodeURIComponent(
    objectKey
  )}`;

// new AWS
export const getMetaDataURL = sessionId =>
  `https://73h7x8frne.execute-api.us-east-1.amazonaws.com/${stage}/metadata/${sessionId}`;

export const createOrUpdateMetadata = id =>
  `https://73h7x8frne.execute-api.us-east-1.amazonaws.com/${stage}/metadata/${id}`;

export const updateGlobalMetadata =
  `https://73h7x8frne.execute-api.us-east-1.amazonaws.com/${stage}/metadata-update-global`;
