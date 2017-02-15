import React from "react";
import Modal from "Expensive/Session/Register/Modal";
import Success from "Expensive/Session/Register/Success";
import {authentication} from "Expensive/authentication";

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {status: "normal",
      email: "", password: "", passwordConfirmation: ""};
  }

  componentWillMount() {
    if(!authentication.token) return;
    this.props.router.push("/");
  }

  handleSubmit(event) {
    event.preventDefault();

    authentication
      .attemptRegistration(this.state.email, this.state.password,
        this.state.passwordConfirmation)
      .then(() => this.setState({ status: "success" }))
      .catch(({data, response}) => {
        if(response.status == 422) {
          this.setState({ status: "error",
            errors: data.errors });
        } else {
          this.setState({ status: "critical" });
        }
      });
  }

  handleUpdate(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
      <div className="action-register">
        <div className="user-register-background"></div>,
        <section className="contents outer-container">
          {this.state.status == "success" ?
            <Success /> :
            <Modal
              status={this.state.status}
              errors={this.state.errors}
              onSubmit={this.handleSubmit}
              onUpdate={this.handleUpdate}
            />
          }
        </section>
      </div>
    );
  }
}

Register.propTypes = {
  router: React.PropTypes.object.isRequired
}
