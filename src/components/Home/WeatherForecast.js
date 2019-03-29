import React from "react";

const WeatherForecast = props => {
  const r = props.result;
  if (r == "") {
    return (
      <div>
        <p className="h3 text-center font-weight-bold m-4">
          Select Dates to know the Weather Forecast up to 6 days
        </p>
      </div>
    );
  } else {
    const resu = props.result.map(res => {
      return (
        <ul className="list-group">
          <li className="list-group-item m-2">&#176;{res}</li>
        </ul>
      );
    });
    return <div>{resu}</div>;
  }
};

export default WeatherForecast;
