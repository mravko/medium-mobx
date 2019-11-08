import Grid from "@material-ui/core/Grid";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { inject, observer } from "mobx-react";
import { parse as qsParse } from "query-string";
import * as React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ArticlesStore, IPredicate } from "../../stores/articlesStore";
import { UserStore } from "../../stores/userStore";
import ArticleList from "../Articles/ArticleList";

export interface InjectedMainViewProps extends RouteComponentProps<{}> {
  userStore: UserStore;
  articlesStore: ArticlesStore;
}

@inject("userStore", "articlesStore")
@observer
class MainView extends React.Component<InjectedMainViewProps> {
  constructor(props) {
    super(props);

    props.articlesStore.setPredicate(this.getPredicate());
  }
  get injectedProps() {
    return this.props as InjectedMainViewProps;
  }

  public componentDidMount() {
    this.injectedProps.articlesStore.loadArticles();
  }

  public componentDidUpdate(preivousProps: InjectedMainViewProps) {
    const { tab } = qsParse(this.props.location.search);
    const { tab: previousTab } = qsParse(preivousProps.location.search);
    const { tag } = qsParse(this.props.location.search);
    const { tag: previousTag } = qsParse(preivousProps.location.search);

    if (tab !== previousTab || tag !== previousTag) {
      this.injectedProps.articlesStore.setPredicate(this.getPredicate());
      this.injectedProps.articlesStore.loadArticles();
    }
  }

  public render() {
    const { currentUser } = this.injectedProps.userStore;
    const { tab } = qsParse(this.props.location.search);
    const tabIndex = tab === "tag" ? 2 : tab === "feed" ? 1 : 0;
    const {
      articles,
      isLoading,
      totalPagesCount,
      page
    } = this.injectedProps.articlesStore;
    return [
      <Grid
        key="tab"
        style={{ marginTop: "1rem", padding: "0 1rem" }}
        item={true}
        md={6}
      >
        <Tabs
          value={tabIndex}
          indicatorColor="primary"
          onChange={this.handleTabChange}
          textColor="primary"
        >
          <Tab label="Global Feed" />
          {currentUser && <Tab label="Your Feed" />}
          {tab === "tag" && (
            <Tab label={`#${qsParse(this.props.location.search).tag}`} />
          )}
        </Tabs>
        <ArticleList
          articles={articles}
          loading={isLoading}
          totalPagesCount={totalPagesCount}
          currentPage={page}
          onSetPage={this.handleSetPage}
        />
      </Grid>
    ];
  }

  private handleTabChange = (_event: React.ChangeEvent<{}>, value: any) => {
    this.props.history.push({
      pathname: "/",
      search: value === 1 ? "?tab=feed" : "?tab=all"
    });
  };

  private handleSetPage = (page: number) => {
    this.injectedProps.articlesStore.setPage(page);
    this.injectedProps.articlesStore.loadArticles();
  };

  private getPredicate(): IPredicate {
    const { tab } = qsParse(this.props.location.search);
    switch (tab) {
      case "feed":
        return { myFeed: true };
      case "tag":
        return { tag: qsParse(this.props.location.search).tag[0] };
      default:
        return {};
    }
  }
}

export default withRouter(MainView);
