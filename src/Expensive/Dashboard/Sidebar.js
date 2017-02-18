import React from "react";
import md5 from "md5";
import {Link} from "react-router";
import {authentication} from "Expensive/authentication";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { all: this.props.shouldLoadAll };
    this.handleAllToggle = this.handleAllToggle.bind(this);
  }

  handleAllToggle() {
    const all = !this.state.all;
    this.setState({ all });
    this.props.onLoadAll(all);
  }

  render() {
    return (
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-profile">
          <img src={this.profileIcon()} className="dashboard-sidebar-profile-icon" />
        </div>
        <ul className="dashboard-sidebar-list">
          <li className="dashboard-sidebar-item" key="dashboard">
            <Link to={this._link("/dashboard")}
              className="dashboard-sidebar-item-link">
              <i className="fa fa-home" /> Home
            </Link>
          </li>
          <li className="dashboard-sidebar-item" key="expenses">
            <Link to={this._link("/dashboard/expenses")}
              className="dashboard-sidebar-item-link">
              <i className="fa fa-dollar" /> Expenses
            </Link>
          </li>
          <li className="dashboard-sidebar-item" key="reports">
            <Link to="/dashboard/reports" className="dashboard-sidebar-item-link">
              <i className="fa fa-file-text" /> Reports
            </Link>
          </li>
          {authentication.tokenData.admin ? this.adminAllLink() : "" }
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
    let iconName = "fa fa-archive";

    if(this.state.all) {
      className = className + " dashboard-sidebar-item-active";
    }

    return (
      <li className="dashboard-sidebar-item dashboard-sidebar-item-toggles"
        key="admin-all">
        <a onClick={this.handleAllToggle} className={className}>
          <i className={iconName} /> List all
        </a>
      </li>
    );
  }

  _link(base) {
    if(this.state.all) {
      return `${base}?all=true`;
    } else {
      return base;
    }
  }
}

Sidebar.propTypes = {
  onLoadAll: React.PropTypes.func.isRequired,
  shouldLoadAll: React.PropTypes.bool
}
