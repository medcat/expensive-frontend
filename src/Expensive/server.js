let server = {
  _checkStatus(response) {
    if(response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return Promise.reject(response);
    }
  },

  _parseJsonResponse(response) {
    return response.json().then((data) => { return {data, response} });
  },

  _logFailingRequest(response) {
    return response.json().then((data) => {
      console.warn("Request failed!");
      console.warn(response);
      return Promise.reject({data, response});
    });
  },

  _logAllRequests(v) {
    console.log(v);
    return v;
  },

  _modifyHeaders(headers) {
    return Object.assign({}, headers, { "Content-Type": "application/json" });
  },

  performGet(path, headers = {}) {
    headers = this._modifyHeaders(headers);
    return fetch(path, { headers })
      .then(this._checkStatus)
      .then(this._parseJsonResponse)
      .then(this._logAllRequests)
      .catch(this._logFailingRequest);
  },

  performPost(path, data, headers = {}) {
    let body = JSON.stringify(data);
    headers = this._modifyHeaders(headers);

    return fetch(path, { method: "POST", body, headers })
      .then(this._checkStatus)
      .then(this._parseJsonResponse)
      .then(this._logAllRequests)
      .catch(this._logFailingRequest);
  },

  performDelete(path, data, headers = {}) {
    let body = JSON.stringify(data);
    headers = this._modifyHeaders(headers);

    return fetch(path, { method: "DELETE", body, headers })
      .then(this._checkStatus)
      .then(this._parseJsonResponse)
      .then(this._logAllRequests)
      .catch(this._logFailingRequest);
  }
}

export {server};
