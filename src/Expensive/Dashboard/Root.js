import React from "react";
import {AreaChart} from "react-chartkick";
import Topfigure from "Expensive/Dashboard/Root/Topfigure";
import ShortExpenseList from "Expensive/Dashboard/Root/ShortExpenseList";
import Spinner from "Expensive/Spinner";

import {authentication} from "Expensive/authentication";

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = { which: "loading" };
  }

  componentWillMount() {
    authentication
      .performAuthorizedGet("/api/dashboard.json")
      .then(({data: result}) => {
        this.setState({
          which: "normal",
          topfigure: result.data.topfigure,
          expenses: result.data.expenses,
          graph: result.data.graph
        });
      })
      .catch((v) => {
        console.warn("fail");
        console.error(v);
      });
  }

  render() {
    return (
      <div className="action-dashboard-root">
        {this.state.which == "loading" ?
          <Spinner /> :
        this.state.which == "fail" ?
          this.renderFail() :
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

  renderFail() {
    return (
      <div className="dashboard-fail">
        Oops, that's embarassing...  There was an error.  Maybe try again?
      </div>
    );
  }
}
