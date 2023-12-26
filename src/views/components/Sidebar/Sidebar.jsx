import React, {useCallback, useEffect, useState} from "react";
import {
  Divider,
  Drawer,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import UserInfo from "../../../components/UserInfo/UserInfo";
import {useAppStore} from "../../../store/app";
import {AppIconButton} from "../../../components";
import ListView from "../../../container/ListView/ListView";
import {useEventLogout, useEventSwitchDarkMode} from "../../../hooks";
import {socket} from "../../../services/socket";
import {
  getAllUsersListByAxios,
  getRecentUsersListByAxios,
} from "../../../services/users";
import {CommonDialog} from "../../../components/dialogs";
import AddGroupForm from "../../../container/AddGroupForm/AddGroupForm";
const Sidebar = ({
  classes,
  usersOption,
  setRecentUsers,
  recentUsers,
  checkPermissionToChat,
  selectedUserId,
  // initialRender,
  setUsersOption,
  handleChannelChange,
  typingInfo,
  handleOpenManageGroupModal,
}) => {
  const INITIAL_PAYLOAD = {
    query: "",
  };
  const [initialRender, setInitialRender] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const [recentUsers, setRecentUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchAllUsers, setSearchAllUsers] = useState(INITIAL_PAYLOAD);
  const [filterSearchAllUsersValue, setFilterSearchAllUsersValue] =
    useState("");
  // const [searchAllUsers, setSearchAllUsers] = useState(INITIAL_PAYLOAD);
  const handleOpenCreateGroupModal = () => {
    setIsOpenModal(true);
  };
  const handleSwitchUsersOption = () => {
    setUsersOption((prev) => (prev === "recent" ? "all" : "recent"));
  };
  const handleSearchRecentUsers = (event) => {
    setFilterSearchAllUsersValue(event.target.value);
  };

  const handleSearchUserInputChange = (event) => {
    // console.log(event.target.value);
    // setFilter(() => {
    //   const copyObj = JSON.parse(JSON.stringify(filter));
    //   return {
    //     ...copyObj,
    //     query: {
    //       ...copyObj.query,
    //       search: {
    //         keys: ["users"],
    //         value: event.target.value,
    //       },
    //     },
    //   };
    // });
    setSearchAllUsers(() => {
      const copyObj = JSON.parse(JSON.stringify(searchAllUsers));
      return {
        ...copyObj,
        query: `${event.target.value}`,
      };
    });
  };
  const filteredArray = recentUsers.filter((user) =>
    user.isChatType === "private"
      ? user.users[0].userName
          .toLowerCase()
          .includes(filterSearchAllUsersValue.toLocaleLowerCase())
      : user.chatName
          .toLowerCase()
          .includes(filterSearchAllUsersValue.toLocaleLowerCase())
  );
  const handleCloseCreateGroupModal = () => {
    setIsOpenModal(false);
  };
  const [state, dispatch] = useAppStore();
  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  const handleUserOnlineStatus = useCallback(({userId}) => {
    setOnlineUsers((prev) => {
      if (prev.includes(userId)) return prev;
      else {
        const updatedOnlineUsers = [...prev, userId];
        return updatedOnlineUsers;
      }
    });
  }, []);
  const handleGroupChange = (e) => {
    setGroupName(e.target.value);
  };
  const handleCreateGroup = useCallback(() => {
    if (groupName === "" && Object.keys(selectedUsers).length === 0) {
      dispatch({
        type: "SHOW_ERROR_TOAST",
        payload: "Please, Enter Group Creation details !!",
      });
    } else {
      socket.emit("group:create_group", {
        users: selectedUsers.map((user) => user.value),
        chatName: groupName,
      });

      setSelectedUsers([]);
      setGroupName("");
      handleCloseCreateGroupModal();
    }
  }, [dispatch, groupName, selectedUsers]);
  const handleUserOfflineStatus = useCallback(({userId}) => {
    setOnlineUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((item) => item !== userId);
      } else {
        return prev;
      }
    });
  }, []);
  useEffect(() => {
    if (usersOption === "recent") {
      getRecentUsersListByAxios()
        .then((res) => setRecentUsers(res?.data || []))
        .catch((error) =>
          dispatch({
            type: "SHOW_ERROR_TOAST",
            payload: error,
          })
        );
    } else {
      getAllUsersListByAxios(searchAllUsers)
        .then((res) => setAllUsers(res?.data || []))
        .catch((error) =>
          dispatch({
            type: "SHOW_ERROR_TOAST",
            payload: error,
          })
        );
    }
  }, [dispatch, usersOption, setSearchAllUsers, searchAllUsers]);
  const handleGroupCreated = (newGroup) => {
    setRecentUsers((prev) => {
      let tempPrev = JSON.parse(JSON.stringify(prev));
      tempPrev.unshift(newGroup);
      return tempPrev;
    });
  };
  useEffect(() => {
    if (Array.isArray(recentUsers) && initialRender === true) {
      if (recentUsers.length > 0) {
        recentUsers.forEach((user) => {
          if (Number(user?.users[0]?.onlineStatus) === 1) {
            setOnlineUsers((prev) => [...prev, user?.users[0]?._id]);
          }
        });
        setInitialRender(false);
      }
    }
  }, [checkPermissionToChat, initialRender, recentUsers]);
  useEffect(() => {
    socket.on("users:get_online_user", handleUserOnlineStatus);
    socket.on("users:get_offline_user", handleUserOfflineStatus);
    socket.on("messages:new_group_created", handleGroupCreated);
    return () => {
      socket.off("users:get_online_user", handleUserOnlineStatus);
      socket.off("users:get_offline_user", handleUserOfflineStatus);
      socket.off("messages:new_group_created", handleGroupCreated);
    };
  }, []);

  return (
    <>
      <Drawer
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left">
        <Stack
          sx={{
            padding: 2,
            flex: 0.2,
          }}>
          <UserInfo showAvatar user={state?.currentUser} />
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}>
            <Tooltip
              title={
                state.darkMode ? "Switch to Light mode" : "Switch to Dark mode"
              }>
              <FormControlLabel
                label={!state.darkMode ? "Light mode" : "Dark mode"}
                control={
                  <Switch
                    checked={state.darkMode}
                    onChange={onSwitchDarkMode}
                  />
                }
              />
            </Tooltip>

            <AppIconButton
              icon="logout"
              title="Logout Current User"
              onClick={onLogout}
            />
          </Stack>
        </Stack>
        <Divider />
        <ListView
          sx={{
            flex: 0.8,
          }}
          handleOpenManageGroupModal={handleOpenManageGroupModal}
          listHeaderText="Users"
          usersOption={usersOption}
          handleOpenCreateGroupModal={handleOpenCreateGroupModal}
          handleSwitchUsersOption={handleSwitchUsersOption}
          data={usersOption === "recent" ? filteredArray : allUsers}
          selectedChannel={selectedUserId}
          onClick={(channel) => {
            handleChannelChange(channel);
          }}
          handleSearchUserInputChange={
            usersOption === "recent"
              ? handleSearchRecentUsers
              : handleSearchUserInputChange
          }
          onlineUsers={onlineUsers}
          typingInfo={typingInfo}
        />
      </Drawer>
      <CommonDialog
        open={isOpenModal}
        onClose={handleCloseCreateGroupModal}
        onConfirm={handleCreateGroup}
        title={"Create Group"}
        confirmButtonText={"Create"}
        body={
          <AddGroupForm
            setSelectedUsers={setSelectedUsers}
            handleGroupChange={handleGroupChange}
            groupName={groupName}
            selectedUsers={selectedUsers}
          />
        }
      />
    </>
  );
};

export default Sidebar;
