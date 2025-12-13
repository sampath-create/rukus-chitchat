import axios from 'axios';
export const axiosInstance = axios.create({
    baseUrl : import.meta.emv.MODE === "development" ? "http:localhost:5173/api" : "/api",
    withcredentials : true,
    
})