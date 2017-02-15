import React from "react";

let randomMessages = [
  "Well, this is taking a while.",
  "At least you're not on hold.",
  "Follow the white rabbit.",
  "Got any good jokes?",
  "Nope, false alarm.",
  "Integrating curves...",
  "Building data trees...",
  "Reticulating splines...",
  "Adjusting bell curves...",
  "I think it's almost here...",
  "Paging for the system elf...",
  "Iterating cellular atomata...",
  "Spinning the wheel of fortune...",
  "Loading the next loading message...",
  "An elf has been found, please wait...",
  "Commencing infinite loop (this may take some time)...",
  "Pay no attention to the elf behind the curtain.",
  "Please enjoy this elevator music while you wait.",
  "A few bits tried to escape, but they've been caught by the elves.",
  "Checking the gravitational constant in your locale...",
  "Happy Elf and Sad Elf are talking about your data; please wait.",
  "All the relevant elves are on break; please wait.",
  "Yes, there really are magic elves with an abacus working frantically in here.",
];

export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.timeouts = [];
  }

  componentDidMount() {
    this.timeouts.push(setTimeout(() => this.setState({ show: true }), 2000));
    this.timeouts.push(setTimeout(() => {
      this.interval = setInterval(this._pushNewMessage.bind(this), 5000);
      this._pushNewMessage();
    }, 5000));
  }

  componentWillUnmount() {
    _.each(this.timeouts, (e) => clearTimeout(e));
    if(this.interval) clearInterval(this.interval);
  }

  render() {
    return (
      <div className="spinner-container">
        <div className="spinner-placeholder">-</div>
        {this.state.show ? this.spinner() : ""}
      </div>
    );
  }

  spinner() {
    return (
      <div className="spinner">
        <i className="fa fa-pulse fa-spinner" />
        <div className="spinner-message">{this.state.message}</div>
      </div>
    );
  }

  _pushNewMessage() {
    this.setState({ message: this._randomMessage() });
  }

  _randomMessage() {
    let index = Math.floor(Math.random() * randomMessages.length);
    return randomMessages[index];
  }
}
