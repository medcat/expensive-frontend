import React from "react";
import md5 from "md5";
import {Link} from "react-router";
import {authentication} from "Expensive/authentication";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { all: false };
    this.handleAllToggle = this.handleAllToggle.bind(this);
  }

  handleAllToggle() {
    this.setState({ all: !this.state.all });
  }

  render() {
    return (
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-profile">
          <img src={this.profileIcon()} className="dashboard-sidebar-profile-icon" />
        </div>
        <ul className="dashboard-sidebar-list">
          {authentication.tokenData.admin ? this.adminAllLink() : "" }
          <li className="dashboard-sidebar-item">
            <Link to="/dashboard" className="dashboard-sidebar-item-link">
              <i className="fa fa-home" /> Home
            </Link>
          </li>
          <li className="dashboard-sidebar-item">
            <Link to="/dashboard/expenses" className="dashboard-sidebar-item-link">
              <i className="fa fa-dollar" /> Expenses
            </Link>
          </li>
          <li className="dashboard-sidebar-item">
            <Link to="/dashboard/expenses" className="dashboard-sidebar-item-link">
              <i className="fa fa-file-text" /> Reports
            </Link>
          </li>
        </ul>
      </aside>
    );
  }

  profileIcon() {
    return "//gravatar.com/avatar/" +
      md5(authentication.tokenData.email) + ".jpg?d=mm&r=g&s=150";
  }

  adminAllLink() {
    let className = "dashboard-sidebar-item-link";

    if(this.state.all) {
      className = className + " dashboard-sidebar-item-active";
    }

    return (
      <li className="dashboard-sidebar-item">
        <a onClick={this.handleAllToggle} className={className}>
          <i className="fa fa-plus-square" /> All
        </a>
      </li>
    );
  }
}
