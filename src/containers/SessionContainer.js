import { connect } from 'react-redux';
import Session from '../components/Session';
import { selectSession, selectTrack } from '../actions/index';

const mapStateToProps = (state) => {
  return {
    session: state.selectedSession,
    sessionAudioURL: state.selectedSessionAudioURL,
    tracks: state.selectedSessionTracks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectTrack: (segment) => {
      dispatch(selectTrack(segment));
    },
    selectSession: (key) => {
      dispatch(selectSession(key));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Session);
