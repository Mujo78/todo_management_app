import axios from "axios";

const baseURL = "https://localhost:7196/";

export const apiClientBase = axios.create({ baseURL });
export const apiClient = axios.create({ baseURL: baseURL + "api/v1/" });
export const apiClientAuth = axios.create({ baseURL: baseURL + "api/" });

apiClientAuth.interceptors.request.use(
  (config) => {
    const userInStorage = localStorage.getItem("auth");

    if (userInStorage) {
      config.headers.Authorization = `Bearer ${userInStorage}`;
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

async function RefreshAccessTokenFn() {
  const res = await apiClientAuth.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}

apiClientAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await RefreshAccessTokenFn();
        localStorage.setItem("auth", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClientAuth(originalRequest);
      } catch (error) {
        localStorage.removeItem("auth");
        window.location.href = "/";
      }
    }
  }
);
