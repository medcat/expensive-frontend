import React from "react";
import moment from "moment";
import {authentication} from "Expensive/authentication";
import EditExpense from "Expensive/Dashboard/ExpenseList/EditExpense";

export default class Expense extends React.Component {
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
          return this.context.router.replace("/");
        } else {
          this.setState({ which: "critical" });
          return Promise.reject({data, response});
        }
      });
  }

  render() {
    const description = this.props.data.description ?
      this.props.data.description : "(no desc.)";
    const amount = this.props.data.amountString;
    const time = moment(this.props.data.time);
    let className = "dashboard-expense dashboard-expense-" + this.state.which;

    return (
      <div className={className}>
        <div className="dashboard-expense-amount">{amount}</div>
        <div className="dashboard-expense-description">{description}</div>
        <div className="dashboard-expense-time">
          <time dateTime={time.format()} name={time.format("LLLL")}
          >{time.fromNow()}</time>
        </div>
        <div className="dashboard-expense-options">
          {this.props.data.canEdit ?
            <a onClick={this.handleEdit}
              className="dashboard-expense-options-edit">
              <i className="fa fa-pencil" name="Edit" />
            </a>
          : ""}
          {this.props.data.canDelete ?
            <a onClick={this.handleDelete}
              className="dashboard-expense-options-delete">
              <i className="fa fa-trash" name="Delete" />
            </a>
          : ""}
        </div>
        {this.state.which == "edit" ? this.renderEdit() : ""}
        {this.state.which == "delete" ? this.renderDelete() : ""}
      </div>
    );
  }

  renderEdit() {
    return (
      <EditExpense data={this.props.data} onRefresh={this.props.onRefresh}
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
            onClick={this.handleDeleteSubmit}
            >Yes, I'm sure.</a>
          <a
            className="dashboard-expense-form-action"
            onClick={this.handleDelete}
            >Nevermind.</a>
        </div>
      </div>
    );
  }
}

Expense.propTypes = {
  data: React.PropTypes.object.isRequired,
  onRefresh: React.PropTypes.func.isRequired
}
