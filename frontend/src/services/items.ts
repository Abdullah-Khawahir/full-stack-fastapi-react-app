import {backendFetch} from '../Config'
export function getAllItems(){
    return backendFetch('/items')
}
