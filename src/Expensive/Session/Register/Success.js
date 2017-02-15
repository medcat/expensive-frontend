import React from "react";
import {Link} from "react-router";

export default class Success extends React.Component {
  render() {
    return (
      <div className="user-form modal">
        <h1 className="user-form-title">
          Success!
        </h1>
        <p className="user-form-message">
          Congratulations!  You've successfully registered.  Let's move on to
          your Dashboard, and take a look around.
        </p>

        <div className="user-form-actions">
          <Link to="/dashboard" className="user-form-link-primary">Dashboard</Link>
        </div>
      </div>
    );
  }
}
