export const getImage = (img) => {
  if (img !== undefined) {
    return `http://192.168.100.07:3011/${img}`;
  }
};
export const getDetails = (usersOption, channel) => {
  // console.log(channel);
  if (usersOption === "recent") {
    return {
      userName:
        channel?.isChatType === "private"
          ? channel?.users[0]?.userName
          : channel?.chatName || "No Name",
      profileImage:
        channel?.isChatType === "private"
          ? getImage(channel?.users[0]?.profileImage)
          : getImage(channel?.chatProfile),
    };
  } else {
    return {
      userName: channel?.userName,
      profileImage: getImage(channel?.profileImage),
    };
  }
};
