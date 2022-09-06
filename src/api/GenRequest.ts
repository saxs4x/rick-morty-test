import axios, {Method, AxiosResponse} from "axios";
import {Data} from "../types/Types";

const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
})

const request = <T>(method: Method, url: string, params: any):
    Promise<AxiosResponse<Data>> => {
    return api.request<Data>({
        method,
        url,
        params
    })
}


export default request;
