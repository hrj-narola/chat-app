import {Box} from "@mui/system";
import React from "react";
import {AppIconButton} from "../../components";
import {Avatar, AvatarGroup} from "@mui/material";

const MessageBox = (
  message,
  openMessageOptionDropdown,
  messageOptionsBtnRef,
  closeMessageOptionDropdown,
  handleDeleteMessage,
  handleReplyMessage,
  handleOpenUsersSeenModal
) => {
  return (
    <div>
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
        {message?.messageReaction?.map((reaction) => reaction.reactionContent)}
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
                // width: "400px",
                maxHeigth: "20%",
                overflow: "auto",
                // resize: "horizontal",
              }}
              maxFrequentRows={"1"}
              // perLine={"2"}
              sheetSize={16}
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
          workspace?.messages[index]?.senderId === state?.currentUser?._id && (
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
    </div>
  );
};

export default MessageBox;
