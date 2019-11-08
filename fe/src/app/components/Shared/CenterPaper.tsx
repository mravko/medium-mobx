import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import * as React from "react";
import "./CenterPaper.css";

export default class CenterPaper extends React.Component<{}, {}> {
  public render() {
    return (
      <div style={{ flexGrow: 1, marginTop: "1.125rem" }}>
        <Grid container={true}>
          <Grid item={true} xs={3} />
          <Grid item={true} xs={6}>
            <Paper className="paper-container" elevation={24}>
              {this.props.children}
            </Paper>
          </Grid>
          <Grid item={true} xs={3} />
        </Grid>
      </div>
    );
  }
}
