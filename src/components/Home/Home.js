import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "../Login/Login";
import WeatherForecast from "./WeatherForecast";
import axios from "axios";
import Email from "../Email/EmailShare";
import Activity from "../Activity/index";
import "react-datepicker/dist/react-datepicker.css";

const currentDate = new Date();
const divStyle = {
  margin: "10%"
};
const labelStyle = {
  color: "red"
};
class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    let val = localStorage.getItem("value");
    let date = new Date(currentDate);
    date.setDate(date.getDate() + 6);
    let endDateLimitCalc = new Date(currentDate);
    endDateLimitCalc.setDate(endDateLimitCalc.getDate() + 6);
    console.log("end date" + endDateLimitCalc);
    this.state = {
      name:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.name == ""
          ? localStorage.getItem("givenName")
          : this.props.location.state.name,
      weather:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.weather == ""
          ? localStorage.getItem("weatherData")
          : this.props.location.state.weather,
      type:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.loginType == ""
          ? localStorage.getItem("type")
          : this.props.location.loginType,
      startDate: currentDate,
      endDate: currentDate,
      maxDateLimit: date,
      maxDateLimitEnd: endDateLimitCalc,
      login: false,
      emailRedirect: false,
      home: false,
      email:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.email == ""
          ? localStorage.getItem("emailAddress")
          : this.props.location.state.email,
      lat:
        this.props.location.state == undefined || ""
          ? 1.3521
          : this.props.location.state.lat,
      long:
        this.props.location.state == undefined || ""
          ? 103.8198
          : this.props.location.state.long,
      activityRedirecct: false,
      value: localStorage.getItem("value") == null ? "" : JSON.parse(val)
    };
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleStartChange(date) {
    /* if (new Date(date).getDate() < new Date().getDate()) {
      date = currentDate;
    }*/
    this.setState({ startDate: date });
  }

  handleEndChange(date) {
    /*let startDate = new Date(this.state.startDate).getDate();
    let endDate = new Date(date).getDate();
    let maxValue = startDate + 7;
    if (endDate - startDate > 7 || endDate - startDate < 0) {
      date = currentDate;
      date.setDate(maxValue);
    }*/
    this.setState({ endDate: date });
  }
  async handleSubmit(event) {
    localStorage.removeItem("value");
    let lat = this.state.lat;
    let long = this.state.long;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    let index = startDate.getDate() - currentDate.getDate();

    let count = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    //count = 8 - count;
    count = index + count;
    startDate.setHours("13");
    startDate.setMinutes("00");
    startDate.setSeconds("00");
    startDate = startDate.getTime() / 1000;
    startDate = Math.round(startDate);

    let summary = [];
    let temperature = [];
    let time = [];
    let k = 0;
    let z = 0;
    let i = 0;
    let date = [];
    let month = [];
    let year = [];
    let value = [];
    var proxyUrl = "https://cors-anywhere.herokuapp.com/",
      targetUrl =
        "https://api.darksky.net/forecast/c0ab280704d267175fc11af00ec45ec0/" +
        lat +
        "," +
        long;

    const response = fetch(proxyUrl + targetUrl)
      .then(blob => blob.json())
      .then(data => {
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

        for (let j = index; j <= count + 1; j++) {
          summary.push(data.daily.data[j].summary);
          let temperatureCalc = parseFloat(data.daily.data[j].temperatureLow);
          temperatureCalc = Math.round((temperatureCalc - 32) / 1.8);
          temperature.push(temperatureCalc);
          let a = new Date(new Date(data.daily.data[j].time) * 1000);
          year.push(a.getFullYear());
          month.push(months[a.getMonth()]);
          date.push(a.getDate());
          k++;
        }
        for (let m = 0; m < k - 1; m++) {
          console.log(
            temperature[m] +
              " Celsius - " +
              summary[m] +
              " - " +
              month[m] +
              " " +
              date[m] +
              " " +
              year[m]
          );
          value.push(
            temperature[m] +
              " Celsius - " +
              summary[m] +
              " - " +
              month[m] +
              " " +
              date[m] +
              " " +
              year[m]
          );
        }
        this.setState({ value: value });
        localStorage.setItem("value", JSON.stringify(value));
        this.setState({ abcd: true });
      });
    //const listItems = this.state.value.map(number => <li>{number}</li>);
    //this.setState({ value: { listItems } });
  }

  handleEmailRedirection = event => {
    localStorage.removeItem("value");
    this.setState({ emailRedirect: true });
  };
  handleActivityRedirection = event => {
    this.setState({ activityRedirecct: true });
  };
  //logout

  render() {
    const fLogout = res => {
      localStorage.clear();
      this.setState({ login: true });
    };

    const gLogout = res => {
      localStorage.clear();
      this.setState({ login: true });
    };

    if (this.state.login) {
      return (
        <Router>
          <div>
            <Route path="/" component={Login} />
            <Redirect to="/" push />
          </div>
        </Router>
      );
    } else if (this.state.home) {
      return (
        <Router>
          <div>
            <Route path="/home" component={Home} />
            <Redirect
              to={{
                pathname: "/home",
                state: {
                  value: this.state.value
                }
              }}
            />
          </div>
        </Router>
      );
    } else if (this.state.emailRedirect) {
      return (
        <Router>
          <div>
            <Route path="/email" component={Email} />
            <Redirect
              to={{
                pathname: "/email",
                state: {
                  email: this.state.email,
                  name: this.state.name,
                  weatherData: this.state.weather
                }
              }}
            />
          </div>
        </Router>
      );
    } else if (this.state.activityRedirecct) {
      return (
        <Router>
          <div>
            <Route path="/activity" component={Activity} />
            <Redirect
              to={{
                pathname: "/activity",
                state: {
                  email: this.state.email
                }
              }}
            />
          </div>
        </Router>
      );
    }
    let button = (
      <button className="btn btn-default m-4" onClick={gLogout}>
        Logout
      </button>
    );
    if (this.state.type == "facebook") {
      button = (
        <button className="btn btn-default m-4" onClick={fLogout}>
          Logout
        </button>
      );
    }
    let location = "Current";
    if (this.state.lat == 1.3521 && this.state.long == 103.8198) {
      location = "Singapore";
    }
    return (
      <div>
        <p className="h1 text-center font-weight-bold m-4">
          Welcome {this.state.name}
        </p>
        <p className="h5 text-center">
          The Current Weather at {location} location &#176;
          {this.state.weather}
        </p>
        <div className="text-center form-center">{button}</div>
        <div className="container" style={divStyle}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="m-2 control-label">Select Start Date:</label>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleStartChange}
                  minDate={new Date()}
                  maxDate={this.state.maxDateLimit}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="m-2 control-label">Select End Date: </label>
                <DatePicker
                  selected={this.state.endDate}
                  onChange={this.handleEndChange}
                  minDate={this.state.startDate}
                  maxDate={this.state.maxDateLimitEnd}
                  className="form-control"
                />
              </div>
              <div className="text-justify form-center">
                <button
                  id="handleSubmit"
                  className="btn btn-lg btn-primary m-4"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
              <div className="text-justify form-center">
                <button
                  className="btn btn-lg btn-secondary m-4"
                  onClick={this.handleEmailRedirection}
                >
                  Share Weather Data
                </button>
              </div>
              <div className="text-justify form-center">
                <button
                  className="btn btn-lg btn-secondary m-4"
                  onClick={this.handleActivityRedirection}
                >
                  Show My activity
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <WeatherForecast result={this.state.value} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
