import {
  Avatar,
  AvatarGroup,
  ListItem,
  ListSubheader,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {Box, Stack} from "@mui/system";
import React, {useState} from "react";
import {AppIcon, AppIconButton} from "../../components";
import {useAppStore} from "../../store/app";
import Picker from "@emoji-mart/react";
import useWorkSpace from "../../hooks/workspace";
import {socket} from "../../services/socket";

const Message = ({
  message,
  index,
  //   openReactionBtnRef,
  //   openReactionDropdown,
  //   setOpenReactionBtnRef,
  handleReplyMessage,
  messageSeenUsers,
  //   closeMessageOptionDropdown,
  setmessageOptionsBtnRef,
  //   handleDeleteMessage,
  messageOptionsBtnRef,
  handleOpenUsersSeenModal,
  setMsgIdToBeManaged,
  msgIdToBeManaged,
  openMessageOptionDropdown,
}) => {
  const [state] = useAppStore();
  const [openReactionBtnRef, setOpenReactionBtnRef] = useState(null);
  const open = Boolean(messageOptionsBtnRef);
  const workspace = useWorkSpace();
  const openReactionDropdown = Boolean(openReactionBtnRef);
  const openReaction = (event, msgid) => {
    // console.log(msgid);
    setMsgIdToBeManaged(msgid);
    setOpenReactionBtnRef(event.currentTarget);
  };
  const closeReaction = () => {
    setOpenReactionBtnRef(null);
  };
  const handleSelectedEmoji = (reaction, messageId) => {
    // console.log(reaction);
    const payload = {
      senderId: state?.currentUser?._id,
      reactionContent: reaction?.native,
      chatId: workspace?.channel?.chatId,
      messageId: msgIdToBeManaged,
    };
    console.log(payload);
    socket.emit("message:new_reaction", payload);
    setOpenReactionBtnRef(null);
  };
  const closeMessageOptionDropdown = () => {
    setmessageOptionsBtnRef(null);
    setMsgIdToBeManaged("");
  };

  const handleDeleteMessage = () => {
    if (!msgIdToBeManaged) return;
    try {
      socket.emit("messages:delete_message", {
        chatId: workspace?.channel?.chatId,
        messageId: msgIdToBeManaged,
      });
    } catch (error) {
      console.log(error);
    } finally {
      closeMessageOptionDropdown();
    }
  };
  return (
    <React.Fragment>
      {index === 0 && false && (
        <ListSubheader
          className={classes.subheader}
          sx={{borderBottom: "1px solid lightslategray"}}>
          {new Date(message?.createdAt).toLocaleDateString() ===
          new Date().toLocaleDateString()
            ? "Today"
            : new Date(message?.createdAt).toLocaleDateString()}
        </ListSubheader>
      )}
      <ListItem
        id={message?.messageId}
        sx={{
          alignSelf:
            message?.senderId !== state?.currentUser?._id
              ? "flex-start"
              : "flex-end",
          backgroundColor:
            message?.senderId !== state?.currentUser?._id
              ? !state.darkMode
                ? "#B9DCCB"
                : "#383838"
              : !state.darkMode
                ? "#FFFFFF"
                : "#335433",

          mr: "0px",
          display: "flex",
          flexDirection: "column",
          p: "0px",
          maxWidth: "280px",
          width: "100%",
          boxShadow:
            "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;",
          borderRadius: "5px",
          breakWord: "break",
          color:
            !state?.darkMode && message?.senderId !== state?.currentUser?._id
              ? ""
              : "",
        }}>
        {message?.replyMessage?._id && (
          <ListSubheader
            sx={{
              backgroundColor: `${
                state.darkMode && message.senderId !== state.currentUser._id
                  ? "#406051"
                  : "#383838"
              }`,
              borderRadius: "5px",
              display: "flex",
              borderLeft: "1px solid #4EAD6D",
              // border: "1px solid",
              width: "90%",
              padding: "10px 10px",
              margin: "7px",
            }}>
            {/* {console.log("MESSAGE REP", message)} */}
            <Stack direction={"column"}>
              <Typography variant="subtitle1">
                {message?.replyMessage?.sender?.userName
                  ? message?.replyMessage?.sender?.userName
                  : message.replyMessage.senderUsername}
                {/* // ? message?.replyMessage?.senderUsername
                  // : message?.replyMessage */}
              </Typography>
              <Typography variant="body2">
                {message?.replyMessage.content}
              </Typography>
            </Stack>
          </ListSubheader>
        )}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            p: 1,
            flexGrow: 1,
          }}>
          <AppIconButton
            icon={"more"}
            sx={{position: "absolute", top: 0, right: 1}}
            size={"small"}
            onClick={(event) =>
              openMessageOptionDropdown(event, message?.messageId)
            }
          />
          {/* message options */}
          <Menu
            id="basic-menu"
            anchorEl={messageOptionsBtnRef}
            open={open}
            onClose={closeMessageOptionDropdown}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem color="danger" divider onClick={handleDeleteMessage}>
              <AppIcon
                icon="delete"
                fontSize={"small"}
                color={"error"}
                name={"Delete"}
                sx={{mr: 1}}
              />{" "}
              Delete
            </MenuItem>
            <MenuItem onClick={handleReplyMessage}>
              <AppIcon
                icon="reply"
                fontSize={"small"}
                color={"primary"}
                name={"Reply"}
                sx={{mr: 1}}
              />{" "}
              Reply
            </MenuItem>
          </Menu>
          <Typography
            variant={"subtitle1"}
            color={"default"}
            sx={{fontWeight: "bolder"}}>
            {message?.senderId === state?.currentUser?._id
              ? "You"
              : message?.senderUsername}
          </Typography>
          <Typography
            variant={"body1"}
            sx={{
              alignSelf: "flex-start",
              wordBreak: "break-all",
              fontStyle: message?.isDeleted ? "italic" : "",
              fontSize: "16px",
            }}>
            {message?.text}
          </Typography>
          <Typography
            variant={"body2"}
            sx={{alignSelf: "flex-end", fontSize: "10px"}}>
            {message.createdAt}
          </Typography>
          {message?.messageReaction?.map(
            (reaction) => reaction.reactionContent
          )}
          <Menu
            anchorEl={openReactionBtnRef}
            open={openReactionDropdown}
            onClose={closeReaction}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem>
              <Picker
                style={{
                  maxHeigth: "20%",
                  overflow: "auto",
                }}
                set="emojione"
                emojisize={24}
                showPreview={false}
                showSkinTones={false}
                maxFrequentRows={"1"}
                sheetSize={16}
                // perLine={"2"}
                // dynamicWidth={true}
                // navPosition={"none"}
                previewPosition={"none"}
                // searchPosition="none"
                theme={"dark"}
                onEmojiSelect={(data) =>
                  handleSelectedEmoji(data, message?.messageId)
                }
              />
            </MenuItem>
          </Menu>
          {message.senderId !== state.currentUser._id && (
            <AppIconButton
              name={"emojipicker"}
              sx={{position: "absolute", top: 0, right: -34}}
              size={"small"}
              // onMouseOver={(event) =>
              //   openReaction(event, message?.messageId)
              // }
              // onMouseOut={() => setOpenReactionBtnRef(null)}
              onClick={(event) => openReaction(event, message?.messageId)}
              icon={"emojidropdownicon"}
            />
          )}
          {/* message seen info for group chat */}
          {messageSeenUsers &&
            index === workspace?.messages.length - 1 &&
            workspace?.messages[index]?.senderId ===
              state?.currentUser?._id && (
              <AvatarGroup
                sx={{alignSelf: "flex-start", cursor: "pointer"}}
                onClick={handleOpenUsersSeenModal}
                max={3}>
                {Array.isArray(messageSeenUsers) &&
                  messageSeenUsers.map((user) => (
                    <Avatar
                      sizes={"small"}
                      alt={user?.userName}
                      src={user?.profileImage}
                    />
                  ))}
              </AvatarGroup>
            )}
        </Box>
      </ListItem>
    </React.Fragment>
  );
};

export default Message;
