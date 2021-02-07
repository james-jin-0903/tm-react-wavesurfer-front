import { connect } from 'react-redux';
import SessionList from '../components/SessionList';

const mapStateToProps = (state) => {
  return {
    sessions: state.sessions,
  };
};

const SessionListContainer = connect(mapStateToProps)(SessionList);

export default SessionListContainer;
