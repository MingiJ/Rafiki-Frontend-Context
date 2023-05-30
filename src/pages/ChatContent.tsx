import { useContext, useEffect, useState } from "react";
import { Column } from "../utils/Column";
import { Theme } from "../utils/Theme";
import { ContactContext } from "./ContactProvider";
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
}
export const ChatContent = () => {
  const { getActiveContact } = useContext(ContactContext);
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
      const receipient = getActiveContact();
      if (!receipient) throw new Error("No active receipient");
      if (!socket) throw new Error("Error connecting to server");

      socket.emit("private_message", {
        content: data.message,
        to: receipient.email,
        token: getToken(),
      });

      setMessages((m) =>
        m.concat({
          content: data.message,
          timestamp: Date.now(),
          from: authUserEmail(),
        })
      );
      reset({ message: "" });
    } catch (error: any) {
      toast.error("Error sending message");
    }
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("private_message", (args: any) => {
      const { content, from, timestamp } = args;
      setMessages((m) => m.concat({ content, timestamp, from }));
    });
  }, [socket]);

  const [loading, setLoading] = useState(false);
  const fetchUsers = async (activeContact: IContact) => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "message/chats", {
        method: "POST",
        body: JSON.stringify({
          token: getToken(),
          email: activeContact.email,
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
    const activeContact = getActiveContact();
    if (!activeContact) return;
    fetchUsers(activeContact);
  }, [getActiveContact]);

  if (!getActiveContact()) return null;
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <Column
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: Theme.colors.gray[700],
        justifyContent: "flex-end",
      }}
    >
      <Column
        style={{
          padding: "12px",
        }}
      >
        {messages.map((m) => (
          <Row
            className={css`
              justify-content: ${m.from !== getActiveContact()?.email
                ? "flex-end"
                : "flex-start"};
            `}
          >
            <span
              className={css`
                background-color: ${Theme.colors.gray[600]};
                padding: 12px;
                border-radius: 6px;
              `}
            >
              {m.content}
            </span>
          </Row>
        ))}
      </Column>
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
    </Column>
  );
};
