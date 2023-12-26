import {api} from "..";
import {fakeApiResponse} from "../auth/utils";

async function getRecentUsersListByAxios() {
  try {
    const res = Number(process.env.REACT_APP_MULTIPASS)
      ? fakeApiResponse()
      : await api?.axios?.get("/chats/chatHistory");
    const {data} = res;

    return data;
  } catch (error) {
    throw error;
  }
}

async function getAllUsersListByAxios(payload) {
  try {
    const res = Number(process.env.REACT_APP_MULTIPASS)
      ? fakeApiResponse()
      : await api?.axios?.post("/users/list", payload);
    const {data} = res;
    return data;
  } catch (error) {
    throw error;
  }
}

export {getRecentUsersListByAxios, getAllUsersListByAxios};
