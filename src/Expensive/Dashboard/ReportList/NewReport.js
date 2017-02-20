import React from "react";
import DateTime from "react-datetime";
import FormErrors from "Expensive/FormErrors";
import moment from "moment";
import {server} from "Expensive/server";
import {authentication} from "Expensive/authentication";
import currency from "Expensive/currency";

export default class NewReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.defaultState();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this);
    this.handleStopDateTimeChange = this.handleStopDateTimeChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  defaultState() {
    return { which: "small", currency: server.defaultCurrency,
      errors: null, name: "", startDateTime: moment(), stopDateTime: moment() };
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

  handleStartDateTimeChange(time) {
    this.setState({ startDateTime: time });
  }

  handleStopDateTimeChange(time) {
    this.setState({ stopDateTime: time });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ which: "loading" });
    const data = {
      report: { name: this.state.name,
        currency: this.state.currency,
        start: this.state.startDateTime.format(),
        stop: this.state.stopDateTime.format() } }
    authentication
      .performAuthorizedPost("/api/reports.json", data)
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
    const className = `dashboard-report dashboard-report-${this.state.which}`;
    return (
      <form className={className} onSubmit={this.handleSubmit}>
        <div className="dashboard-report-input">
          <div className="dashboard-report-input-currency">
            {this._currencySelector()}
          </div>
          <div className="dashboard-report-input-name">
            {this._nameInput()}
          </div>
          <div className="dashboard-report-input-start">
            {this._startDateTimeInput()}
          </div>
          <div className="dashboard-report-input-stop">
            {this._stopDateTimeInput()}
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
      <select name="currency" className="dashboard-report-input-currency-value"
        onChange={this.handleUpdate} disabled={this.inputsAreDisabled()}
        value={this.state.currency}>
        {options}
      </select>);
  }

  _nameInput() {
    return (<input name="name"
        className="dashboard-expense-input-name-value"
        onChange={this.handleUpdate}
        disabled={this.inputsAreDisabled()}
        value={this.state.name} placeholder="name" />);
  }

  _startDateTimeInput() {
    return <DateTime onChange={this.handleStartDateTimeChange}
      className="dashboard-report-input-start-time-picker"
      value={this.state.startDateTime} />;
  }


  _stopDateTimeInput() {
    return <DateTime onChange={this.handleStopDateTimeChange}
      className="dashboard-report-input-stop-time-picker"
      value={this.state.stopDateTime} />;
  }

  _submitButton(noEncapsulate = false) {
    if(this.state.which == "small") { return null; }
    const className = noEncapsulate ? "" : "dashboard-report-form";

    return (
      <div className={className}>
        <FormErrors errors={this.state.errors} which={this.state.which} />
        <div className="dashboard-report-form-actions">
          <input type="submit" value="Submit"
            className="dashboard-report-form-action dashboard-report-form-action-primary" />
          <input type="reset" value="Reset"
            className="dashboard-report-form-action"
            onClick={this.handleReset} />
        </div>
      </div>
    );
  }
}

NewReport.propTypes = {
  onRefresh: React.PropTypes.func.isRequired
}
