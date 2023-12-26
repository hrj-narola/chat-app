import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import useWorkSpace from "../../hooks/workspace";
import AppIconButton from "../../components/AppIconButton/AppIconButton";
import {useAppStore} from "../../store/app/AppStore";
import axiosInstance from "../../services/axios";
import {socket} from "../../services/socket";
import MessageDialog from "../../components/dialogs/MessageDialog";
import UsersList from "../../container/UsersList/UsersList";
import {AppIcon} from "../../components";
import ManageGroup from "../../container/ManageGroup/ManageGroup";
import peer from "../../services/peer/peer";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import ChatFooter from "../components/ChatFooter/ChatFooter";
import Cards from "../components/Cards";
import {useEventLogout} from "../../hooks";
import {useStyles} from "../../utils/style";
import {callerButtons, receiverButtons} from "../../utils/constants";
import {debounce} from "../../utils/debounce";
import CallRoom from "../components/CallRoom";
import MessageList from "../components/MessageList";

const ChatRoomView = () => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const workspace = useWorkSpace();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [state, dispatch] = useAppStore();
  const [usersOption, setUsersOption] = useState("recent");
  const [reciepents, setReciepents] = useState([]);
  const [currentChatDetails, setCurrentChatDetails] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [showMessageSeenUsersModal, setShowMessageSeenUsersModal] =
    useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [messageLimit, setMessageLimit] = useState(50);
  const [videoCallingModal, setVideoCallingModal] = useState(false);
  const [callingUserDetails, setCallingUserDeatils] = useState(null);
  const [receivingUserDetails, setReceivingUserDetails] = useState(null);
  const [filter, setFilter] = useState({
    options: {
      select: {},
      limit: 50,
      page: messageLimit,
      sort: {
        createdAt: -1,
      },
      pagination: true,
      populate: ["sender", "chat", "replyMessageId"],
    },
    query: {},
  });
  const [markAsRead, setMarkAsRead] = useState(false);
  const [messageSeenUsers, setMessageSeenUsers] = useState([]);
  // const [messageOptionsBtnRef, setmessageOptionsBtnRef] = useState(null);
  const [isOpenManageGroupModal, setIsOpenManageGroupModal] = useState(false);
  const [groupDetailsToBeManaged, setGroupDetailsToBeManaged] = useState({});
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [initialRender, setInitialRender] = useState(true);
  const [msgIdToBeManaged, setMsgIdToBeManaged] = useState("");
  const [typingInfo, setTypingInfo] = useState([]);
  const [hasAccessToChat, setHasAccessToChat] = useState(false);
  const [isReplyStatus, setIsReplyStatus] = useState(false);
  const [unseenMessageList, setUnseenMessageList] = useState([]);

  const [openAudioCallRoomModal, setOpenAudioCallModal] = useState(false);
  const [stream, setStream] = useState();
  // const open = Boolean(messageOptionsBtnRef);

  const chatBottom = useRef(null);
  const messageInputRef = useRef(null);
  const listContainer = useRef(null);
  const handleLogout = useEventLogout();
  const getNotificatonsCountOfCurrentUser = useCallback(() => {
    return (
      recentUsers.find((user) => user?._id === workspace?.channel?.chatId)
        ?.chatUser[0]?.notificationCount || 0
    );
  }, [recentUsers, workspace?.channel?.chatId]);

  const getUnseenMessageInfo = useCallback(() => {
    let totalNotifications = getNotificatonsCountOfCurrentUser();
    let messagesLength = workspace?.messages.length;

    const splicedMessageArr = workspace?.messages.slice(
      messagesLength - totalNotifications
    );
    const messageIds = Array.isArray(splicedMessageArr)
      ? splicedMessageArr.map((msg) => msg?.messageId)
      : [];
    return {messageIds, senderId: workspace?.messages[0]?.senderId};
  }, [getNotificatonsCountOfCurrentUser, workspace?.messages]);

  const fetchUserMessages = useCallback(() => {
    currPage === 1 && setIsMessagesLoading(true);
    axiosInstance
      .post("/messages/getMessage", filter)
      .then((res) => {
        const payload = Array.isArray(res?.data?.data.seenMessagesList)
          ? res?.data?.data.seenMessagesList.map((conv) => ({
              isDeleted: Number(conv?.isDeleted) ? true : false,
              messageId: conv?._id,
              notificationCount: 0,
              senderId: conv?.sender?._id,
              senderUsername: conv?.sender?.userName,
              createdAt: new Date(conv?.createdAt).toLocaleDateString(),
              text: conv?.content,
              replyMessage: conv?.replyMessageId,
              messageReaction: conv?.messageReaction,
            }))
          : [];
        setUnseenMessageList(
          res?.data?.data.unseenMessagesList.map((conv) => ({
            isDeleted: Number(conv?.isDeleted) ? true : false,
            messageId: conv?._id,
            notificationCount: 0,
            senderId: conv?.sender?._id,
            senderUsername: conv?.sender?.userName,
            createdAt: new Date(conv?.createdAt).toLocaleDateString(),
            text: conv?.content,
            replyMessage: conv?.replyMessageId,
            messageReaction: conv?.messageReaction,
          }))
        );
        // console.log("Payload", res.data.data);
        setTotalPages(res.data.data.lastPageNumber);
        // res.data.data.map((conv) => console.log(conv));
        if (currPage === 1) {
          workspace?.messageDispatch({
            type: "LOAD_MESSAGES",
            payload: payload,
          });
          scrollToBottom();
        } else {
          workspace?.messageDispatch({
            type: "ADD_MESSAGES",
            payload: payload,
          });
          callCustomScroll();
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsMessagesLoading(false));
    // eslint-disable-next-line
  }, [workspace]);

  const getMessages = useCallback(
    (messageData) => {
      console.log({messageData});
      if (messageData?.chatId?._id) {
        socket.emit("chats:join_chat", messageData?.chatId?._id);
      }
      if (
        (messageData?.chatId?.latestMessage?.content || messageData?.content) &&
        [messageData?.chatId?._id, messageData?.chatId].includes(
          workspace?.channel?.chatId
        )
      ) {
        let data = {};
        if (messageData?.replyMessageId) {
          data = {
            notificationCount: 0,
            senderId:
              messageData?.chatId?.latestMessage?.sender ??
              messageData?.senderId,
            text:
              messageData?.chatId?.latestMessage?.content ??
              messageData?.content,
            createdAt: messageData?.createdAt,
            senderUsername:
              messageData?.chatId?.latestMessage?.sender?.userName ??
              messageData?.senderUsername,
            messageId:
              messageData?.chatId?.latestMessage?._id ?? messageData?._id,
            isDeleted: false,
            replyMessage: {
              _id: messageData.replyMessageId._id,
              content: messageData?.replyMessageId?.content,
              senderUsername: messageData?.replyMessageId?.senderUsername,
            },
          };
          // console.log("DATA", data);
        } else {
          data = {
            notificationCount: 0,
            senderId:
              messageData?.chatId?.latestMessage?.sender ??
              messageData?.senderId,
            text:
              messageData?.chatId?.latestMessage?.content ??
              messageData?.content,
            createdAt: messageData?.createdAt,
            senderUsername:
              messageData?.chatId?.latestMessage?.sender?.userName ??
              messageData?.senderUsername,
            messageId:
              messageData?.chatId?.latestMessage?._id ?? messageData?._id,
            isDeleted: false,
          };
        }
        workspace?.messageDispatch({
          type: "ADD_MESSAGE",
          payload: data,
        });
        socket.emit("messages:message_seen", {
          senderId: messageData?.senderId,
          chatId: workspace?.channel?.chatId,
          readerId: state?.currentUser?._id,
          messageIds: [messageData?._id],
        });
        scrollToBottom();
        // scrollBottom();
      }
      setRecentUsers((prev) => {
        // console.log("PREV", prev);
        // let tempPrev = JSON.parse(JSON.stringify(prev));
        // console.log("MESSAGE DATA", messageData);
        // console.log("RECETN", recentUsers);
        const isMessageSenderAlreadyInRecentList = recentUsers.filter(
          (user) => user?.chatUser[0]?.chatId === messageData?.chatId
        );
        // console.log("IS MESSAGE ALREADY", isMessageSenderAlreadyInRecentList);
        if (isMessageSenderAlreadyInRecentList.length > 0) {
          let index = prev.findIndex((chat) =>
            [messageData?.chatId?._id, messageData?.chatId].includes(chat?._id)
          );
          let movedEle = prev.splice(index, 1);
          // console.log("already in the message list");
          // console.log("MOVED ELEMENT", movedEle);
          [messageData?.chatId?._id, messageData?.chatId].includes(
            workspace?.channel?.chatId
          )
            ? (movedEle[0].chatUser[0].notificationCount = 0)
            : (movedEle[0].chatUser[0].notificationCount =
                movedEle[0]?.chatUser[0]?.notificationCount + 1);
          if (movedEle[0]?.latestMessage?.content) {
            movedEle[0].latestMessage.content =
              messageData?.chatId?.latestMessage?.content ??
              messageData?.content;
          } else {
            const latest = {
              _id: "",
              sender: {
                userName: messageData?.senderUsername,
                _id: messageData?.senderId,
              },
              content:
                messageData?.chatId?.latestMessage?.content ??
                messageData?.content,
            };
            movedEle[0]["latestMessage"] = latest;
          }
          prev.splice(0, 0, movedEle[0]);
          return prev;
        } else {
          // console.log("Not in the message list");
          // console.log("false");
          // console.log("MESAGE FATA", messageData);
          const chatUser = [
            {
              chatId: messageData?.chatId?._id,
              notificationCount: 1,
              _id: messageData?.chatId?._id,
            },
          ];
          if (messageData.chatId) {
            messageData.chatId["chatUser"] = chatUser;
          }
          // console.log("MESAGE NEW DATA dsadsfod", messageData);
          const newArray =
            prev.length > 0
              ? [messageData?.chatId, ...prev]
              : [messageData?.chatId];
          return newArray;
        }
      });
    },
    [state?.currentUser?._id, recentUsers, workspace]
  );

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    socket.emit("users:typing", {
      userName: state?.currentUser?.userName,
      userId: state?.currentUser?._id,
      chatId: workspace?.channel?.chatId,
    });
  };

  const handleChannelChange = async (channel) => {
    setSelectedUserId(channel?._id);
    setCurrentChatDetails(channel);
    setCurrPage(1);
    setTotalPages(null);
    try {
      if (usersOption === "recent") {
        setFilter(() => {
          const copyObj = JSON.parse(JSON.stringify(filter));
          return {
            options: {
              ...copyObj?.options,
              page: 1,
            },
            query: {
              ...copyObj?.query,
              chat: channel?._id,
            },
          };
        });
        workspace?.channelDispatch({
          type: "CHANGE_CHANNEL",
          payload: {
            name: channel?.isChatType,
            id: channel?._id,
            chatName:
              channel?.isChatType === "group"
                ? channel.chatName
                : channel.users[0].userName,
          },
        });
        setMarkAsRead(false);
      } else {
        const res = await axiosInstance.post("/chats", {
          userId: channel?._id,
        });

        // let receipientIDs = res?.data?.data?.users?.filter((userId) => userId !== state?.currentUser?._id);
        // setReciepents(receipientIDs);
        setFilter(() => {
          const copyObj = JSON.parse(JSON.stringify(filter));
          return {
            options: {
              ...copyObj?.options,
              page: 1,
            },
            query: {
              ...copyObj?.query,
              chat: res?.data?.data?._id,
            },
          };
        });
        workspace?.channelDispatch({
          type: "CHANGE_CHANNEL",
          payload: {
            name: res?.data?.data?.isChatType,
            id: res?.data?.data?._id,
            chatName: channel?.userName,
          },
        });
      }
      setMessageSeenUsers([]);
      setMessage("");
    } catch (error) {
      dispatch({
        type: "SHOW_ERROR_TOAST",
        payload: error,
      });
    }
  };

  const scrollToBottom = () => {
    chatBottom?.current?.scrollIntoView();
  };

  const handleMessageReceivedSuccessfully = useCallback(
    (data) => {
      if (data?.chatId === workspace?.channel?.chatId) {
        const isUserHasAlreadySeen = messageSeenUsers.some(
          (user) => user?._id === data?.userDetails?._id
        );
        if (isUserHasAlreadySeen) {
          return;
        } else {
          setMessageSeenUsers((prev) => [...prev, data?.userDetails]);
        }
      }
    },
    [messageSeenUsers, workspace?.channel?.chatId]
  );
  const handleOpenUsersSeenModal = () => {
    setShowMessageSeenUsersModal(true);
  };

  const handleCloseUsersSeenModal = () => {
    setShowMessageSeenUsersModal(false);
  };

  const handleCloseManageGroupModal = () => {
    // setGroupName('');
    // setSelectedUsers([]);
    // setDefaultValues([]);
    // setGroupChatIdToBeUpdated('');
    setIsOpenManageGroupModal(false);
  };

  const handleOpenManageGroupModal = (channel) => {
    // console.log("channel", channel);
    const chatUsers = recentUsers.find(
      (user) => user.chatUser[0].chatId === channel?.chatId
    )?.users;
    const groupDetails = {
      _id: channel.chatId,
      users: chatUsers,
      chatName: channel.chatName,
    };
    // console.log(groupDetails);
    // setGroupChatIdToBeUpdated(channel?.chatId?._id);
    // setGroupName(channel?.chatId?.chatName);
    // setSelectedUsers(defaultUsers);
    // setDefaultValues(defaultUsers);
    setGroupDetailsToBeManaged(groupDetails);
    setIsOpenManageGroupModal(true);
  };

  // const onScrollTop = () => {
  //   if (listContainer.current) {
  //     const {scrollTop, scrollHeight, clientHeight} = listContainer.current;
  //     // console.log(scrollTop);
  //     if (scrollTop === 0) {
  //       console.info("scrollToTop =>", scrollTop);
  //       setCurrPage(currPage + 1);
  //       setMessageLimit(10);
  //       setFilter(() => {
  //         const copyObj = JSON.parse(JSON.stringify(filter));
  //         return {
  //           ...copyObj,
  //           options: {
  //             ...copyObj.options,
  //             pagination: true,
  //             page: currPage + 1,
  //             limit: 10,
  //           },
  //           query: {
  //             chat: workspace?.channel?.chatId,
  //           },
  //         };
  //       });
  //     }
  //   }
  //
  // };
  const generateRandomNumber = () => {
    let random = Math.floor(1000000 + Math.random() * 9000000);
    return random;
  };

  const handleMessageDeleteSuccessfully = useCallback(
    (data) => {
      workspace?.messageDispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          messageId: data?._id,
          text: data?.content,
          isDeleted: true,
        },
      });
      // setUsers((prev) => {
      //   const copyPrev = JSON.parse(JSON.stringify(prev));
      //  for(let user of copyPrev){
      //   if(data?.chat === user?.chatId?._id)
      //    {
      //     user?.chatId?.latestMessage?.content = data?.content;
      //    }
      //  }
      //  return prev;
      // });
    },
    [workspace]
  );

  const handleSocketError = useCallback(
    (msg) => {
      dispatch({
        type: "SHOW_ERROR_TOAST",
        payload: typeof msg === "object" ? msg.toString() : msg,
      });
      handleLogout();
    },
    [dispatch]
  );

  const handleStopTyping = () => {
    debounce(() => {
      socket.emit("users:stop_typing", {
        userName: state?.currentUser?.userName,
        userId: state?.currentUser?._id,
        chatId: workspace?.channel?.chatId,
      });
    }, 3000);
  };

  const handleListenTyping = (data) => {
    setTypingInfo((prev) => {
      if (prev.find((item) => item?.userId === data?.userId)) {
        return [...prev];
      } else {
        return [...prev, data];
      }
    });
  };

  const handleListenStopTyping = (data) => {
    setTypingInfo((prev) => {
      if (prev.find((item) => item?.userId === data?.userId)) {
        return prev.filter((item) => item?.userId !== data?.userId);
      } else {
        return [...prev];
      }
    });
  };
  // console.log(workspace.messages);
  const handleReplyMessage = () => {
    if (!msgIdToBeManaged) return;
    if (setIsReplyStatus(true));
    // setmessageOptionsBtnRef(null);
    // console.log(messa);
    messageInputRef.current?.focus();
  };

  const handleReactionReceived = (reactionData) => {
    const reactedMessage = workspace.messages.find(
      (message) => message.messageId === reactionData.messageId
    );
    const alreadyReacted = reactedMessage?.messageReaction?.findIndex(
      (user) => user.senderId === reactionData.senderId
    );
    if (alreadyReacted === -1) {
      reactedMessage?.messageReaction?.push(reactionData);
    } else {
      reactedMessage?.messageReaction.splice(alreadyReacted, 1, reactionData);
    }

    const payload = {
      messageId: reactionData?.messageId,
      messageReaction: reactedMessage?.messageReaction,
    };
    // console.log(payload);
    workspace?.messageDispatch({
      type: "UPDATE_MESSAGE",
      payload: payload,
    });
  };
  const checkPermissionToChat = useCallback(async () => {
    if (!workspace?.channel?.chatId) return;
    try {
      const res = await axiosInstance.post("chats/getChatUser", {
        chatId: workspace?.channel?.chatId,
        userId: state?.currentUser?._id,
      });
      // console.log(res?.data?.data?.access === 1);

      return res?.data?.data?.access === 1;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }, [state?.currentUser?._id, workspace?.channel?.chatId]);

  // console.log("REMOTE STREAM CALL", remoteStream);
  const handleCallUser = async (callType) => {
    const constraints = {
      audio: true,
      // video: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => setMyStream(stream))
      .catch((e) => console.log("NAVIGATOR ERROR", e));
    const offer = await peer.getOffer();
    let payload;
    const {data} = await axiosInstance.post("chats/groupUserList", {
      chatId: workspace?.channel?.chatId,
    });
    if (currentChatDetails?.isChatType === "group") {
      payload = {
        users: data.data.map((member) => member.userId),
        callingUser: state.currentUser,
        chatType: currentChatDetails?.isChatType,
        chatName: currentChatDetails.chatName,
        callType: callType,
        chatId: workspace?.channel?.chatId,
        callRoomId: generateRandomNumber().toString(),
        offer: offer,
      };
      workspace.callDetailsDispatch({
        type: "MAKE_CALL",
        payload: {
          chatType: currentChatDetails?.isChatType,
          callRoomId: payload.callRoomId,
          callType: callType,
          chatName: currentChatDetails.chatName,
          callerDetails: state.currentUser,
          chatId: workspace?.channel?.chatId,
          users: data.data.map((member) => member.userId),
          offer: offer,
        },
      });
    } else {
      payload = {
        users: data.data.map((member) => member.userId),
        callingUser: state.currentUser,
        callType: callType,
        chatId: workspace?.channel?.chatId,
        chatType: currentChatDetails.isChatType,
        callRoomId: generateRandomNumber().toString(),
        offer: offer,
      };
      // setReceivingUserDetails(workspace.channel);
      // console.log(state.currentUser);
      workspace.callDetailsDispatch({
        type: "MAKE_CALL",
        payload: {
          chatType: currentChatDetails?.isChatType,
          callType: callType,
          chatName: currentChatDetails.chatName,
          chatId: workspace?.channel?.chatId,
          callerDetails: state.currentUser,
          users: data.data.map((member) => member.userId),
          callRoomId: payload.callRoomId,
          offer: offer,
        },
      });
    }
    socket.emit("call:calling", payload);
    setVideoCallingModal(true);
  };

  const handleIncomingCall = useCallback(
    (data) => {
      // console.log("HANDLE INCOMING CALL", data);
      workspace.callDetailsDispatch({
        type: "MAKE_CALL",
        payload: {
          chatId: data?.chatId,
          callerDetails: data.callingUser,
          callType: data.callType,
          chatType: data.chatType,
          chatName: data.chatName,
          callRoomId: data.callRoomId,
          users: data.users,
          offer: data.offer,
        },
      });
      // setRemoteStream(data.offer);
      setVideoCallingModal(true);
    },
    [socket]
  );
  const handleAcceptCall = async () => {
    let acceptCallPayload;
    const constraints = {
      audio: true,
      // video: true,
    };
    navigator?.mediaDevices
      ?.getUserMedia(constraints)
      .then((stream) => setMyStream(stream))
      .catch((e) => console.error(e));
    const ans = await peer.getAnswer(workspace.callDetails.offer);
    if (workspace.callDetails.chatType !== "group") {
      acceptCallPayload = {
        chatRoomId: workspace.callDetails.callRoomId,
        chatId: workspace.callDetails.chatId,
        receiverId: workspace.callDetails.users.find(
          (user) => user.userId !== workspace.callDetails?.callerDetails?._id
        ).userId,
        callerUserId: workspace.callDetails.callerDetails._id,
        ans: ans,
      };
    } else {
      acceptCallPayload = {
        chatRoomId: workspace.callDetails.callRoomId,
        chatId: workspace.callDetails.chatId,
        receiverId: workspace.callDetails.users.find(
          (user) => user.userId === state.currentUser._id
        ).userId,
        callerUserId: workspace.callDetails.callerDetails._id,
        ans: ans,
      };
    }
    // console.log("call accepted", acceptCallPayload);
    setOpenAudioCallModal(true);
    socket.emit("call:accept", acceptCallPayload);
  };
  const handleRejectCall = () => {
    let payload;
    if (workspace.callDetails.chatType !== "group") {
      payload = {
        chatId: workspace.callDetails.chatId,
        receiverId: workspace.callDetails.users[0].userId,
        callerUserId: workspace.callDetails.callerDetails._id,
      };
    } else {
      payload = {
        chatId: workspace.callDetails.chatId,
        receiverId: workspace.callDetails.users.find(
          (user) => user.userId === state.currentUser._id
        ).userId,
        callerUserId: workspace.callDetails.callerDetails._id,
      };
    }
    socket.emit("call:reject", payload);
    setVideoCallingModal(false);
  };
  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
      // console.log("SENT TRAZCKETS");
    }
  }, [myStream]);
  const getStream = useCallback(() => {
    for (const track of remoteStream.getTracks()) {
      peer.peer.addTrack(track, remoteStream);
    }
  }, [remoteStream]);
  const handleAcceptedCall = useCallback(
    (data) => {
      // setRemoteStream(data.ans);
      peer.setLocalDescription(data.ans);
      setOpenAudioCallModal(true);
      sendStreams();
      // console.log("HANDLE ACCEPTED CALL", data);
    },
    [socket, sendStreams]
  );

  useEffect(() => {
    peer.peer.addEventListener("track", async (event) => {
      const [remoteStream] = event.streams;
      console.log("RESTAREAM", remoteStream);
      setRemoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    socket.on("messages:message_received", getMessages);
    socket.on("messages:reaction_received", handleReactionReceived);

    socket.on(
      "messages:message_seen_successfully",
      handleMessageReceivedSuccessfully
    );
    socket.on("call:called_successfully", handleIncomingCall);

    socket.on(
      "messages:delete_message_successfully",
      handleMessageDeleteSuccessfully
    );
    // socket.on("call:rejected_successfully", handleRejectedCall);
    socket.on("users:typing_to", handleListenTyping);
    socket.on("users:stop_typing_to", handleListenStopTyping);
    socket.on("call:accepted_successfully", handleAcceptedCall);
    socket.on("error", handleSocketError);

    return () => {
      socket.off("messages:reaction_received");
      socket.off("messages:message_received", getMessages);

      socket.off(
        "messages:message_seen_successfully",
        handleMessageReceivedSuccessfully
      );

      socket.off(
        "messages:delete_message_successfully",
        handleMessageDeleteSuccessfully
      );
      socket.off("users:typing_to", handleListenTyping);
      socket.off("users:stop_typing_to", handleListenStopTyping);
      socket.off("call:accepted_successfully", handleAcceptedCall);
      socket.off("error", handleSocketError);

      // socket.off("call:rejected_successfully", handleRejectedCall);
      socket.off("call:called_successfully", handleIncomingCall);
    };
  }, [
    getMessages,
    handleMessageDeleteSuccessfully,
    handleMessageReceivedSuccessfully,
    handleSocketError,
    handleIncomingCall,
  ]);

  useEffect(() => {
    if (currPage === 1) {
      scrollToBottom();
    } else {
      callCustomScroll();
    }
  }, [workspace?.messages?.length]);

  useEffect(() => {
    if (
      workspace.messages.length > 0 &&
      workspace?.channel?.chatId &&
      getNotificatonsCountOfCurrentUser() > 0 &&
      !markAsRead
    ) {
      const {senderId, messageIds} = getUnseenMessageInfo();
      socket.emit("messages:message_seen", {
        readerId: state?.currentUser?._id,
        senderId: senderId,
        chatId: workspace?.channel?.chatId,
        messageIds: messageIds,
      });
      setRecentUsers((prev) =>
        prev.map((user) => {
          return user?._id === workspace?.channel?.chatId &&
            user?.chatUser[0].notificationCount > 0
            ? {
                ...user,
                chatUser: [
                  {
                    chatId: workspace?.channel?.chatId,
                    notificationCount: 0,
                  },
                ],
              }
            : {...user};
        })
      );
      setMarkAsRead(true);
    }
  }, [
    getNotificatonsCountOfCurrentUser,
    getUnseenMessageInfo,
    markAsRead,
    state?.currentUser?._id,
    workspace?.channel?.chatId,
    workspace.messages.length,
  ]);

  useEffect(() => {
    if (workspace?.channel?.chatId) {
      if (currPage <= totalPages || totalPages === null) {
        fetchUserMessages();
        checkPermissionToChat().then((res) => {
          setHasAccessToChat(res);
        });
      }
    }
    // eslint-disable-next-line
  }, [workspace?.channel?.chatId, filter]);

  return (
    <div className={classes.root}>
      {/* Sidebar */}
      <Sidebar
        setInitialRender={setInitialRender}
        initialRender={initialRender}
        checkPermissionToChat={checkPermissionToChat}
        recentUsers={recentUsers}
        setRecentUsers={setRecentUsers}
        handleChannelChange={handleChannelChange}
        typingInfo={typingInfo}
        selectedUserId={selectedUserId}
        setUsersOption={setUsersOption}
        usersOption={usersOption}
        classes={classes}
        handleOpenManageGroupModal={handleOpenManageGroupModal}
      />

      {/* Conversation panel */}
      <Box
        sx={{
          // height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "",
        }}>
        {/* {console.log(workspace.channel)} */}
        {workspace.channel.chatId !== "" && (
          <ChatHeader
            typingInfo={typingInfo}
            classes={classes}
            usersOption={usersOption}
            currentChatDetails={currentChatDetails}
            workspace={workspace}
            handleOpenManageGroupModal={handleOpenManageGroupModal}
            handleCallUser={handleCallUser}
          />
        )}
        <MessageList
          handleOpenUsersSeenModal={handleOpenUsersSeenModal}
          messageSeenUsers={messageSeenUsers}
          // closeReaction={closeReaction}
          // openReactionDropdown={openReactionDropdown}
          // openReactionBtnRef={openReactionBtnRef}
          setIsReplyStatus={setIsReplyStatus}
          setMsgIdToBeManaged={setMsgIdToBeManaged}
          msgIdToBeManaged={msgIdToBeManaged}
          handleReplyMessage={handleReplyMessage}
          // handleDeleteMessage={handleDeleteMessage}
          // messageOptionsBtnRef={messageOptionsBtnRef}
          // setmessageOptionsBtnRef={setmessageOptionsBtnRef}
          chatBottom={chatBottom}
          // closeMessageOptionDropdown={closeMessageOptionDropdown}
          isMessagesLoading={isMessagesLoading}
          listContainer={listContainer}
          selectedUserId={selectedUserId}
        />
        {/* Messagebox */}
        {selectedUserId ? (
          hasAccessToChat ? (
            <ChatFooter
              setIsReplyStatus={setIsReplyStatus}
              setMessage={setMessage}
              msgIdToBeManaged={msgIdToBeManaged}
              isReplyStatus={isReplyStatus}
              usersOption={usersOption}
              setUsersOption={setUsersOption}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              handleStopTyping={handleStopTyping}
              classes={classes}
              message={message}
              messageInputRef={messageInputRef}
              handleMessageChange={handleMessageChange}
            />
          ) : (
            <Typography variant="h6" color={"error"} sx={{textAlign: "center"}}>
              You don't have permission to chat.
            </Typography>
          )
        ) : (
          <></>
        )}
      </Box>
      <MessageDialog
        open={videoCallingModal}
        body={
          <Cards
            remoteStream={remoteStream}
            openAudioCallRoomModal={openAudioCallRoomModal}
            stream={stream}
            myStream={myStream}
            sendStreams={sendStreams}
            setStream={setStream}
            setVideoCallingModal={setVideoCallingModal}
            callDetails={workspace?.callDetails}
            handleAcceptCall={handleAcceptCall}
            // handleRejectCall={handleRejectCall}
          />
        }
      />

      <MessageDialog
        open={showMessageSeenUsersModal}
        onConfirm={handleCloseUsersSeenModal}
        title={"Message Info"}
        body={<UsersList users={messageSeenUsers} />}
      />
      <MessageDialog
        title={groupDetailsToBeManaged?.chatName}
        open={isOpenManageGroupModal}
        onClose={handleCloseManageGroupModal}
        onConfirm={handleCloseManageGroupModal}
        body={
          <ManageGroup
            groupDetails={groupDetailsToBeManaged}
            typingInfo={typingInfo}
          />
        }
      />
    </div>
  );
};

export default ChatRoomView;
