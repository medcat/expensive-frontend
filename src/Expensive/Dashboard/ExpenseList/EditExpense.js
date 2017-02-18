import React from "react";
import NewExpense from "./NewExpense";
import FormErrors from "Expensive/FormErrors";
import moment from "moment";
import {server} from "Expensive/server";
import {authentication} from "Expensive/authentication";

export default class EditExpense extends NewExpense {
  constructor(props) {
    super(props);

    this.state = { which: "normal", currency: this.props.data.currency,
      errors: null, description: this.props.data.description,
      amount: this.props.data.amount, dateTime: moment(this.props.data.time) };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ which: "loading" });
    const data = {
      expense: { description: this.state.description,
        amount: this.state.amount, currency: this.state.currency,
        time: this.state.dateTime.format() } }
    authentication
      .performAuthorizedPut(this.props.data.link, data)
      .then(this.props.onRefresh)
      .then(this.props.onFinish)
      .catch(({data, response}) => {
        if(response.status == 422) {
          this.setState({ which: "error", errors: data.errors });
        } else {
          this.setState({ which: "critical" });
        }
      });
  }

  handleReset() {
    this.setState({ which: "normal", errors: null,
      description: this.props.data.description,
      amount: this.props.data.amount, currency: server.defaultCurrency,
      dateTime: moment(this.props.data.time) });
  }

  render() {
    return (
      <form className="dashboard-expense-form dashboard-expense-input" onSubmit={this.handleSubmit}>
        <FormErrors errors={this.state.errors} which={this.state.which} />
        <div className="dashboard-expense-form-set">
          <div className="dashboard-expense-input-amount">
            {this._currencySelector()}
            {this._amountInput()}
          </div>
          <div className="dashboard-expense-input-description">
            {this._descriptionInput()}
          </div>
          <div className="dashboard-expense-input-time">
            {this._dateTimeInput()}
          </div>
        </div>
        {this._submitButton()}
      </form>
    );
  }
}

EditExpense.propTypes = {
  data: React.PropTypes.object.isRequired,
  onRefresh: React.PropTypes.func.isRequired,
  onFinish: React.PropTypes.func.isRequired
}
