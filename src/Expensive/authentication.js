import jwtDecode from "jwt-decode";
import {server} from "Expensive/server";

let authentication = {
  hasToken() {
    return !!this.token;
  },

  authorizationHeader() {
    return { "Authorization": `Bearer ${this.token}` };
  },

  performAuthorizedGet(path, headers = {}) {
    if(!this.hasToken()) { return Promise.reject(new Error("No token!")); }
    let actualHeaders = Object.assign({}, headers, this.authorizationHeader());
    return server.performGet(path, actualHeaders);
  },

  performAuthorizedPost(path, data, headers = {}) {
    if(!this.hasToken()) { return Promise.reject(new Error("No token!")); }
    let actualHeaders = Object.assign({}, headers, this.authorizationHeader());
    return server.performPost(path, data, actualHeaders);
  },

  renewToken() {
    if(!this.hasToken()) { return Promise.reject(false); }
    return server
        .performGet("api/session/renew.json", this.authorizationHeader())
        .catch(() => this.clearToken());
  },

  attemptRegistration(email, password, confirmation) {
    let data = { user: { email, password,
      password_confirmation: confirmation } };
    return server
        .performPost("/api/users.json", data)
        .then(({data}) => this.token = data.token);
  },

  attemptLogin(email, password) {
    let data = { session: { email, password } };
    return server
        .performPost("/api/session.json", data)
        .then(({data}) => this.token = data.token);
  },

  clearToken() {
    if(window.localStorage) {
      localStorage.removeItem("token");
    }

    delete this._token;
    delete this._tokenData;
  },

  get tokenData() {
    this._tokenData = this._tokenData || jwtDecode(this.token) || {};
    return this._tokenData;
  },

  set token(token) {
    if(window.localStorage) { localStorage.setItem("token", token); }
    this._token = token;
  },

  get token() {
    return this._token ||
      (window.localStorage && window.localStorage.getItem("token"));
  }
};

export {authentication};
