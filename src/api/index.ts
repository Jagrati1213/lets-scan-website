import Axios from "axios";

const api = Axios.create({
  baseURL: "https://lets-scan-server-production.up.railway.app",
});

export default api;
