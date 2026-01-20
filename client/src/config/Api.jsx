import axios from "axios";

const axiosInstance = axios.create({
    // baseURL:"http://localhost:4500",
    baseURL:"http://192.168.0.141:4500",
    withCredentials:true,
})

export default axiosInstance;