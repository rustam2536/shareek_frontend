// src/services/apiService.js
import axios from "axios";
import { baseUrl } from "../enum/enum";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: baseUrl,
});

// Request Interceptor to attach token/sessionId
api.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem("userAuth");

        console.log(auth, "auth");

        if (auth) {
            const userAuth = JSON.parse(auth);
            if (userAuth) {
                config.headers["Authorization"] = `Bearer ${userAuth.token}`;
                config.headers["sessionId"] = userAuth.sessionId;
            }
        }

        console.log(config, "config");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        if (
            response.data &&
            response.data.success === false &&
            response.data.message?.includes("Session expired")
        ) {
            toast.error(response.data.message);

            // Clear localStorage or auth
            localStorage.setItem("userAuth", JSON.stringify(''));

            // Optionally reject to stop further use
            return Promise.reject(new Error("Session expired"));
        }

        if (response.data.message?.includes('Token not found.')) {
            toast.error('Session expired, please login again');
            localStorage.setItem("userAuth", JSON.stringify(''));
        }

        return response;
    },
    (error) => {
        // Only catches true network or 4xx/5xx errors
        console.log(error.response, "error.response");
        return Promise.reject(error);
    }
);

export default api;
