import {AppBar, TextField, Toolbar, Box, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import React, {useEffect} from "react";
import {AppIconButton} from "../../../components";
import {socket} from "../../../services/socket";
import {useAppStore} from "../../../store/app";
import useWorkSpace from "../../../hooks/workspace";

const ChatFooter = ({
  classes,
  isReplyStatus,
  setIsReplyStatus,
  setMessage,
  messageInputRef,
  handleStopTyping,
  message,
  handleMessageChange,
  msgIdToBeManaged,
  usersOption,
  setUsersOption,
  selectedUserId,
  setSelectedUserId,
}) => {
  const [state, dispatch] = useAppStore();
  const workspace = useWorkSpace();
  const getMessageDetail = () => {
    const messageDetail = workspace.messages.find(
      (msg) => msg?.messageId === msgIdToBeManaged
    );
    if (messageDetail) {
      return messageDetail;
    } else {
      return null;
    }
  };
  function sendMessage() {
    if (message === "") return;
    if (usersOption === "all") {
      let selected_user_id = selectedUserId;
      setUsersOption("recent");
      setSelectedUserId(selected_user_id);
    }
    let messageData = {};

    if (msgIdToBeManaged && isReplyStatus) {
      messageData = {
        replyMessageId: msgIdToBeManaged,
        senderId: state?.currentUser?._id,
        chatId: workspace?.channel?.chatId,
        content: message,
        senderUsername: state?.currentUser?.userName,
        replyMessageId: {
          _id: msgIdToBeManaged,
          content: getMessageDetail()?.text,
          senderUsername: getMessageDetail()?.senderUsername,
        },
      };
    } else {
      messageData = {
        senderId: state?.currentUser?._id,
        chatId: workspace?.channel?.chatId,
        content: message,
        senderUsername: state?.currentUser?.userName,
        createdAt: new Date().toLocaleDateString(),
      };
    }
    // if (reciepents.length !== 0) messageData.users = reciepents;

    try {
      socket.emit("messages:new_message", messageData);
    } catch (error) {
      console.log("error", error);
    }
    setMessage("");
    isReplyStatus && setIsReplyStatus(false);
  }

  return (
    <AppBar position="sticky" className={classes.appBarBottom}>
      <Stack direction={"column"}>
        {isReplyStatus && (
          <Box sx={{px: 3, py: 2}}>
            <Typography variant="subtitle1">
              Reply To : {getMessageDetail()?.senderUsername}{" "}
            </Typography>
            <AppIconButton
              icon={"close"}
              sx={{position: "absolute", top: 1, right: 1}}
              onClick={() => setIsReplyStatus(false)}
            />
            <Stack>
              <Typography variant="body2">
                {getMessageDetail()?.text}
              </Typography>
            </Stack>
          </Box>
        )}

        <Toolbar variant="regular" sx={{backgroundColor: "#"}}>
          {/* <AppIcon
                    onClick={(event) => openReaction(event, message?.messageId)}
                    icon={"emojidropdownicon"}
                  /> */}
          <div
            style={{
              width: "90%",
              // border: "1px solid white",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}>
            {/* <Menu
                      anchorEl={openReactionBtnRef}
                      open={openReactionDropdown}
                      onClose={closeReaction}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}>
                      <MenuItem>
                        <Picker
                          maxFrequentRows={"1"}
                          perLine={"5"}
                          navPosition={"none"}
                          previewPosition={"none"}
                          searchPosition="none"
                          theme={"dark"}
                          onEmojiSelect={(data) =>
                            handleEmojiMessageChange(data)
                          }
                        />
                      </MenuItem>
                    </Menu> */}

            <TextField
              sx={{width: "96%"}}
              // fullWidth={true}
              id="message"
              ref={messageInputRef}
              size="small"
              margin="dense"
              label="Start typing"
              // variant="standard"
              classes={{
                root: classes.input,
              }}
              value={message}
              onChange={handleMessageChange}
              onKeyUp={handleStopTyping}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  sendMessage();
                }
              }}
            />
          </div>
          <AppIconButton
            icon="send"
            onClick={sendMessage}
            className={classes.sendButton}
            // size={"small"}
          />
        </Toolbar>
      </Stack>
    </AppBar>
  );
};

export default ChatFooter;
