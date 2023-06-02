import { useContext, useEffect, useState } from "react";
import { Column } from "../utils/Column";
import { Theme } from "../utils/Theme";
import { ContactContext, IGroup } from "./ContactProvider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { css } from "@emotion/css";
import { Row } from "../utils/Row";
import toast from "react-hot-toast";
import { IContact, SocketContext } from "./ChatPage";
import { AuthContext } from "./AuthProvider";
import { backendUrl } from "../backendUrl";
import { LoadingComponent } from "../utils/LoadingComponent";
import { formatDistanceToNow } from "date-fns";

const schema = yup
  .object({
    message: yup.string().required("Cannot send empty message"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface IMessage {
  content: string;
  timestamp: number;
  from: string;
  username: string;
}
export const GroupContent = () => {
  const { getActiveGroup } = useContext(ContactContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [messages, setMessages] = useState([] as IMessage[]);
  const { socket } = useContext(SocketContext);
  const { getToken, authUserEmail } = useContext(AuthContext);

  const onSubmit = async (data: FormData) => {
    try {
      const groupTo = getActiveGroup();
      if (!groupTo) throw new Error("No active receipient");
      if (!socket) throw new Error("Error connecting to server");

      socket.emit("group_message", {
        content: data.message,
        to: groupTo.id,
        token: getToken(),
      });

      reset({ message: "" });
    } catch (error: any) {
      toast.error("Error sending message");
    }
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("group_message", (args: any) => {
      const { content, from, timestamp, username } = args;
      setMessages((m) => m.concat({ content, timestamp, from, username }));
    });
  }, [socket, setMessages]);

  const [loading, setLoading] = useState(false);
  const fetchChats = async (activeGroup: IGroup) => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "message/group-chats", {
        method: "POST",
        body: JSON.stringify({
          token: getToken(),
          to: activeGroup.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) throw new Error(await response.text());
      const { chats } = await response.json();
      setMessages(chats);
    } catch (error: any) {
      console.error(error);
      toast.error("Error");
    }
    setLoading(false);
  };
  useEffect(() => {
    const activeContact = getActiveGroup();
    if (!activeContact) return;
    fetchChats(activeContact);
  }, [getActiveGroup]);

  if (!getActiveGroup()) return null;
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <Column
      className={css`
        @media (max-width: 600px) {
          height: 100%;
        }
        height: 80.2vh;
      `}
      style={{
        backgroundColor: Theme.colors.gray[700],
        flexDirection: "column-reverse",
      }}
    >
      <Row
        style={{
          width: "100%",
          alignItems: "flex-end",
        }}
      >
        <input
          className={css`
            padding: 12px;
            border-radius: 2px;
            background-color: ${Theme.colors.gray[600]};
            outline: none;
            border: none;
            width: 100%;
          `}
          placeholder="Type a message..."
          {...register("message")}
        />
        <span
          className="material-symbols-outlined"
          style={{
            padding: "12px",
            cursor: "pointer",
          }}
          onClick={() => {
            if (errors.message && errors.message.message) {
              toast.error(errors.message.message);
              return;
            }
            handleSubmit(onSubmit)();
          }}
        >
          send
        </span>
      </Row>
      <Column
        gap={24}
        className={css`
          /* width */
          ::-webkit-scrollbar {
            opacity: 0;
            width: 0;
          }

          /* Track */
          //   ::-webkit-scrollbar-track {
          //     background: #f1f1f1;
          //   }

          /* Handle */
          //   ::-webkit-scrollbar-thumb {
          //     background: #888;
          //   }

          /* Handle on hover */
          //   ::-webkit-scrollbar-thumb:hover {
          //     background: #555;
          //   }
        `}
        ref={(element) => {
          if (!element) return;
          element.scrollTop = element.scrollHeight;
        }}
        style={{
          padding: "12px",
          overflow: "scroll",
        }}
      >
        {messages
          //   .slice()
          //   .reverse()
          .map((m) => {
            const isActiveContact = m.from === authUserEmail();
            return (
              <Row
                className={css`
                  justify-content: ${isActiveContact
                    ? "flex-end"
                    : "flex-start"};
                `}
              >
                <Column
                  gap={6}
                  className={css`
                    background-color: ${Theme.colors.gray[600]};
                    padding: 12px;
                    border-radius: 6px;
                    align-items: ${isActiveContact ? "flex-end" : "flex-start"};
                    padding: 12px ${isActiveContact ? "12px" : "24px"} 12px
                      ${isActiveContact ? "24px" : "12px"};
                  `}
                >
                  <span
                    className={css`
                      font-weight: bold;
                    `}
                  >
                    {m.username}
                  </span>

                  <span>{m.content}</span>
                  <span
                    style={{
                      opacity: 0.4,
                    }}
                  >
                    {formatDistanceToNow(new Date(m.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </Column>
              </Row>
            );
          })}
      </Column>
    </Column>
  );
};
