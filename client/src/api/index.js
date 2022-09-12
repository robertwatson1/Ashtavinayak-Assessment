import axios from "axios"
import { SERVER_URL } from "../config"

const axiosInstance = axios.create({
    baseURL: SERVER_URL
});

export default axiosInstance