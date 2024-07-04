import { JSONObject } from "./definations";

let data : JSONObject | null = null;
export const setSelected = (obj: JSONObject | null) => {
    data = obj;
}

export const getSelected = () => {
    return data;
}