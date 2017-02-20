import React from "react";
import TextArea from "react-textarea-autosize";
import DateTime from "react-datetime";
import FormErrors from "Expensive/FormErrors";
import moment from "moment";
import currency from "Expensive/currency";
import {server} from "Expensive/server";
import {authentication} from "Expensive/authentication";

export default class NewExpense extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.defaultState();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  defaultState() {
    return { which: "small", currency: server.defaultCurrency,
      errors: null, description: "", amount: "", dateTime: moment() };
  }

  inputsAreDisabled() {
    switch(this.state.which) {
      case "small":
      case "normal":
      case "error":
        return false;
      default:
        return true;
    }
  }

  handleUpdate(event) {
    this.setState({ "which": "normal",
      [event.target.name]: event.target.value });
  }

  handleDateTimeChange(time) {
    this.setState({ dateTime: time });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ which: "loading" });
    const data = {
      expense: { description: this.state.description,
        amount: this.state.amount, currency: this.state.currency,
        time: this.state.dateTime.format() } }
    authentication
      .performAuthorizedPost("/api/expenses.json", data)
      .then(this.props.onRefresh)
      .then(this.handleReset)
      .catch(({data, response}) => {
        if(response.status == 422) {
          this.setState({ which: "error", errors: data.errors });
        } else {
          this.setState({ which: "critical" });
        }
      });
  }

  handleReset() {
    this.setState(this.defaultState());
  }

  render() {
    const className = `dashboard-expense dashboard-expense-${this.state.which}`;
    return (
      <form className={className} onSubmit={this.handleSubmit}>
        <div className="dashboard-expense-input">
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

  _currencySelector() {
    const options = _(currency)
      .values()
      .sortBy((c) => c.priority)
      .map((curr) => {
        const sym = curr.symbol;
        const code = curr.iso_code;
        const useDefault = code == server.defaultCurrency;
        return (<option key={code} default={useDefault} value={code}>
            {code}{sym}
          </option>);
      }).value();

    return (
      <select name="currency" className="dashboard-expense-input-amount-currency"
        onChange={this.handleUpdate} disabled={this.inputsAreDisabled()}
        value={this.state.currency}>
        {options}
      </select>);
  }

  _amountInput() {
    return (<input name="amount"
        className="dashboard-expense-input-amount-value"
        onChange={this.handleUpdate}
        disabled={this.inputsAreDisabled()}
        value={this.state.amount} placeholder="amount" />);
  }

  _descriptionInput() {
    return (<TextArea name="description"
        className="dashboard-expense-input-description-value"
        onChange={this.handleUpdate}
        disabled={this.inputsAreDisabled()}
        value={this.state.description} placeholder="description" />);
  }

  _dateTimeInput() {
    return <DateTime onChange={this.handleDateTimeChange}
      className="dashboard-expense-input-time-picker"
      value={this.state.dateTime} placeholder="time" />;
  }

  _submitButton(noEncapsulate = false) {
    if(this.state.which == "small") { return null; }
    const className = noEncapsulate ? "" : "dashboard-expense-form";

    return (
      <div className={className}>
        <FormErrors errors={this.state.errors} which={this.state.which} />
        <div className="dashboard-expense-form-actions">
          <input type="submit" value="Submit"
            className="dashboard-expense-form-action dashboard-expense-form-action-primary" />
          <input type="reset" value="Reset"
            className="dashboard-expense-form-action"
            onClick={this.handleReset} />
        </div>
      </div>
    );
  }
}

NewExpense.propTypes = {
  onRefresh: React.PropTypes.func.isRequired
}
