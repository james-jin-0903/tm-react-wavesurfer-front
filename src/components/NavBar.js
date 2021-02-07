import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

export default function NavBar(props) {
  const session = props.session;
  return (
    <AppBar>
      <Toolbar>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Link to="/">
            <img
              src={require("../assets/logo.png")}
              alt="logo"
              style={{ width: "6rem" }}
            />
          </Link>
          <div>
            {session && (
              <Typography variant="h6">
                {session ? session.artist : "Artist"}
                {" / "} {session ? session.name : "Name"}
                {" / "}
                {session ? session.venue : "Venue"}
              </Typography>
            )}
          </div>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
