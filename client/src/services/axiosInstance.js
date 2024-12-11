import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // This will leverage the proxy in package.json
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
