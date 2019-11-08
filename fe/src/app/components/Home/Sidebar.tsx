import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

import TagChips from "../Shared/TagChips";
import "./Sidebar.css";

interface ITagsProps extends RouteComponentProps<{}> {
  tags: string[];
}

const Tags: React.SFC<ITagsProps> = props => {
  const { tags } = props;
  const onClickTag = (tag: string) => {
    props.history.push({
      search: `?tab=tag&tag=${tag}`
    });
  };

  if (tags) {
    return (
      <Grid item={true} style={{ marginTop: "1rem", padding: "0 1rem" }} md={2}>
        <Paper>
          <Typography
            gutterBottom={true}
            color="inherit"
            component="h1"
            align="center"
          >
            Popular tags
          </Typography>
          <div className="tag-container">
            <TagChips onClick={onClickTag} tags={tags} />
          </div>
        </Paper>
      </Grid>
    );
  } else {
    return <CircularProgress size={25} />;
  }
};

export default withRouter(Tags);
