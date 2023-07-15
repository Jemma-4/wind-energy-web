import axios from 'axios'
export var baseurl = 'http://172.20.10.3:5000/api/'
export function get(config){

    const instance=axios.create({
        method: 'get',
        baseURL: baseurl,
        timeout: 100000,
        headers: {'Content-Type': 'application/x-www-form-urlencoded',}
    })

    return instance(config)
}

export function post(config){

    const instance=axios.create({
        method: 'post',
        baseURL: baseurl,
        timeout: 100000,
        headers: {'Content-Type': 'application/json',}
    })

    return instance(config)
}
