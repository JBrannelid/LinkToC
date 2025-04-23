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
    },

    refreshToken: async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                throw new Error("No token available");
            }

            return await axiosConfig.post(`${ENDPOINTS.AUTH}/refresh-token`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Token refresh failed:", error);
            throw error;
        }
    },
    
    logout: async (token) => {
        try {
            if(!token) return true;
            
            return await axiosConfig.post(`${ENDPOINTS.AUTH}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }catch(error) {
            console.error("Logout reguest failed:", error);
            return true;
        }
    }
}; 


export default authService;