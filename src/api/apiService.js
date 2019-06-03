const API_URL = 'http://localhost:4200';
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

export class APIService{

    constructor(){
    }

    getEquipements() {
        const url = `${API_URL}/api/equipements/`;
        return Vue.http.get(url).then(response => response.data);
    }

    getRooms() {
        const url = `${API_URL}/api/rooms/`;
        return Vue.http.get(url).then(response => response.data);
    }

    searchRoom(search){
        const url = `${API_URL}/api/rooms/search`;
        return Vue.http.post(url, search).then(response => response.data);
    }

    bookRoom(body){
        const url = `${API_URL}/api/rooms/booking/add`;
        return Vue.http.post(url, body).then(response => response.data);
    }

}