import axios from "axios";

const SERVER_URL = "http://localhost:3005";

class FetchApi {
  constructor() {
    this.authData = null;
    this.userData = null;
  }

  async fetchAuth() {
    return axios
      .get(SERVER_URL + "/login")
      .then((response) => {
        this.authData = response.data;
      })
      .catch((err) => console.error(err));
  }
  async fetchData(code) {
    return axios.get(SERVER_URL + "/callback/" + code).then((response) => {
      this.userData = response.data;
    });
  }

  getUserData() {
    return this.userData;
  }
  getAuthData() {
    return this.authData;
  }
}
export default new FetchApi();
