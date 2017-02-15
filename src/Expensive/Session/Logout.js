import React from "react";
import {authentication} from "Expensive/authentication";

export default class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    authentication.clearToken();
    this.props.router.push("/");
  }

  handleBack(event) {
    event.preventDefault();
    this.props.router.goBack();
  }

  render() {
    return (
      <div className="action-login">
        <div className="user-login-background"></div>,
        <section className="contents outer-container">
          <div className="user-form">
            <h1 className="user-form-title">Logout</h1>

            <p className="user-form-message">
              Are you sure?  You'll have to log back in to use anything!
            </p>

            <div className="user-form-actions">
              <button onClick={this.handleClick}>I'm Sure.</button>
              <a onClick={this.handleBack}>Nevermind.</a>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

Logout.propTypes = {
  router: React.PropTypes.object.isRequired
}
