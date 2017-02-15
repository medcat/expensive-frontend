import React from "react";
import {Link} from "react-router";

export default class Modal extends React.Component {
  render() {
    return (
      <form className="user-form modal" onSubmit={this.props.onSubmit}>
        <h1 className="user-form-title">Register</h1>
        {this.props.status == "error" ? this.errorMessage() : ""}
        <input className="user-form-input" name="email" type="email"
          placeholder="email" onChange={this.props.onUpdate}
          disabled={this.props.status == "loading"} />
        <input className="user-form-input" name="password"
          type="password" placeholder="password"
          onChange={this.props.onUpdate}
          disabled={this.props.status == "loading"} />
        <input className="user-form-input" name="passwordConfirmation"
          type="password" placeholder="password confirmation"
          onChange={this.props.onUpdate}
          disabled={this.props.status == "loading"} />
        <div className="user-form-actions">
          <input className="user-form-button" type="submit"
            disabled={this.props.status == "loading"} />
          <Link to="/session/login" className="user-form-link">Login</Link>
        </div>
      </form>
    )
  }

  errorMessage() {
    return (
      <ul className="errors">
        Whoa!  That didn't seem to be right.  Here's some things you should fix:
        {this.errorMessages().map((k, i) =>
          <li key={i} className="errors-item">{k}</li>
        )}
      </ul>
    );
  }

  errorMessages() {
    if(!this.props.errors) return [];
    let list = [];
    for(let name in this.props.errors) {
      let value = this.props.errors[name];
      for(let validation of value) {
        let string = this.errorMessageString(name, validation);
        if(string) list.push(string);
      }
    }

    return list;
  }

  criticalMessage() {
    return (
      <div className="errors">
        There seems to have been some sort of error... Maybe try again?
      </div>
    );
  }

  errorMessageString(name, validation) {
    let humanized = name.replace(/_/, " ");
    humanized = humanized.charAt(0).toUpperCase() + humanized.slice(1);
    switch(validation.error) {
      case "invalid":
        return `${humanized} is invalid`;
      case "blank":
        return `${humanized} can't be blank`;
      case "too_short":
        return `${humanized} is too short (minimum ${validation.count})`;
      case "confirmation":
        return `${humanized} must match ${validation.attribute}`;
      case "taken":
        return `${humanized} has already been taken`;
      default:
        return `${humanized} ${validation.error}`;
    }
  }
}

Modal.propTypes = {
  status: React.PropTypes.string.isRequired,
  errors: React.PropTypes.any,
  onSubmit: React.PropTypes.func.isRequired,
  onUpdate: React.PropTypes.func.isRequired,
}
