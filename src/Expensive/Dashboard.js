import React from "react";
import Root from "Expensive/Dashboard/Root";
import Sidebar from "Expensive/Dashboard/Sidebar";
import {authentication} from "Expensive/authentication";

export default class Dashboard extends React.Component {
  componentWillMount() {
    if(authentication.token) return;
    this.props.router.push("/");
  }

  render() {
    return (
      <div className="action-dashboard">
        <div className="dashboard-background" />
        <div className="dashboard-content">
          {this.props.children}
        </div>
        <Sidebar />
      </div>
    );
  }
}

Dashboard.Root = Root;
Dashboard.propTypes = {
  children: React.PropTypes.node,
  router: React.PropTypes.object.isRequired
}
