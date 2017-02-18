let server = {
  get defaultCurrency() { return "USD"; },

  _checkStatus(response) {
    if(response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return Promise.reject(response);
    }
  },

  _getContentType(response) {
    console.log(response);
    const rawContentType = response.headers.get("Content-Type");
    return rawContentType ? rawContentType.split(";")[0] : "text/plain";
  },

  _parseJsonResponse(response) {
    const contentType = this._getContentType(response);
    if(response && response.json && contentType == "application/json") {
      return response.json().then((data) => { return {data, response} });
    } else {
      return Promise.resolve({data: {}, response});
    }
  },

  _logAllRequests(value) {
    console.info(value);
    return value;
  },

  _logFailingRequest(response) {
    const contentType = this._getContentType(response);
    if(response && response.json && contentType == "application/json") {
      return response.json().then((data) => {
        console.warn("Request failed!");
        console.warn(response);
        return Promise.reject({data, response});
      });
    } else {
      return Promise.reject({data: {}, response});
    }
  },

  _modifyHeaders(headers) {
    return _.assign({}, headers, { "Content-Type": "application/json" });
  },

  performGet(path, headers = {}) {
    headers = this._modifyHeaders(headers);
    return fetch(path, { headers })
      .then(this._checkStatus.bind(this))
      .then(this._parseJsonResponse.bind(this))
      .then(this._logAllRequests.bind(this))
      .catch(this._logFailingRequest.bind(this));
  },

  performPost(path, data, headers = {}) {
    let body = JSON.stringify(data);
    headers = this._modifyHeaders(headers);

    return fetch(path, { method: "POST", body, headers })
      .then(this._checkStatus.bind(this))
      .then(this._parseJsonResponse.bind(this))
      .then(this._logAllRequests.bind(this))
      .catch(this._logFailingRequest.bind(this));
  },

  performPut(path, data, headers = {}) {
    let body = JSON.stringify(data);
    headers = this._modifyHeaders(headers);

    return fetch(path, { method: "PUT", body, headers })
      .then(this._checkStatus.bind(this))
      .then(this._parseJsonResponse.bind(this))
      .then(this._logAllRequests.bind(this))
      .catch(this._logFailingRequest.bind(this));
  },

  performDelete(path, headers = {}) {
    headers = this._modifyHeaders(headers);

    return fetch(path, { method: "DELETE", headers })
      .then(this._checkStatus.bind(this))
      .then(this._parseJsonResponse.bind(this))
      .then(this._logAllRequests.bind(this))
      .catch(this._logFailingRequest.bind(this));
  }
}

export {server};
