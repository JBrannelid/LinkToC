import createBaseService from "./baseService.js";
import {ENDPOINTS}  from "./endpoints.js";
import axiosConfig from "../config/axiosConfig.js";

const baseService = createBaseService(ENDPOINTS.AUTH);

const authService  = {
    ...baseService,
    // Login: POST /api/auth/login
    login: async (loginData) => {
        if (!loginData || !loginData.email || !loginData.password) {
            throw new Error("Email and password are required");
        }
        return await axiosConfig.post(`${ENDPOINTS.AUTH}/login`, loginData);
    },

    // Register: POST /api/auth/register
    register: async (registerData) => {
        if (!registerData) {
            throw new Error("Registration data is required");
        }
        return await axiosConfig.post(`${ENDPOINTS.AUTH}/register`, registerData);
    }
}; 


export default authService;