import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory, hashHistory} from "react-router";
import Expensive from "Expensive";
import Chart from "chart.js";
import "font-awesome/css/font-awesome.css";
import "index.scss";

const history = process.env.NODE_ENV == "production" ?
  browserHistory : hashHistory;

function renderBody() {
  ReactDOM.render((
    <Router history={history}>
      <Route path="/" component={Expensive.Application}>
        <IndexRoute component={Expensive.Home} />
        <Route path="/session/login" component={Expensive.Session.Login} />
        <Route path="/session/logout" component={Expensive.Session.Logout} />
        <Route path="/session/register" component={Expensive.Session.Register} />
        <Route path="/dashboard" component={Expensive.Dashboard}>
          <IndexRoute component={Expensive.Dashboard.Root} />
        </Route>
      </Route>
    </Router>
  ), document.getElementById("root"));
}

Chart.defaults.global.defaultFontColor = "#f7efce";
Chart.defaults.global.defaultColor = "#f7efce";

Expensive.authentication.renewToken().then(renderBody, renderBody);
