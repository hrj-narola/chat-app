import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import {useChatStore} from "../../store/chat";

const AppListItem = ({user}) => {
  const {userName, _id} = user;
  const [state, dispatch] = useChatStore();

  return (
    <ListItemButton
      alignItems="center"
      onClick={() =>
        dispatch({
          type: "SET_SELECTED_USER_DETAIL",
          payload: user,
        })
      }
      selected={state?.selectedUserDetail?._id === _id}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={userName}
        secondary={
          <React.Fragment>
            <Typography
              sx={{display: "inline"}}
              component="span"
              variant="body2"
              color="text.primary">
              {"Hello !"}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItemButton>
  );
};

export default AppListItem;
