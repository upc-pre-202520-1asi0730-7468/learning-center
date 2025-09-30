import axios from 'axios';

const platformApi = import.meta.env.VITE_LEARNING_PLATFORM_API_URL;

export class BaseApi {
    #http;

    get http() {
        return this.#http;
    }

    constructor() {
        this.#http = axios.create({baseURL: platformApi});
    }
}