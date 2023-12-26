import {
  Avatar,
  Badge,
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {AppButton, AppIconButton} from "../../components";
import {Stack} from "@mui/system";
import styled from "@emotion/styled";
import Tag from "../../components/AppTag/AppTag";
import {useAppStore} from "../../store/app";
import {getDetails, getImage} from "../../utils/getDetails";

const StyledBadge = styled(Badge)(({theme}) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ListView = ({
  listHeaderText,
  data,
  selectedChannel,
  onClick,
  handleSwitchUsersOption,
  usersOption,
  handleOpenCreateGroupModal,
  onlineUsers,
  handleOpenManageGroupModal,
  handleSearchUserInputChange,
  typingInfo,
}) => {
  const [state] = useAppStore();

  // const handleSearchUserInputChange = (event) => {
  //   // console.log(event.target.value);
  //   // setFilter(() => {
  //   //   const copyObj = JSON.parse(JSON.stringify(filter));
  //   //   return {
  //   //     ...copyObj,
  //   //     query: {
  //   //       ...copyObj.query,
  //   //       search: {
  //   //         keys: ["users"],
  //   //         value: event.target.value,
  //   //       },
  //   //     },
  //   //   };
  //   // });
  //   setSearchAllUsers(() => {
  //     const copyObj = JSON.parse(JSON.stringify(searchAllUsers));
  //     return {
  //       ...copyObj,
  //       query: `${event.target.value}`,
  //     };
  //   });
  // };
  const isGroup = (channel) => {
    return channel?.isChatType === "group";
  };

  return (
    <List
      component="nav"
      aria-labelledby="channel-List"
      subheader={
        <ListSubheader component="div" id="nested-list-channels">
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography>{listHeaderText}</Typography>
            </Grid>
            <Grid item>
              <AppButton
                size={"small"}
                color={"secondary"}
                // icon={state.darkMode ? 'lightmode' : 'darkmode'}
                text={usersOption === "recent" ? "All Users" : "Recent Users"}
                onClick={handleSwitchUsersOption}
              />
            </Grid>
            <Grid item alignSelf={"flex-start"}>
              <AppIconButton
                size={"lg"}
                color={"default"}
                icon={"addgroup"}
                title={"Create Group"}
                onClick={handleOpenCreateGroupModal}
              />
            </Grid>
          </Grid>
          <Box sx={{display: "flex", alignItems: "flex-end", margin: "10px 0"}}>
            {/* <AccountCircle sx={{color: "action.active", mr: 1, my: 0.5}} /> */}
            <TextField
              fullWidth
              onChange={handleSearchUserInputChange}
              id="fullWidth"
              size="small"
              placeholder="Search users"
            />
          </Box>
        </ListSubheader>
      }
      sx={{
        pb: 0,
      }}>
      {Array.isArray(data) &&
        data.map((channel, index) => {
          return (
            <ListItemButton
              disableTouchRipple
              dense
              divider
              key={index}
              selected={selectedChannel === channel?._id}
              onClick={() => onClick(channel)}
              alignItems="center">
              <>
                {usersOption === "recent" ? (
                  onlineUsers.includes(channel?.users[0]?._id) &&
                  channel?.isChatType === "private" ? (
                    <>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        variant="dot"
                        sx={{
                          display: channel?.status ? "block" : "hidden",
                          alignSelf: "center",
                          mr: 1,
                        }}>
                        <Avatar
                          sx={
                            {
                              // width: 35,
                              // margin: "10px",
                              // height: 35,
                              // objectFit: "fill",
                              // fontSize: "1rem",
                            }
                          }
                          alt={getDetails(usersOption, channel)?.userName}
                          src={getDetails(usersOption, channel)?.profileImage}
                        />
                      </StyledBadge>
                    </>
                  ) : (
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,
                        fontSize: "3rem",
                        mr: 1,
                      }}
                      alt={getDetails(usersOption, channel)?.userName}
                      src={getDetails(usersOption, channel)?.profileImage}
                    />
                  )
                ) : (
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      fontSize: "3rem",
                      mr: 1,
                    }}
                    alt={getDetails(usersOption, channel)?.userName}
                    src={getDetails(usersOption, channel)?.profileImage}
                  />
                )}
              </>
              {/* {isGroup(channel) && (
                <AppIconButton
                  icon={"info"}
                  sx={{
                    position: "absolute",
                    right: 1,
                    top: 1,
                    fontWeight: "bold",
                    m: 2,
                  }}
                  size={"small"}
                  color={"primary"}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenManageGroupModal(channel);
                  }}
                />
              )} */}
              <ListItemText
                primary={
                  <Stack direction={"row"} flexDirection={"start"} spacing={1}>
                    <Typography variant="h6">
                      {getDetails(usersOption, channel)?.userName}
                    </Typography>
                    {usersOption === "recent" ? (
                      channel?.chatUser[0]?.notificationCount > 0 && (
                        <Tag
                          color={"error"}
                          label={(channel?.chatUser[0]?.notificationCount).toString()}
                          sx={{alignSelf: "center"}}
                        />
                      )
                    ) : (
                      <></>
                    )}
                  </Stack>
                }
                secondary={
                  <React.Fragment>
                    {/* {console.log("TYPING INFO", typingInfo)} */}
                    {typingInfo.find((item) => item?.chatId === channel?._id) &&
                    usersOption === "recent"
                      ? `${
                          typingInfo.find(
                            (item) => item.chatId === channel?._id
                          ).userName
                        } is typing...`
                      : state?.currentUser?._id ===
                          channel?.latestMessage?.sender?._id
                        ? "You: " + channel?.latestMessage?.content
                        : channel?.latestMessage?.content}
                    {channel?._id}
                  </React.Fragment>
                }
              />
            </ListItemButton>
          );
        })}
    </List>
  );
};

export default ListView;
