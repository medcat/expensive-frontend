import React from "react";
import {AreaChart} from "react-chartkick";
import Topfigure from "Expensive/Dashboard/Root/Topfigure";
import ShortExpenseList from "Expensive/Dashboard/Root/ShortExpenseList";
import Spinner from "Expensive/Spinner";
import Failure from "Expensive/Dashboard/Failure";

import {authentication} from "Expensive/authentication";

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = { which: "loading" };
  }

  get shouldLoadAll() { return !!this.props.location.query.all; }
  componentWillMount() { this._loadData(); }
  componentWillReceiveProps(nextProps) {
    const all = !!nextProps.location.query.all;
    if(all != this.shouldLoadAll) {
      this._loadData(all);
    }
  }

  render() {
    return (
      <div className="action-dashboard-root">
        {this.state.which == "loading" ? <Spinner /> :
        this.state.which == "failed" ? <Failure /> :
        this.renderNormal()}
      </div>
    );
  }

  renderNormal() {
    return (
      <div>
        <Topfigure data={this.state.topfigure} />
        <div className="dashboard-graph">
          <AreaChart data={this.state.graph} colors={["#f7efce"]}
            fontFamily="'Lato'"
            library={{scales: {yAxes: [{display: false}]}}}
            />
        </div>
        <div className="dashboard-expenses">
          <h1 className="dashboard-expenses-title">Recent Expenses</h1>
          <ShortExpenseList data={this.state.expenses} />
        </div>

      </div>
    );
  }

  _loadData(shouldLoadAll = this.shouldLoadAll) {
    const all = shouldLoadAll ? "?all=true" : "";
    authentication
      .performAuthorizedGet(`/api/dashboard.json${all}`)
      .then(({data: result}) => {
        this.setState({
          which: "normal",
          topfigure: result.data.topfigure,
          expenses: result.data.expenses,
          graph: result.data.graph
        });
      })
      .catch((...a) => {
        this.setState({ which: "failed" });
        return Promise.reject(...a);
      });
  }
}

Root.propTypes = {
  location: React.PropTypes.object.isRequired
}
