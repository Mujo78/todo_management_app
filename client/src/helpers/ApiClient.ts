import axios from "axios";

const baseURL = "https://localhost:7196/";

export const apiClientBase = axios.create({ baseURL });
export const apiClient = axios.create({ baseURL: baseURL + "api/v1/" });
export const apiClientAuth = axios.create({ baseURL: baseURL + "api/v1/" });

apiClientAuth.interceptors.request.use(
  (config) => {
    const userInStorage = localStorage.getItem("user");
    const user = userInStorage && JSON.parse(userInStorage);

    if (user) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
