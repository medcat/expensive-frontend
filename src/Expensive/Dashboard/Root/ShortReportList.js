import React from "react";
import {Link} from "react-router";

export default class ShortReportList extends React.Component {
  render() {
    return (
      <ul className="dashboard-reports-list">
        {_.map(this.props.data, (e) => this.renderReport(e))}
      </ul>
    );
  }

  renderReport(report) {
    const link = `/dashboard/reports/${report.id}`;
    return (
      <li>
        <Link to={link} key={report.id} className="dashboard-reports-item">
          <span className="dashboard-reports-item-name">{report.name}</span>
        </Link>
      </li>
    );
  }
}

ShortReportList.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}
