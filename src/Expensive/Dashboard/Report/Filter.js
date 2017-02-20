import React from "react";
import DateTime from "react-datetime";
import {navigation} from "Expensive/navigation";
import moment from "moment";

export default class Filter extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props);
    this.state = {
      startDateTime: moment(this.props.start, moment.ISO_8601, true),
      stopDateTime: moment(this.props.stop, moment.ISO_8601, true) };
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStopDateTimeChange = this.handleStopDateTimeChange.bind(this);
    this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this);
  }

  handleStartDateTimeChange(startDateTime) {
    this.setState({ startDateTime });
  }

  handleStopDateTimeChange(stopDateTime) {
    this.setState({ stopDateTime });
  }

  handleSubmit(event) {
    event.preventDefault();
    let start, stop;

    if(!_.isObject(this.state.startDateTime))
      start = "";
    else
      start = this.state.startDateTime.format();
    if(!_.isObject(this.state.stopDateTime))
      stop = "";
    else
      stop = this.state.stopDateTime.format();

    navigation.addQuery({ start: start, stop: stop });
    this.props.onFilter(start, stop);
  }

  handleReset() {
    navigation.removeQuery("start", "stop");
    this.props.onFilter();
  }

  render() {
    return (
      <form className="dashboard-filter dashboard-filter-input"
        onSubmit={this.handleSubmit}>
        <div className="dashboard-filter-input-start">
          {this._startDateTimeInput()}
        </div>
        <div className="dashboard-filter-input-stop">
          {this._stopDateTimeInput()}
        </div>
        <div className="dashboard-filter-input-submit">
          {this._submitButton()}
        </div>
        <div className="dashboard-filter-input-reset">
          {this._resetButton()}
        </div>
      </form>
    );
  }

  _startDateTimeInput() {
    return (<DateTime onChange={this.handleStartDateTimeChange}
      className="dashboard-filter-input-start-time-picker"
      value={this.state.startDateTime} />);
  }

  _stopDateTimeInput() {
    return (<DateTime onChange={this.handleStopDateTimeChange}
      className="dashboard-report-input-stop-time-picker"
      value={this.state.stopDateTime} />);
  }

  _submitButton() {
    return (<input type="submit" value="Submit"
      className="dashboard-report-form-action
        dashboard-report-form-action-primary dashboard-report-input-submit" />);
  }

  _resetButton() {
    return (<input type="reset" value="Reset"
      className="dashboard-report-form-action dashboard-report-input-reset"
      onClick={this.handleReset} />);
  }
}

Filter.propTypes = {
  onFilter: React.PropTypes.func.isRequired,
  start: React.PropTypes.string,
  stop: React.PropTypes.string
}
