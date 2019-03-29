import React from "react";
import * as emailjs from "emailjs-com";
import Home from "../Home/Home";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const divStyle = {
  width: "60%",
  margin: "10%"
};
const labelStyle = {
  color: "red"
};
const statusStyle = {
  color: "green"
};

class EmailShare extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.email == ""
          ? localStorage.getItem("emailAddress")
          : this.props.location.state.email,
      name:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.name == ""
          ? localStorage.getItem("givenName")
          : this.props.location.state.name,
      weather:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.weatherData == ""
          ? localStorage.getItem("weatherData")
          : this.props.location.state.weatherData,
      emailField: "",
      firstName: "",
      lastName: "",
      status: "",
      homeRedirect: false,
      errors: ""
    };
    this.sendEmail = this.sendEmail.bind(this);
  }

  updateState = () => {
    console.log("inside update state");
  };
  sendEmail = event => {
    console.log(event);
    const self = this;
    let emailAddress = this.state.emailField;
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let errors = this.state.errors;
    let isValid = true;

    if (
      emailAddress == "" ||
      emailAddress.length < 3 ||
      emailAddress.search("@") == -1
    ) {
      errors = "Enter a valid Email Address";
      this.setState({ errors: errors });
      isValid = false;
    }
    if (firstName == "" || firstName == undefined) {
      errors = "Enter FirstName";
      this.setState({ errors: errors });
      isValid = false;
    }
    if (lastName == "" || lastName == undefined) {
      errors = "Enter LastName";
      this.setState({ errors: errors });
      isValid = false;
    }

    let templateParams = {
      email: emailAddress,
      to_name: emailAddress,
      name: this.state.firstName + " " + this.state.lastName,
      weather: this.state.weather
    };
    if (isValid) {
      this.setState({ errors: "" });
      const response = emailjs
        .send(
          "gmail",
          "template_ZTjCS6Ev",
          templateParams,
          "user_OMDTrcDU2RzhXmutUw8ZY"
        )
        .then(function(response) {
          console.log(response.status);
          if (response.status == 200) {
            self.setState({ status: "Email Sent Successfully" });
          }
        });
    }
  };

  backHome = () => {
    this.setState({ homeRedirect: true });
  };
  handleOnChange = event => {
    this.setState({ emailField: event.target.value });
  };
  handleOnChangeFN = event => {
    this.setState({ firstName: event.target.value });
  };

  handleOnChangeLN = event => {
    this.setState({ lastName: event.target.value });
  };
  render() {
    if (this.state.homeRedirect) {
      return (
        <Router>
          <div>
            <Route path="/home" component={Home} />
            <Redirect to="/home" push />
          </div>
        </Router>
      );
    }
    return (
      <div className="login-form" style={divStyle}>
        <h2 className="text-center">Share current date's weather data</h2>
        <div className="form-group">
          <label htmlFor="Email" className="col-sm-2 control-label">
            Email address
          </label>
          <span style={statusStyle}>{this.state.status}</span>
          <span style={labelStyle}>{this.state.errors}</span>
          <input
            type="email"
            className="form-control"
            onChange={this.handleOnChange}
            placeholder="Email Address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="First Name" className="col-sm-2 control-label">
            Enter First Name
          </label>
          <input
            type="text"
            className="form-control"
            onChange={this.handleOnChangeFN}
            placeholder="First Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Last Name" className="col-sm-2 control-label">
            Enter Last Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            onChange={this.handleOnChangeLN}
          />
        </div>
        <div className="text-center form-center">
          <button
            type="submit"
            className="btn-lg btn-primary"
            onClick={this.sendEmail}
          >
            Submit
          </button>
        </div>
        <div className="text-center form-center">
          <button className="btn-lg btn-default m-4" onClick={this.backHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }
}

export default EmailShare;
