import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import adminImage from "../../assets/images/admin1.png";
import {
  Avatar,
  Box,
  CircularProgress,
  ListItemAvatar,
  Stack,
  Typography,
} from "@mui/material";
import {AppButton, AppIcon} from "../../components";
import {useEffect} from "react";
import {useState} from "react";
import axiosInstance from "../../services/axios";
import {useAppStore} from "../../store/app";
import {useCallback} from "react";
import Tag from "../../components/AppTag/AppTag";
import {socket} from "../../services/socket";
import {useMemo} from "react";
import {CommonDialog} from "../../components/dialogs";
import AddUsersInGroupForm from "../AddUsersInGroupForm/AddUsersInGroupForm";

const ManageGroup = ({groupDetails, typingInfo}) => {
  const [loading, setLoading] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [state, dispatch] = useAppStore();

  const fetchGroupMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("chats/groupUserList", {
        chatId: groupDetails?._id,
      });
      //move admin at top
      const eleInd = res?.data?.data.findIndex(
        (user) => Number(user?.groupAdminStatus) === 1
      );

      const removedEle = res?.data?.data.splice(eleInd, 1);
      res?.data?.data?.unshift(removedEle[0]);

      setGroupMembers(res?.data?.data);
    } catch (error) {
      dispatch({
        type: "SHOW_ERROR_TOAST",
        payload: error,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, groupDetails?._id]);

  const handleOpenAddUserInGroupModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseAddUserInGroupModal = () => {
    setIsOpenModal(false);
  };

  const handleRemoveUserFromGroup = (user) => {
    socket.emit("chats:edit_group_details", {
      userId: user?.userId?._id,
      chatId: groupDetails?._id,
      event: "remove-user",
    });
  };

  const handleAssignAdminAccess = (user) => {
    socket.emit("chats:edit_group_details", {
      userId: user?.userId?._id,
      chatId: groupDetails?._id,
      event: "make-admin",
    });
  };

  const handleUserRemoveSuccess = useCallback(
    (data) => {
      setGroupMembers((prev) => {
        return prev.filter((user) => user?.userId?._id !== data?.userId);
      });
      dispatch({
        type: "SHOW_SUCCESS_TOAST",
        payload: data?.message,
      });
    },
    [dispatch]
  );
  const getRamdomUserId = (users) => {
    const randomIndex = Math.floor(Math.random() * users?.length);
    return users[randomIndex];
  };

  const handleExitFromGroup = () => {
    const groupUserIds = groupDetails.users.map((user) => user._id);
    const payload = {
      userId: state?.currentUser?._id,
      chatId: groupDetails?._id,
      nextAdminId: getRamdomUserId(groupUserIds),
      event: "exit-user",
    };
    console.log(payload);
    socket.emit("chats:edit_group_details", payload);
  };
  const handleAddUserToGroup = useCallback(
    (data) => {
      dispatch({
        type: "SHOW_SUCCESS_TOAST",
        payload: data?.message,
      });
    },
    [dispatch]
  );
  const handleAssignAdminAccessSuccess = useCallback(
    (data) => {
      setGroupMembers((prev) => {
        return prev.map((user) =>
          user?.userId?._id === data?.userId
            ? {
                ...user,
                groupAdminStatus: 1,
              }
            : {...user}
        );
      });
      dispatch({
        type: "SHOW_SUCCESS_TOAST",
        payload: data?.message,
      });
    },
    [dispatch]
  );

  const handleExitFromGroupSuccess = useCallback(
    (data) => {
      console.log("exit called");
      setGroupMembers((prev) => {
        return prev.filter((user) => user?.userId?._id !== data?.userId);
      });
      dispatch({
        type: "SHOW_SUCCESS_TOAST",
        payload: data?.message,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    socket.on("chats:user_remove_successfully", handleUserRemoveSuccess);
    socket.on("chats:make_admin_successfully", handleAssignAdminAccessSuccess);
    socket.on("chats:user_exit_successfully", handleExitFromGroupSuccess);
    socket.on("chats:add_user_successfully", handleAddUserToGroup);
    return () => {
      socket.off("chats:user_remove_successfully", handleUserRemoveSuccess);
      socket.off(
        "chats:make_admin_successfully",
        handleAssignAdminAccessSuccess
      );
      socket.off("chats:user_exit_successfully", handleExitFromGroupSuccess);
      socket.off("chats:add_user_successfully", handleAddUserToGroup);
    };
  }, [
    handleAssignAdminAccessSuccess,
    handleExitFromGroupSuccess,
    handleUserRemoveSuccess,
  ]);

  useEffect(() => {
    fetchGroupMembers();
  }, [fetchGroupMembers]);

  const areYouAdmin = useMemo(
    () =>
      Array.isArray(groupMembers) &&
      Boolean(
        groupMembers.find(
          (member) =>
            member?.userId?._id === state?.currentUser?._id &&
            member?.groupAdminStatus === 1
        )
      ),
    [groupMembers, state?.currentUser?._id]
  );

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <List
        sx={{
          width: "100%",
          maxWidth: 460,
          bgcolor: "background.paper",
          borderRadius: "20px",
          pb: 0,
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            p: 2,
          }}>
          <Typography variant="h6">Manage User</Typography>
          {areYouAdmin && (
            <AppButton
              startIcon=<AppIcon icon={"addgroup"} />
              text={"Add New User"}
              title={"Add New User"}
              variant="contained"
              size={"small"}
              onClick={() => handleOpenAddUserInGroupModal()}
            />
          )}
        </Box>
        {Array.isArray(groupMembers) && groupMembers.length > 0 ? (
          groupMembers.map((user) => {
            const labelId = `checkbox-list-label-${user}`;
            return (
              <ListItem
                dense
                divider
                key={user?.userId?._id}
                secondaryAction={
                  areYouAdmin && Number(user?.groupAdminStatus) !== 1 ? (
                    <Stack direction={"row"} gap={1}>
                      <AppButton
                        startIcon={<AppIcon icon={"adminicon"} />}
                        size={"small"}
                        variant={"outlined"}
                        text={"Make Admin"}
                        color={"secondary"}
                        onClick={() => handleAssignAdminAccess(user)}
                      />
                      {/* <AppButton
                        startIcon={<AppIcon icon={"logout"} />}
                        text={"Exit Group"}
                        onClick={handleExitFromGroup}
                        variant={"text"}
                        color={"error"}
                      /> */}
                      <AppButton
                        startIcon={<AppIcon icon={"removeicon"} />}
                        size={"small"}
                        text={"Remove"}
                        color={"error"}
                        variant={"outlined"}
                        onClick={() => handleRemoveUserFromGroup(user)}
                      />
                    </Stack>
                  ) : (
                    <></>
                  )
                }
                disablePadding>
                <ListItemButton role={undefined} dense>
                  <ListItemAvatar>
                    <Avatar
                      alt={user?.userId?.userName}
                      src={user?.userId?.profileImage}
                    />{" "}
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={user?.userId?.userName}
                    secondary={
                      typingInfo?.chatId === groupDetails?._id &&
                      user?.userId === typingInfo?.userId
                    }
                  />
                  {Number(user?.groupAdminStatus) === 1 && (
                    // <img src={adminImage} height={"30px"} alt="admin" />
                    <Tag
                      label={"Admin"}
                      color={"success"}
                      variant={"outlined"}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <Typography variant="subtitle1">No Users !!</Typography>
        )}
        {groupMembers.find(
          (user) => user?.userId?._id === state?.currentUser?._id
        ) && (
          <Box sx={{display: "flex", justifyContent: "center", mt: 1}}>
            <AppButton
              startIcon={<AppIcon icon={"logout"} />}
              text={"Exit Group"}
              onClick={handleExitFromGroup}
              variant={"text"}
              color={"error"}
            />
          </Box>
        )}
        <CommonDialog
          open={isOpenModal}
          onClose={handleCloseAddUserInGroupModal}
          // onConfirm={handleCreateGroup}
          title={"Add users"}
          confirmButtonText={"Save"}
          body={
            <AddUsersInGroupForm
              groupMembers={groupMembers}
              setGroupMembers={setGroupMembers}
              groupDetails={groupDetails}
            />
            // <AddGroupForm
            //   setSelectedUsers={setSelectedUsers}
            //   handleGroupChange={handleGroupChange}
            //   groupName={groupName}
            //   selectedUsers={selectedUsers}
            // />
          }
        />
      </List>
    </Box>
  );
};

export default ManageGroup;
