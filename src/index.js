import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import Expensive from "Expensive";
import Highcharts from "highcharts";
import "font-awesome/css/font-awesome.css";
import "index.scss";

function renderBody() {
  ReactDOM.render((
    <Router history={Expensive.navigation.history}>
      <Route path="/" component={Expensive.Application}>
        <IndexRoute component={Expensive.Home} />
        <Route path="/session/login" component={Expensive.Session.Login} />
        <Route path="/session/logout" component={Expensive.Session.Logout} />
        <Route path="/session/register" component={Expensive.Session.Register} />
        <Route path="/dashboard" component={Expensive.Dashboard}>
          <IndexRoute component={Expensive.Dashboard.Root} />
          <Route path="expenses" component={Expensive.Dashboard.ExpenseList} />
          <Route path="reports" component={Expensive.Dashboard.ReportList} />
          <Route path="reports/:id" component={Expensive.Dashboard.Report} />
        </Route>
      </Route>
    </Router>
  ), document.getElementById("root"));
}

window.Highcharts = Highcharts;
Expensive.authentication.renewToken().then(renderBody, () => {
  Expensive.navigation.history.push("/");
  renderBody();
});
