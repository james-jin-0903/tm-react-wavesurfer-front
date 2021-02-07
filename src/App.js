import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "fontsource-roboto";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
// import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import SessionListContainer from "./containers/SessionListContainer";
import SessionContainer from "./containers/SessionContainer";

function App() {
  return (
    <Router>
      <Container>
        <Row className="row">
          <Col xs={12}>
            <Switch>
              <Route exact path="/">
                <SessionListContainer />
              </Route>
              <Route path="/session/:key">
                <SessionContainer />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
