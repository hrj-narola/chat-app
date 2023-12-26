import { Avatar, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';

const UsersList = ({ users }) => {
  return (
    <>
      {Array.isArray(users) &&
        users.map((user, index) => {
          return (
            <ListItem key={index} alignItems="center">
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  fontSize: '3rem',
                }}
                alt={user?.userName}
                src={user?.profileImage}
              />

              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {user?.userName}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
    </>
  );
};

export default UsersList;
