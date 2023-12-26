function callDetailsReducer(state, action) {
  switch (action.type) {
    // case "MAKE_CALL":
    //   return {
    //     callType: action.payload.callType,
    //     callerDetails: action.payload.callerDetails,
    //     users: action.payload.users,
    //     chatId: action.payload.chatId,
    //   };
    case "MAKE_CALL":
      return {
        chatType: action.payload.chatType,
        callType: action.payload.callType,
        chatName: action.payload.chatName,
        chatId: action.payload.chatId,
        callerDetails: action.payload.callerDetails,
        callRoomId: action.payload.callRoomId,
        offer: action.payload.offer,
        users: action.payload.users
          ? action.payload.users?.map((user) => {
              return {
                userName: user.userName,
                userId: user._id,
                callingStatus: "calling",
              };
            })
          : [],
      };
    case "REJECT_CALL":
      // console.log("state", state);
      // console.log("PAYLOSsdfs", action.payload);
      const movedIndex = state.users.findIndex(
        (user) => user.userId === action.payload.user.userId
      );
      let movedEle = state.users.splice(movedIndex, 1);
      const updatedUser = {
        userId: action.payload.user.userId,
        userName: action.payload.user.userName,
        callingStatus: "Rejected",
      };
      movedEle[0] = updatedUser;
      state.users.splice(0, 0, movedEle[0]);
      return {...state};

    case "ACCEPT_CALL":
      const moved = state.users.findIndex(
        (user) => user.userId === action.payload.user.userId
      );
      let movedElement = state.users.splice(moved, 1);
      const newUser = {
        userId: action.payload.user.userId,
        userName: action.payload.user.userName,
        callingStatus: "Accepted",
      };
      movedElement[0] = newUser;
      state.users.splice(0, 0, movedElement[0]);
      return {...state};
    default:
      return state;
  }
}

export default callDetailsReducer;
