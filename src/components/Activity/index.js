import React from "react";

import { connect } from "react-redux";
import { selectActivity } from "../../actions";
import Home from "../Home/Home";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      date: new Date(),
      homeRedirect: false,
      emailAddress:
        this.props.location.state == undefined ||
        "" ||
        this.props.location.state.email == ""
          ? localStorage.getItem("emailAddress")
          : this.props.location.state.email
    };
  }

  handleTitleChange = event => {
    this.setState({ title: event.target.value });
    console.log(this.state.title);
  };

  handleDesChange = event => {
    this.setState({ description: event.target.value });
  };

  handleDateChange = event => {
    this.setState({ date: event.target.value });
  };
  backHome = () => {
    this.setState({ homeRedirect: true });
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
      <div className="col-md-6 col-md-offset-3">
        <h2>Activity</h2>

        <div className="form-group">
          <label htmlFor="Title">Title</label>
          <input
            type="text"
            className="form-control"
            name="Title"
            onChange={this.handleTitleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Description</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            onChange={this.handleDesChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Date</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={this.handleDateChange}
          />
        </div>

        <div className="text-center form-center">
          <button
            id="handleSubmit"
            className="btn btn-lg btn-primary m-4"
            onClick={() =>
              this.props.selectActivity(
                this.state.emailAddress,
                this.state.title,
                this.state.description,
                this.state.date
              )
            }
          >
            Add
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

const mapStateToProps = state => {
  console.log(state);
  return { activityList: state.activityList };
};
export default connect(
  mapStateToProps,
  {
    selectActivity
  }
)(Activity);
