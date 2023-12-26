import {socket} from "..";
import axiosInstance from "../../axios";

export function addMessage(dispatch, data) {
  axiosInstance
    .post("/messages/add_message", {
      channelId: data.channelId,
      text: data.text,
      user: {
        user_id: data.user.userID,
        username: data.user.username,
      },
    })
    .then((res) => {
      dispatch({
        type: "ADD_MESSAGE",
        payload: res.data.message[0],
      });
    })
    .catch((e) => {
      throw e;
    });
}

export const connectToRooms = async () => {
  try {
    const res = await fethAllChannelIDs();
    const chatIDs = res?.data?.data || [];
    const chatIDsArr = chatIDs.map((chatIdObj) => chatIdObj["chatId"]);
    socket.emit("chats:join_chat", chatIDsArr);
  } catch (error) {
    console.log("error>>", error);
  }
};

export async function fethAllChannelIDs() {
  try {
    const res = axiosInstance.get("/chats/getAllChatId");
    return res;
  } catch (error) {
    throw error;
  }
}
