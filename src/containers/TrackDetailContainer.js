import { connect } from 'react-redux';
import TrackDetail from '../components/TrackDetail';
// import { selectSession } from '../actions/index';

const mapStateToProps = (state) => {
  return {
    track: state.selectedTrack,
  };
};

/*
const mapDispatchToProps = (dispatch) => {
  return {
    selectSession: (key) => {
      dispatch(selectSession(key));
    },
  };
};
*/

// export default connect(mapStateToProps, mapDispatchToProps)(Session);
export default connect(mapStateToProps)(TrackDetail);
