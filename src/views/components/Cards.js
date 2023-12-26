import * as React from "react";
import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {Button, CardActionArea, CardActions} from "@mui/material";
import {useAppStore} from "../../store/app";
import useWorkSpace from "../../hooks/workspace";
import {useEffect} from "react";
import {socket} from "../../services/socket";
import ReactPlayer from "react-player";
import {MessageDialog} from "../../components/dialogs";
import CallRoom from "./CallRoom";

export default function Cards({
  callDetails,
  handleAcceptCall,
  userVideoRef,
  partnerVideoRef,
  handleRejectCall,
  setVideoCallingModal,
  stream,
  myStream,
  remoteStream,
  setStream,
  sendStreams,
  openAudioCallRoomModal,
}) {
  const workspace = useWorkSpace();
  const [state, dispatch] = useAppStore();
  // console.log("MYSTREAM", myStream);
  // console.log("CALL", callDetails);
  const handleRejectedCall = React.useCallback(
    (data) => {
      console.log("DATA", data);
      console.log("CALL", callDetails);
      if (callDetails.chatType !== "group") {
        setVideoCallingModal(false);
      }
      workspace.callDetailsDispatch({
        type: "REJECT_CALL",
        payload: {
          user: callDetails.users.find(
            (user) => user.userId === data.receiverId
          ),
        },
      });
    },
    [socket]
  );

  // useEffect(() => {
  //   const initializeMedia = async () => {
  //     try {
  //       const userStream = navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //       });
  //       setStream(userStream);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   initializeMedia();
  //   return () => {
  //     if (stream) {
  //       stream.getTracks().forEach((track) => track.stop());
  //     }
  //   };
  // }, []),
  useEffect(() => {
    socket.on("call:rejected_successfully", handleRejectedCall);
    return () => {
      socket.off("call:rejected_successfully", handleRejectedCall);
    };
  }, [socket]);
  return (
    <Card sx={{maxWidth: 345, margin: "auto"}}>
      {/* <CardActionArea> */}
      <CardMedia
        component="img"
        // height="140"
      />

      <CardContent>
        <Typography
          alignItems={"center"}
          gutterBottom
          variant="h5"
          component="div">
          {callDetails.chatType !== "group"
            ? state?.currentUser?._id === callDetails?.callerDetails?._id
              ? callDetails?.users.find(
                  (user) => user.userId !== callDetails.callerDetails._id
                )?.userName
              : callDetails?.callerDetails?.userName
            : callDetails.chatName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calling...
        </Typography>
      </CardContent>
      {callDetails?.callerDetails?._id !== state?.currentUser._id && (
        <Button color="success" onClick={handleAcceptCall}>
          Accept Call
        </Button>
      )}
      <Button color="error" onClick={handleRejectCall}>
        Reject Call
      </Button>
      {callDetails?.callerDetails?._id === state?.currentUser._id &&
      callDetails.chatType === "group" ? (
        <table>
          <thead>
            <th>Username</th>
            <th>Calling Status</th>
          </thead>
          {callDetails.users
            .filter((user) => user.userId !== callDetails.callerDetails._id)
            .map((user) => (
              <tbody key={user.userId}>
                <tr>
                  <td>{user.userName}</td>
                  <td>{user.callingStatus}</td>
                </tr>
              </tbody>
            ))}
          {/* {callDetails?.users.map(
            (user) => (
            <tbody key={user.userId}>
              <tr
                className={
                  callDetails?.callerDetails?.userName === user.userName
                    ? "hidden"
                    : "block"
                }>
                <td>{user.userName}</td>
                <td>{user.callingStatus}</td>
              </tr>
            </tbody>
          )
          )} */}
        </table>
      ) : (
        <></>
      )}
      <MessageDialog
        open={openAudioCallRoomModal}
        body={
          <CallRoom
            myStream={myStream}
            remoteStream={remoteStream}
            // setRemoteStream={setRemoteStream}
            sendStreams={sendStreams}
          />
        }
      />
    </Card>
  );
}
