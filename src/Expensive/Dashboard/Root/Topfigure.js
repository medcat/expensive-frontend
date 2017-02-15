import React from "react";

export default class Topfigure extends React.Component {
  render() {
    return (
      <section className="dashboard-topfigure">
        <div className="dashboard-topfigure-item">
          <div className="dashboard-topfigure-item-figure">
            {this.props.data.monthToday.amount}
          </div>
          <div className="dashboard-topfigure-item-description">
            spent, month to date
          </div>
        </div>
        <div className="dashboard-topfigure-item">
          <div className="dashboard-topfigure-item-figure">
            {this.props.data.monthToday.size}
          </div>
          <div className="dashboard-topfigure-item-description">
            expenses, month to date
          </div>
        </div>
        <div className="dashboard-topfigure-item">
          <div className="dashboard-topfigure-item-figure">
            {this.props.data.weekToday.amount}
          </div>
          <div className="dashboard-topfigure-item-description">
            spent, week to date
          </div>
        </div>
        <div className="dashboard-topfigure-item">
          <div className="dashboard-topfigure-item-figure">
            {this.props.data.weekToday.size}
          </div>
          <div className="dashboard-topfigure-item-description">
            expenses, week to date
          </div>
        </div>
      </section>
    );
  }
}

Topfigure.propTypes = {
  data: React.PropTypes.object.isRequired
}
