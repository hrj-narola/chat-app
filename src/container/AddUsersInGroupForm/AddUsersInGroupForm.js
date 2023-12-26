import {
  Avatar,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {getAllUsersListByAxios} from "../../services/users";
import {Box} from "@mui/material";
import {AppButton} from "../../components";
import {socket} from "../../services/socket";

const AddUsersInGroupForm = ({groupMembers, setGroupMembers, groupDetails}) => {
  const [allUsers, setAllUsers] = useState([]);
  console.log("GROUP DETAUI", groupDetails);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const INITIAL_PAYLOAD = {
      query: "",
    };
    getAllUsersListByAxios(INITIAL_PAYLOAD)
      .then((res) => setAllUsers(res?.data || []))
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleNewUserAdd = (user) => {
    const newUser = {
      chatId: groupDetails._id,
      userId: {
        _id: user._id,
        userName: user.userName,
      },
    };
    const payload = {
      userId: user._id,
      chatId: groupDetails._id,
      event: "add-user",
    };
    console.log(payload);
    socket.emit("chats:edit_group_details", payload);
    setGroupMembers((prev) => [...prev, newUser]);
  };
  console.log(groupMembers);
  return isLoading ? (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <CircularProgress />
    </Box>
  ) : (
    <div>
      <Box>
        {Array.isArray(allUsers) && allUsers.length > 0 ? (
          allUsers.map((user) => {
            const labelId = `checkbox-list-label-${user._id}`;
            const isAlreadyGroupMember = groupMembers.find(
              (member) => member.userId?._id === user?._id
            );
            return (
              <ListItem
                dense
                divider
                key={user?._id}
                secondaryAction={
                  !isAlreadyGroupMember ? (
                    // areYouAdmin && Number(user?.groupAdminStatus) !== 1 ? (
                    <Stack direction={"row"} gap={1}>
                      <AppButton
                        size={"small"}
                        text={"Add"}
                        color={"primary"}
                        // variant={""}
                        onClick={() => handleNewUserAdd(user)}
                      />
                    </Stack>
                  ) : (
                    // )
                    <AppButton
                      size={"small"}
                      text={"Added"}
                      disabled
                      color={"primary"}
                    />
                  )
                }
                disablePadding>
                <ListItemButton role={undefined} dense>
                  <ListItemAvatar>
                    <Avatar alt={user?.userName} src={user?.profileImage} />{" "}
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={user?.userName}
                    // secondary={
                    //   typingInfo?.chatId === groupDetails?._id &&
                    //   user?.userId === typingInfo?.userId
                    // }
                  />
                  {/* {Number(user?.groupAdminStatus) === 1 && (
                    <Tag label={"Admin"} color={"success"} />
                  )} */}
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <Typography variant="subtitle1">No Users !!</Typography>
        )}
      </Box>
    </div>
  );
};

export default AddUsersInGroupForm;
