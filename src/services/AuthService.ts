import { UserType } from "../models/User";
import axios from "../utils/axiosConfig";
import Cookies from "js-cookie";


function setAuthorizationBearer() {
  const token = Cookies.get("jwt"); 
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
  }
}


setAuthorizationBearer();

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // if (error.response.status === 401) {
    //   window.location.href = "/authForm"; 
  
    // }
    return Promise.reject(error);
  }
);

export default {
  logout:async () => {
 await axios.post("/auth/logout",{}, { withCredentials: true });
},

  register: async (userData: Partial<UserType>) => {
    const res = await axios.post("/auth/register", { Email: userData.email, Password: userData.password  }, { withCredentials: true });
    return res.data;
  },

  login: async (userData: Partial<UserType>) => {
    const res = await axios.post("/auth/login", { Email: userData.email, Password: userData.password }, { withCredentials: true });
    return res.data;
  },

  checkAuth: async () => {
    const response = await axios.get(`/auth/checkAuth`, {
      withCredentials: true, 
    });
   
    return response.data;
  },
};
