import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://embedded-c-stm32-web-react-default-rtdb.europe-west1.firebasedatabase.app/",
});

export default instance;
