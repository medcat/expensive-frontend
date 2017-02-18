import React from "react";
import moment from "moment";

export default class ShortExpenseList extends React.Component {
  render() {
    return (
      <ul className="dashboard-expenses-list">
        {_.map(this.props.data, (e) => this.renderExpense(e))}
      </ul>
    );
  }

  renderExpense(expense) {
    let time = moment(expense.time);
    let description = expense.description || "\u00a0"
    return (
      <li key={expense.id} className="dashboard-expenses-item">
        <span className="dashboard-expenses-item-amount">{expense.amountString}</span>
        <span className="dashboard-expenses-item-description">{description}</span>
        <time className="dashboard-expenses-item-datetime"
          dateTime={time.format()} name={time.format("LLLL")}
          >{time.fromNow()}</time>
      </li>
    );
  }
}

ShortExpenseList.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}
