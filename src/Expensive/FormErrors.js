import React from "react";

export default class FormErrors extends React.Component {
  render() {
    switch(this.props.which) {
      case "error":
        return this.renderError();
      case "critical":
        return this.renderCritical();
      default:
        return null;
    }
  }

  renderCritical() {
    return (
      <div className="errors">
        There seems to have been some sort of error... Maybe try again?
      </div>
    );
  }

  renderError() {
    if(_.isEmpty(this.props.errors) && !_.isArrayLike(this.props.errors)) {
      return this.renderErrorWithoutErrors();
    } else {
      return this.renderErrorWithErrors();
    }
  }

  renderErrorWithoutErrors() {
    return (
      <div className="errors">
        Whoa!  That didn't seem to be right.  Let's try again...
      </div>
    );
  }

  renderErrorWithErrors() {
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

  errorMessageString(name, validation) {
    let humanized = name.replace(/_/, " ");
    humanized = humanized.charAt(0).toUpperCase() + humanized.slice(1);
    switch(validation.error) {
      case "invalid":
      case "inclusion":
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

FormErrors.propTypes = {
  errors: React.PropTypes.any,
  which: React.PropTypes.string.isRequired
}
