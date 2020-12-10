import axios from "axios";
const { REACT_APP_API_BASE_URL, REACT_APP_API_TOKEN } = process.env;

export const fetchData = async (path) => {
  const response = await axios.get("https://dummyapi.io/data/api"+path, {
    headers: {
      "app-id": "5fc26cc1fe00c8ab121af165",
    },
  });
  return response?.data;
};