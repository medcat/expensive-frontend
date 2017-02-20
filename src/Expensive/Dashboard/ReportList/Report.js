import React from "react";
import EditReport from "./EditReport";
import {Link} from "react-router";
import moment from "moment";
import {authentication} from "Expensive/authentication";

export default class Report extends React.Component {
  constructor(props) {
    super(props);

    this.state = { which: "normal" };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditFinish = this.handleEditFinish.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
  }

  handleEdit(event) {
    event.preventDefault();
    switch(this.state.which) {
      case "edit":
        return this.setState({ which: "normal" });
      case "loading":
      case "critical":
        return; // ignore.
      default:
        return this.setState({ which: "edit" });
    }
  }

  handleEditFinish() {
    this.setState({ which: "normal" });
  }

  handleDelete(event) {
    event.preventDefault();
    switch(this.state.which) {
      case "delete":
        return this.setState({ which: "normal" });
      case "loading":
      case "critical":
        return; // ignore.
      default:
        return this.setState({ which: "delete" });
    }
  }

  handleDeleteSubmit(event) {
    event.preventDefault();
    this.setState({ which: "loading" });

    authentication
      .performAuthorizedDelete(this.props.data.link)
      .then(this.props.onRefresh)
      .catch(({data, response}) => {
        if(response.status == 401) {
          return this.props.router.replace("/");
        } else {
          this.setState({ which: "critical" });
          return Promise.reject({data, response});
        }
      });
  }

  render() {
    const start = moment(this.props.data.start);
    const stop = moment(this.props.data.stop);
    let className = "dashboard-report dashboard-report-" + this.state.which;

    return (
      <div className={className}>
        <div className="dashboard-report-currency">{this.props.data.currency}</div>
        <div className="dashboard-report-name">{this.props.data.name}</div>
        <div className="dashboard-report-start">
          <time dateTime={start.format()} name={start.format("LLLL")}>
            {start.calendar()}
          </time>
        </div>
        <div className="dashboard-report-stop">
          <time dateTime={stop.format()} name={stop.format("LLLL")}>
            {stop.calendar()}
          </time>
        </div>
        <div className="dashboard-report-options">
          {this.props.data.canEdit ?
            <a onClick={this.handleEdit}
              className="dashboard-report-options-edit">
              <i className="fa fa-pencil" name="Edit" />
            </a>
          : ""}
          {this.props.data.canDelete ?
            <a onClick={this.handleDelete}
              className="dashboard-report-options-delete">
              <i className="fa fa-trash" name="Delete" />
            </a>
          : ""}
          {this.props.showOpen ?
            <Link to={`/dashboard/reports/${this.props.data.id}`}
              className="dashboard-report-options-open">
              <i className="fa fa-arrow-right" name="Open" />
            </Link>
          : ""}
        </div>
        {this.state.which == "edit" ? this.renderEdit() : ""}
        {this.state.which == "delete" ? this.renderDelete() : ""}
      </div>
    );
  }

  renderEdit() {
    return (
      <EditReport data={this.props.data} onRefresh={this.props.onRefresh}
        onFinish={this.handleEditFinish} />
    );
  }

  renderDelete() {
    return (
      <div className="dashboard-expense-form">
        <p className="dashboard-expense-form-message">
          Are you sure you want to delete this?  It can't be undone!
        </p>

        <div className="dashboard-expense-form-actions">
          <a
            className="dashboard-expense-form-action
              dashboard-expense-form-action-primary
              dashboard-expense-form-action-warning"
            onClick={this.handleDeleteSubmit}>
            Yes, I'm sure.
          </a>
          <a
            className="dashboard-expense-form-action"
            onClick={this.handleDelete}>
            Nevermind.
          </a>
        </div>
      </div>
    );
  }
}

Report.propTypes = {
  data: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
  onRefresh: React.PropTypes.func.isRequired,
  showOpen: React.PropTypes.bool
}
