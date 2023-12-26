function messageReducer(state = [], action) {
  switch (action.type) {
    case "ADD_MESSAGE":
      if (Array.isArray(action.payload)) {
        return [...state, ...action.payload];
      } else {
        return [...state, action.payload];
      }
    case "ADD_MESSAGES":
      if (Array.isArray(action.payload)) {
        return [...action.payload, ...state];
      } else {
        return [action.payload, ...state];
      }
    case "UPDATE_MESSAGE":
      console.log(action.payload);
      const messageObj = Array.isArray(state)
        ? state.map((msg) => {
            return msg?.messageId === action.payload.messageId
              ? {
                  ...msg,
                  ...action.payload,
                }
              : {...msg};
          })
        : [];
      return [...messageObj];
    case "LOAD_MESSAGES":
      return [...action.payload];
    default:
      return state;
  }
}

export default messageReducer;
