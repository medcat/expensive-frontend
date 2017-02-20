import React from "react";
import {Link} from "react-router";
import {navigation} from "Expensive/navigation";

export default class Navigation extends React.Component {
  handlePeriodClick(event, period) {
    event.preventDefault();
    navigation.addQuery({ period });
    this.props.onRefresh(period);
  }

  render() {
    return (
      <nav className="dashboard-navigation">
        {this.renderBackLink()}
        {this.renderSeperator()}
        {this.renderPeriodLinks()}
      </nav>
    );
  }

  renderBackLink() {
    return (
      <Link to="/dashboard/reports"
      className="dashboard-navigation-link dashboard-navigation-link-passive">
      &laquo; Back</Link>
    );
  }

  renderSeperator() {
    return (
      <span className="dashboard-navigation-seperator">
        &middot; &middot; &middot;
      </span>);
  }

  renderPeriodLinks() {
    return (
      <span>
        {this._renderPeriod("hour")}
        {this._renderPeriod("day")}
        {this._renderPeriod("week")}
        {this._renderPeriod("month")}
        {this._renderPeriod("year")}
      </span>
    );
  }

  _renderPeriod(which) {
    let className = "dashboard-navigation-link dashboard-navigation-link-passive";
    if(which == this.props.period)
      className += " dashboard-navigation-link-active";

    return (
      <a onClick={(e) => this.handlePeriodClick(e, which)} className={className}>
        {_.capitalize(which)}
      </a>
    );
  }
}

Navigation.propTypes = {
  period: React.PropTypes.string.isRequired,
  onRefresh: React.PropTypes.func.isRequired
}
