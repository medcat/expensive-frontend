import React from "react";
import Spinner from "Expensive/Spinner";
import Failure from "Expensive/Dashboard/Failure";
import Pagination from "Expensive/Dashboard/Pagination";
import Report from "Expensive/Dashboard/ReportList/Report";
import NewReport from "Expensive/Dashboard/ReportList/NewReport";
import {authentication} from "Expensive/authentication";

export default class ReportList extends React.Component {
  constructor(props) {
    super(props);

    const page = _.toInteger(this.props.location.query.page || "1");

    this.state = { which: "loading", page };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentWillMount() { this._loadData(); }

  handleChangePage(event, page) {
    this.props.router.push(`/dashboard/reports?page=${page}`);
    this.setState({ page });
    this._loadData(page);
  }

  handleRefresh() {
    this._loadData();
  }

  render() {
    return (<div>{
        this.state.which == "loading" ? <Spinner /> :
          this.state.which == "failed" ? <Failure /> :
          this.renderNormal()}
      </div>);
  }

  renderNormal() {
    return (
      <div className="dashboard-expense-list">
        <Pagination pages={this.state.pages} page={this.state.page}
          onChangePage={this.handleChangePage} />
        <NewReport onRefresh={this.handleRefresh} />
        {_.map(this.state.reports, (e) => {
          return (
            <Report key={e.id} data={e} onRefresh={this.handleRefresh}
              router={this.props.router} showOpen={true} />
          );
        })}
        <Pagination pages={this.state.pages} page={this.state.page}
          onChangePage={this.handleChangePage} />
      </div>
    );
  }

  _loadData(page = this.state.page) {
    authentication
      .performAuthorizedGet(`/api/reports.json?page=${page}`)
      .then(({data: result}) => {
        this.setState({
          which: "normal",
          reports: result.data,
          pages: result.meta.pages
        });
      })
      .catch((...a) => {
        this.setState({ which: "failed" });
        return Promise.reject(...a);
      });
  }
}

ReportList.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
}
