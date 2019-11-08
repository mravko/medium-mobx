import * as React from "react";
import * as ReactDOM from "react-dom";
import { configure } from "mobx";
import { createBrowserHistory } from "history";
import {
  Router,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from "react-router-dom";
import { syncHistoryWithStore } from "mobx-react-router";
import { Provider } from "mobx-react";

import articlesStore from "app/stores/articlesStore";
import authStore from "app/stores/authStore";
import commonStore from "app/stores/commonStore";
import editorStore from "app/stores/editorStore";
import profileStore from "app/stores/profileStore";
import userStore from "app/stores/userStore";
import routingStore from "app/stores/routingStore";

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

import Header from "app/components/Header/Header";
import Register from "app/components/Register/Register";
import ArticleDetail from "app/components/Articles/ArticleDetail";
import EditArticle from "app/components/Articles/EditArticle";
import Home from "app/components/Home/Index";
import Login from "app/components/Login/Login";
import Profile from "app/components/Profile/Profile";
import SettingsForm from "app/components/Profile/Settings";
import PrivateRoute from "app/components/Shared/PrivateRoute";

configure({ enforceActions: "observed" }); //modify observables in actions only

const stores = {
  articlesStore,
  authStore,
  commonStore,
  editorStore,
  profileStore,
  userStore,
  routingStore
};

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: "#0097a7",
      light: "#bdbdbd",
      main: "#2196f3"
    }
  }
});

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, stores.routingStore);

// render react DOM
const App = ({ history }) => (
  <Provider {...stores}>
    <Router history={history}>
      <div>
        <MuiThemeProvider theme={theme}>
          <Header />
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/" exact={true} component={Home} />
            <Route
              path="/articles/:id"
              exact={true}
              component={ArticleDetail}
            />
            <Route path="/editor/:slug?" exact={true} component={EditArticle} />
            <Route path="/@:username" component={Profile} />
            <PrivateRoute path="/settings" component={SettingsForm} />
            <Route path="/@:username/favorites" component={Profile} />
          </Switch>
        </MuiThemeProvider>
      </div>
    </Router>
  </Provider>
);

// render react DOM
ReactDOM.render(<App history={history} />, document.getElementById("root"));
