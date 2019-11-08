import Typography from "@material-ui/core/Typography";
import * as React from "react";
import "./Banner.css";

interface IBannerProps {
  appName: string;
  appSlogan: string;
  token?: string;
}

const Banner: React.SFC<IBannerProps> = ({ appName, appSlogan }) => {
  return (
    <div className="banner">
      <div className="container">
        <Typography color="inherit" gutterBottom={true} align="center">
          {appName.toLowerCase()}
        </Typography>
        <Typography gutterBottom={true} color="inherit" align="center">
          {appSlogan}
        </Typography>
      </div>
    </div>
  );
};

export default Banner;
