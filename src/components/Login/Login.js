import React, { Component } from "react";
import ReactDOM from "react-dom";
import Home from "../Home/Home";
import GoogleLogin from "react-google-login";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

//import SocialIcons from "react-social-icons";
//import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import FacebookLogin from "react-facebook-login";

import "./App.css";

/*const routes = [
  {
    path: "/home",
    component: Home
  },
  {
    path: "/",
    component: Login
  }
];*/

class Login extends React.Component {
  constructor(props) {
    super(props);
    let givenName = localStorage.getItem("givenName");
    let weather = localStorage.getItem("weatherData");
    let type = localStorage.getItem("type");
    if (givenName == null || weather == null) {
      this.setState({ login: true });
      //this.setState({ home: true });
    } else {
      this.setState({ name: givenName });
      this.getWeatherData(this.state.lat, this.state.long, this.state.type);
      this.setState({ home: true });
    }
  }

  state = {
    lat: 1.3521,
    long: 103.8198,
    errorMessage: "",
    name: "",
    currentDate: "",
    weather: "",
    email: "",
    type: "",
    home: false,
    errors: "",
    login: false
  };

  componentDidMount() {
    console.log("my component was mounted");

    window.navigator.geolocation.getCurrentPosition(position => {
      this.setState({ lat: position.coords.latitude });
      this.setState({ long: position.coords.longitude });
    });

    //err => {
    //this.setState ({ errorMessage:err.message});
    //}
  }

  componentDidUpdate() {
    console.log("my component was re-rendered");
  }

  getWeatherData = (lat, long, type) => {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/",
      targetUrl =
        "https://api.darksky.net/forecast/c0ab280704d267175fc11af00ec45ec0/" +
        lat +
        "," +
        long;

    fetch(proxyUrl + targetUrl)
      .then(blob => blob.json())
      .then(data => {
        let temperature = parseFloat(data.currently.temperature);
        temperature = Math.round((temperature - 32) / 1.8);
        let a = new Date(new Date(data.currently.time) * 1000);
        let months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        this.setState({
          weather:
            temperature +
            " Celsius - " +
            data.currently.summary +
            " - " +
            month +
            " " +
            date +
            " " +
            year
        });
        localStorage.setItem(
          "weatherData",
          temperature +
            " Celsius - " +
            data.currently.summary +
            " - " +
            month +
            " " +
            date +
            " " +
            year
        );
        this.setState({ home: true });

        return (
          temperature +
          " Celsius - " +
          data.currently.summary +
          " - " +
          month +
          " " +
          date +
          " " +
          year
        );
      });
  };

  render() {
    const responseFacebook = response => {
      console.log(response);
      if (response != undefined && response.name != undefined) {
        this.setState({ name: response.name });
        this.setState({ type: "facebook" });
        this.setState({ email: response.email });
        localStorage.setItem("type", "facebook");
        localStorage.setItem("givenName", response.name);
        localStorage.setItem("emailAddress", response.email);
        let weatherData = this.getWeatherData(
          this.state.lat,
          this.state.long,
          this.state.type
        );
      } else {
        this.setState({
          errors: "please log out from Facebook and try to log in again"
        });
      }
    };

    const componentClicked = response => {
      console.log(response);
    };

    const responseGoogle = response => {
      console.log(response);

      if (response.error == undefined && response.profileObj != undefined) {
        //this.getWeatherData(this.state.lat,this.state.long "gl");
        localStorage.setItem(
          "givenName",
          response.profileObj.givenName + response.profileObj.familyName
        );
        localStorage.setItem("emailAddress", response.profileObj.email);
        localStorage.setItem("type", "google");
        this.setState({
          name: response.profileObj.givenName + response.profileObj.familyName
        });
        this.setState({ email: response.profileObj.email });
        this.setState({ currentDate: new Date().toString() });
        this.setState({ type: "google" });
        let weatherData = this.getWeatherData(
          this.state.lat,
          this.state.long,
          this.state.type
        );
      } else {
        this.setState({
          errors: "please log out from Google and try to log in again"
        });
      }
    };

    if (this.state.home) {
      return (
        <Router>
          <div>
            <Route path="/home" component={Home} />
            <Redirect
              to={{
                pathname: "/home",
                state: {
                  name: this.state.name,
                  weather: this.state.weather,
                  loginType: this.state.type,
                  lat: this.state.lat,
                  email: this.state.email,
                  long: this.state.long
                }
              }}
            />
          </div>
        </Router>
      );
    } else if (this.state.login) {
      return (
        <Router>
          <div>
            <Route path="/" component={Login} />
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          </div>
        </Router>
      );
    }
    return (
      <div className="login-form">
        <p className="text-center font-weight-bold h2">
          Welcome to Weather Application
        </p>

        <form className="form-horizontal" role="form" name="loginForm">
          <h2 className="text-center">Sign in</h2>
          <div className="text-center social-btn">
            <label>{this.state.errors}</label>
            <div className="col-sm-offset-2">
              <GoogleLogin
                clientId="426902910826-m9e1q5t70lg4s2d3di8t5f0ios0ui87i.apps.googleusercontent.com"
                buttonText="Login"
                render={renderProps => (
                  <button
                    className="btn btn-danger btn-block"
                    onClick={renderProps.onClick}
                  >
                    <i className="fa fa-google" />
                    Login with Google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
            </div>

            <div className="col-sm-offset-2">
              <FacebookLogin
                appId="2218399135048548"
                autoLoad={false}
                fields="name,email,picture"
                icon="fa fa-facebook"
                onClick={componentClicked}
                callback={responseFacebook}
                scope="public_profile"
                cssClass="btn btn-primary btn-block"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
