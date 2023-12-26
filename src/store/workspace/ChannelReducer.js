function channelReducer(state, action) {
  switch (action.type) {
    case "CHANGE_CHANNEL":
      return {
        name: action.payload.name,
        chatId: action.payload.id,
        chatName: action.payload.chatName,
      };
    default:
      return state;
  }
}

export default channelReducer;
