import {AppBar, Avatar, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import React from "react";
import {getDetails} from "../../../utils/getDetails";
import {AppIconButton} from "../../../components";

const ChatHeader = ({
  classes,
  usersOption,
  currentChatDetails,
  workspace,
  handleOpenManageGroupModal,
  typingInfo,
  handleCallUser,
}) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        flexDirection: "row",
        // width: "100%",
        left: "280px",
        height: "80px",
        color: "white",
        backgroundColor: "rgba(0, 0, 10, 0.8)",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      // className={classes.appBarTop}
    >
      <Stack
        width={"50%"}
        direction={"row"}
        alignItems={"center"}
        sx={{
          padding: "20px",
          display: "flex",
        }}>
        <Avatar
          sx={{
            marginLeft: "30px",
            fontSize: "3rem",
          }}
          alt={getDetails(usersOption, currentChatDetails)?.userName}
          // alt={fullName || "User Avatar"}
          src={getDetails(usersOption, currentChatDetails)?.profileImage}
        />
        <Stack sx={{marginLeft: "30px", fontWeight: "bold"}}>
          <Typography variant="h6">
            {workspace?.channel?.chatName}
            {/* {console.log(typingInfo)} */}
            {/* {fullName || 'Current User'} */}
          </Typography>
          <Typography>
            {workspace?.channel?.chatId}
            {typingInfo.findIndex(
              (user) => user.chatId === workspace.channel.chatId
            ) !== -1
              ? `typing`
              : ""}
          </Typography>
        </Stack>
      </Stack>
      <Stack sx={{display: "flex", flexDirection: "row"}}>
        <AppIconButton
          icon={"audiocallicon"}
          sx={{m: 2}}
          size={"small"}
          color={"primary"}
          onClick={() => handleCallUser("audioCall")}
        />
        <AppIconButton
          icon={"videocallicon"}
          sx={{m: 2}}
          size={"small"}
          onClick={() => handleCallUser("videoCall")}
          color={"primary"}
        />
        {workspace?.channel?.name === "group" && (
          <AppIconButton
            icon={"more"}
            sx={{
              position: "",
              right: 1,
              top: 1,
              fontWeight: "bold",
              m: 2,
            }}
            size={"small"}
            color={"primary"}
            onClick={(event) => {
              event.stopPropagation();
              handleOpenManageGroupModal(workspace?.channel);
            }}
          />
        )}
      </Stack>
    </AppBar>
  );
};

export default ChatHeader;
