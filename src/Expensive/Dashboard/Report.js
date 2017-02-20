import React from "react";
import {AreaChart} from "react-chartkick";
import Spinner from "Expensive/Spinner";
import Failure from "Expensive/Dashboard/Failure";
import Pagination from "Expensive/Dashboard/Pagination";
import SmallReport from "Expensive/Dashboard/ReportList/Report";
import Navigation from "Expensive/Dashboard/Report/Navigation";
import Filter from "Expensive/Dashboard/Report/Filter";
import moment from "moment";
import "twix";
import {authentication} from "Expensive/authentication";

const itemsPerPage = 20;

export default class Report extends React.Component {
  constructor(props) {
    super(props);

    this.state = { which: "loading", page: this.getPage(),
      start: this.props.location.query.start,
      stop: this.props.location.query.stop };
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  get resourceId() { return this.props.params.id; }
  get period() { return this.props.location.query.period || "week"; }
  getPage() { return _.toInteger(this.props.location.query.page || "1"); }
  componentWillMount() { this._loadData(); }

  handleRefresh(toPeriod) {
    this._loadData(toPeriod);
  }

  handleChangePage(event, page) {
    event.preventDefault();
    this.setState({ page });
  }

  handleFilter(start, stop) {
    this.setState({ start, stop });
    this._loadData(this.period, start, stop);
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
      <div>
        <Navigation period={this.period} onRefresh={this.handleRefresh} />
        {this.renderOverview()}
        {this.renderFilter()}
        {this.renderGraph()}
        {this.renderAggregatePeriods()}
      </div>
    );
  }

  renderOverview() {
    return (<SmallReport data={this.state.report}
      onRefresh={this.handleRefresh} router={this.props.router}
      showOpen={false} />);
  }

  renderFilter() {
    return (<Filter onFilter={this.handleFilter} start={this.state.start}
      stop={this.state.stop} />);
  }

  renderGraph() {
    const data = _(this.state.report.aggregate).mapValues((value) => value.raw);
    return (<div className="dashboard-graph">
        <AreaChart data={data.value()} colors={["#f7efce"]}
            library={{chart: {backgroundColor: "#327ccb"},
              xAxis: {labels: {style: {color: "#f7efce"}}},
              yAxis: {labels: {style: {color: "#f7efce"}}}}}/>
      </div>);
  }

  renderAggregatePeriods() {
    const paired = _(this.state.report.aggregate).toPairs();
    const size = paired.size();
    const currentPage = this.state.page;
    const totalPages = Math.ceil(size / itemsPerPage);
    const windowedData = paired
        .map((c) => [moment(c[0]), c[1]])
        .sortBy((c) => c[0])
        .reverse()
        .map((c) => c[1])
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const elements = windowedData.map((value) => {
      const dateTime = moment(value.time);
      const endDateTime = dateTime.clone().add(1, this.period);
      const key = `${this.period}-${dateTime.format()}`;
      const periodData = dateTime.twix(endDateTime)
        .format({ monthFormat: "MMMM", dayFormat: "Do" });

      return (
        <div className="dashboard-report-item" key={key}>
          <div className="dashboard-report-item-period">
            {periodData}
          </div>

          <div className="dashboard-report-item-amount">
            {value.format}
          </div>
        </div>
      );
    }).value();

    return (
      <div>
        <Pagination pages={{total: totalPages, current: currentPage}}
          onChangePage={this.handleChangePage} />
        <div>
          {elements}
        </div>
        <Pagination pages={{total: totalPages, current: currentPage}}
          onChangePage={this.handleChangePage} />
      </div>
    );
  }

  _loadData(period = this.period, start = this.state.start,
    stop = this.state.stop) {
    let link = `/api/reports/${this.resourceId}.json?period=${period}`;
    if(start && stop)
      link += `&start=${start}&stop=${stop}`;
    authentication
      .performAuthorizedGet(link)
      .then(({data: result}) => {
        this.setState({ which: "normal",
          report: result.data,
          page: this.getPage() });
      })
      .catch((...a) => {
        this.setState({ which: "failed" });
        return Promise.reject(...a);
      });
  }
}

Report.propTypes = {
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
}
