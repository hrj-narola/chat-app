import React, {useEffect, useState} from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AppForm from "../../components/AppForm/AppForm";
import {getAllUsersListByAxios} from "../../services/users";

const AddGroupForm = ({
  setSelectedUsers,
  handleGroupChange,
  groupName,
  selectedUsers,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

  const userOptions =
    Array.isArray(allUsers) &&
    allUsers.map((user) => ({label: user?.userName, value: user?._id}));

  const handleOnSelectOption = (option) => {
    console.log("selected users", selectedUsers);
    if (selectedUsers.some((user) => user.value === option.value)) {
      setSelectedUsers((prev) =>
        prev.filter((user) => user.value !== option.value)
      );
    } else {
      setSelectedUsers((prev) => [...prev, option]);
    }
  };

  return (
    <AppForm>
      <Autocomplete
        loading={isLoading}
        multiple
        disableCloseOnSelect
        onChange={(_, newInputValue) => {
          setSelectedUsers(newInputValue);
        }}
        value={selectedUsers}
        id="checkboxes-tags-demo"
        options={userOptions}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, value) => {
          return option.value === value.value;
        }}
        renderOption={(props, option) => {
          return (
            <li {...props} onClick={() => handleOnSelectOption(option)}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{marginRight: 8}}
                checked={selectedUsers.some(
                  (user) => user.value === option.value
                )}
              />
              {option.label}
            </li>
          );
        }}
        sx={{width: 500, my: 2}}
        renderInput={(params) => <TextField {...params} label="Users" />}
      />
      <TextField
        name="groupName"
        placeholder="Enter Group Name"
        onChange={(e) => handleGroupChange(e)}
        value={groupName}
        fullWidth
      />
    </AppForm>
  );
};

export default AddGroupForm;
