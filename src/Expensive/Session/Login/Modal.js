import React from "react";
import {Link} from "react-router";
import FormErrors from "Expensive/FormErrors";

export default class Modal extends React.Component {
  render() {
    return (
      <form className="user-form modal" onSubmit={this.props.onSubmit}>
        <h1 className="user-form-title">Login</h1>
        <FormErrors which={this.props.status} />
        <input className="user-form-input" name="email" type="email"
          placeholder="email" onChange={this.props.onUpdate}
          disabled={this.props.status == "loading"} />
        <input className="user-form-input" name="password"
          type="password" placeholder="password"
          onChange={this.props.onUpdate}
          disabled={this.props.status == "loading"} />
        <div className="user-form-actions">
          <input className="user-form-button" type="submit"
            disabled={this.props.status == "loading"} />
          <Link to="/register" className="user-form-link">Register</Link>
        </div>
      </form>
    )
  }
}

Modal.propTypes = {
  status: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onUpdate: React.PropTypes.func.isRequired,
}
