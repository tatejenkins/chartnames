import axios from "axios";

let url;
if (process.env.NODE_ENV === "production") {
    url = "http://localhost:10000/api/v1/names";
} else {
    url = "http://localhost:5000/api/v1/names";
}

export default axios.create({
    baseURL: url,
    headers: {
        "Content-type": "application/json"
    }
});