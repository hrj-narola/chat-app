import React, {createContext, useReducer} from "react";
import messageReducer from "./MessageReducer";
import channelReducer from "./ChannelReducer";
import callDetailsReducer from "./CallDetailsReducer";

const CHANNEL_INIT_STATE = {
  name: "Public",
  chatId: "",
};

const CALL_DETAILS_STATE = {
  chatType: "",
  callRoomId: "",
  chatName: "",
  callType: "",
  chatId: "",
  callerDetails: [],
  offer: "",
  users: [
    {
      userName: "",
      userId: "",
      callingStatus: "",
    },
  ],
};
export const WorkSpaceContext = createContext();

export const WorkSpaceProvider = ({children}) => {
  const [messageState, messageDispatch] = useReducer(messageReducer, []);
  const [channel, channelDispatch] = useReducer(
    channelReducer,
    CHANNEL_INIT_STATE
  );
  const [callDetails, callDetailsDispatch] = useReducer(
    callDetailsReducer,
    CALL_DETAILS_STATE
  );
  return (
    <WorkSpaceContext.Provider
      value={{
        messageState: messageState ? messageState : [],
        messageDispatch,
        channel,
        channelDispatch,
        callDetails: callDetails ? callDetails : [],
        callDetailsDispatch,
      }}>
      {children}
    </WorkSpaceContext.Provider>
  );
};
