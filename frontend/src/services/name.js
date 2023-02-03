import http from "../http-common";

class NameDataService {
    find(query, by = "name", query2 = null, by2 = null) {
        if (query2) {
            return http.get(`?${by}=${query}&${by2}=${query2}`);
        } else {
            return http.get(`?${by}=${query}`);
        }
        
    }

    findCurve(query, by = "name", query2 = null, by2 = null) {
        if (query2) {
            return http.get(`/similar?${by}=${query}&${by2}=${query2}`);
        } else {
            return http.get(`/similar?${by}=${query}`);
        }
        
    }
}

export default new NameDataService();