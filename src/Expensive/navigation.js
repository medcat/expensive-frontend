import {browserHistory, hashHistory} from "react-router";

let navigation = {
  get history() {
    return process.env.NODE_ENV == "production" ? browserHistory : hashHistory;
  },

  addQuery(query) {
    const location = _.assign({}, this.history.getCurrentLocation())
    _.assign(location.query, query);
    this.history.push(location);
  },

  removeQuery(...names) {
    const location = _.assign({}, this.history.getCurrentLocation());
    _.each(names, q => delete location.query[q]);
    this.history.push(location);
  }
}

export {navigation};
