import {useContext, useMemo} from "react";
import {WorkSpaceContext} from "../store/workspace/WorkSpaceStore";

const useWorkSpace = () => {
  const workspace = useContext(WorkSpaceContext);

  const {
    username,
    user_id,
    messageDispatch,
    channel,
    channelDispatch,
    messageState,
    callDetails,
    callDetailsDispatch,
  } = workspace;

  const messages = useMemo(() => {
    return workspace?.messageState.map((msg) => {
      return {
        // senderUserName: msg?.sender?.userName,
        messageId: msg?.messageId,
        senderId: msg?.senderId,
        textWithDate: `${msg?.text} (${new Date(
          msg?.createdAt
        ).toLocaleDateString()})`,
        text: msg?.text,
        createdAt: msg?.createdAt,
        replyMessage: msg.replyMessage ?? [],
        messageReaction: msg?.messageReaction ?? [],
        senderUsername: msg?.senderUsername,
        isDeleted: msg?.isDeleted,
      };
    });
  }, [workspace?.messageState]);

  return {
    username,
    user_id,
    messages,
    messageState,
    messageDispatch,
    channel,
    channelDispatch,
    callDetails,
    callDetailsDispatch,
  };
};

export default useWorkSpace;
