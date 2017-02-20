import React from "react";
import NewReport from "./NewReport";
import FormErrors from "Expensive/FormErrors";
import moment from "moment";
import {authentication} from "Expensive/authentication";


export default class EditReport extends NewReport {
  defaultState() {
    return { which: "normal", currency: this.props.data.currency,
      errors: null, name: this.props.data.name,
      startDateTime: moment(this.props.data.start),
      stopDateTime: moment(this.props.data.stop) };
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

  render() {
    return (
      <form className="dashboard-report-form dashboard-report-input" onSubmit={this.handleSubmit}>
        <FormErrors errors={this.state.errors} which={this.state.which} />
        <div className="dashboard-report-form-set">
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
        {this._submitButton(true)}
      </form>
    );
  }
}
