import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:4500",
    // baseURL:"https://cravings-food.onrender.com",
    withCredentials:true,
})

export default axiosInstance;