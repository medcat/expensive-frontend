import React from "react";
import Root from "Expensive/Dashboard/Root";
import ExpenseList from "Expensive/Dashboard/ExpenseList";
import Sidebar from "Expensive/Dashboard/Sidebar";
import {authentication} from "Expensive/authentication";
import {navigation} from "Expensive/navigation";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoadAll = this.handleLoadAll.bind(this);
  }

  get shouldLoadAll() { return !!this.props.location.query.all; }
  componentWillMount() {
    if(authentication.token) return;
    this.props.router.push("/");
  }

  handleLoadAll(all) {
    if(all) {
      navigation.addQuery({ all });
    } else {
      navigation.removeQuery("all");
    }
  }

  render() {
    return (
      <div className="action-dashboard">
        <div className="dashboard-background" />
        <div className="dashboard-content">
          {this.props.children}
        </div>
        <Sidebar onLoadAll={this.handleLoadAll} shouldLoadAll={this.shouldLoadAll} />
      </div>
    );
  }
}

Dashboard.Root = Root;
Dashboard.ExpenseList = ExpenseList;
Dashboard.propTypes = {
  children: React.PropTypes.node,
  router: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}
