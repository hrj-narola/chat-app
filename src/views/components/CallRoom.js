import React, {useCallback, useEffect, useState} from "react";
import {useStyles} from "../../utils/style";
import {AppIcon} from "../../components";
import useWorkSpace from "../../hooks/workspace";
import {useAppStore} from "../../store/app";
import ReactPlayer from "react-player";
import {socket} from "../../services/socket";
import peer from "../../services/peer/peer";

const CallRoom = ({
  myStream,
  remoteStream,
  partnerVideoRef,
  userVideoRef,
  sendStreams,
  setRemoteStream,
}) => {
  const style = useStyles();
  const [state] = useAppStore();
  const workspace = useWorkSpace();
  const [changeVoiceState, setChangeVoiceState] = useState(false);
  console.log("CALL ROOM ID", workspace.callDetails);
  console.log("MY STREAM", myStream);
  console.log("REMOTE STREAM", remoteStream);
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    console.log("NEGO OFFER", offer);

    socket.emit("peer:nego:needed", {
      offer,
      to: workspace.callDetails.callerDetails._id,
    });
  }, [socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({from, offer}) => {
      const ans = await peer.getAnswer(offer);
      console.log("ANSWER", ans);
      socket.emit("peer:nego:done", {to: from, ans});
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ans}) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);
  useEffect(() => {
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, []);
  return (
    <div className="">
      <div
        style={{
          display: "flex",
          gap: "30px",
          maxWidth: "400px",
          flexWrap: "wrap",
        }}>
        <h1>MY STREAM</h1>
        <ReactPlayer
          controls
          muted
          playing
          height={"100px"}
          width={"200px"}
          url={myStream}
        />
        {/* <video src={myStream} controls /> */}
        {/* {myStream && <video controls autoPlay src={myStream} />}
        {remoteStream && <video controls autoPlay src={remoteStream} />} */}
        {/* {myStream && (
          // <ReactPlayer
          //   controls
          //   muted
          //   playing
          //   height={"100px"}
          //   width={"200px"}
          //   url={myStream}
          //   />
          <audio id="myStreamAudio" />
        )} */}
        {/* {workspace.callDetails?.callerDetails?._id !==
          state?.currentUser._id && ( */}
        {/* )} */}
        <button onClick={sendStreams}>SEND STREAMS</button>
        <h1>REMOTE STREAM</h1>
        <ReactPlayer
          controls
          muted
          playing
          height={"100px"}
          width={"200px"}
          url={remoteStream}
        />
        {/* <video src={remoteStream} controls /> */}
        {/* {remoteStream && (
          // <ReactPlayer
          //   controls
          //   playing
          //   height={"100px"}
          //   width={"200px"}
          //   url={remoteStream}
          // />
        )} */}
        {workspace?.callDetails?.users.map((user, index) => (
          <div
            key={index}
            onClick={() => setChangeVoiceState(!changeVoiceState)}
            style={{
              position: "relative",
              height: "180px",
              width: "180px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              borderRadius: "10px",
              backgroundColor: "#636362",
              display: "flex",
              alignItems: "center",
            }}>
            <div
              style={{
                display: "flex",
                padding: "30px",
                margin: "auto",
                fontSize: "40px",
                fontWeight: "bolder",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                borderRadius: "50%",
              }}>
              {user?.userName?.charAt(0).toUpperCase()}
            </div>
            <div
              onClick={() => setChangeVoiceState(!changeVoiceState)}
              style={{position: "absolute", bottom: "0", right: "0"}}>
              {state.currentUser._id === user.userId ? (
                changeVoiceState ? (
                  <AppIcon
                    icon={"volumeupicon"}
                    fontSize={"small"}
                    color={""}
                    name={"volumeupicon"}
                    sx={{mr: 1}}
                  />
                ) : (
                  <AppIcon
                    icon={"volumeofficon"}
                    fontSize={"small"}
                    color={""}
                    name={"volumeofficon"}
                    sx={{mr: 1}}
                  />
                )
              ) : (
                <></>
              )}
            </div>
            <div
              onClick={() => setChangeVoiceState(!changeVoiceState)}
              style={{
                position: "absolute",
                bottom: "0",
                marginLeft: "10px",
                maxWidth: "100%",
                textTransform: "capitalize",
              }}>
              {user.userName}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}>
        <div
          style={{
            padding: "10px",
            borderRadius: "30px",
            backgroundColor: "red",
            display: "flex",
          }}>
          <AppIcon
            icon={"callendicon"}
            fontSize={"medium"}
            color={""}
            name={"callendicon"}
            // sx={{mr: 1}}
          />
        </div>
      </div>
    </div>
  );
};

export default CallRoom;
