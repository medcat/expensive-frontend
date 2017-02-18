import React from "react";
import {Link} from "react-router";
import FormErrors from "Expensive/FormErrors";

export default class Modal extends React.Component {
  render() {
    return (
      <form className="user-form modal" onSubmit={this.props.onSubmit}>
        <h1 className="user-form-title">Register</h1>
        <FormErrors errors={this.props.errors} which={this.props.status} />
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
}

Modal.propTypes = {
  status: React.PropTypes.string.isRequired,
  errors: React.PropTypes.any,
  onSubmit: React.PropTypes.func.isRequired,
  onUpdate: React.PropTypes.func.isRequired,
}
