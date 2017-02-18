import React from "react";

export default class Failure extends React.Component {
  render() {
    return (
      <div className="dashboard-fail">
        Oops, that's embarassing...  There was an error.  Maybe try again?
      </div>
    );
  }
}
