import Axios from "axios";

const api = Axios.create({
  baseURL: "https://orderminder-server.onrender.com",
});

export default api;
