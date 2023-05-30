import { useContext, useEffect, useState } from "react";
import { Column } from "../utils/Column";
import { io } from "socket.io-client";
import { backendUrl } from "../backendUrl";
import { AuthContext } from "./AuthProvider";
import toast from "react-hot-toast";
import { Row } from "../utils/Row";
import { Theme } from "../utils/Theme";
import { ContactList } from "./ContactList";
import { AnonAvatar } from "./AnonAvatar";
import { css } from "@emotion/css";
export interface IContact {
  email: string;
  username: string;
}

export const ChatPage = () => {
  const { authUserEmail, getToken } = useContext(AuthContext);
  useEffect(() => {
    const socket = io(backendUrl, { query: { token: getToken() } });
    console.log("connecting");

    socket.on("private_message", (args) => {
      toast(`
        From: ${args.from}
        Message: ${args.content}
      `);
    });

    socket.on("error", () => {
      console.log("An error occurred");
    });
  }, []);

  const [contacts, setContacts] = useState([] as IContact[]);
  const [loading, setLoading] = useState(false);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "user/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) throw new Error(await response.text());
      const { users } = await response.json();
      setContacts(users.filter((u: any) => u.email !== authUserEmail()));
    } catch (error: any) {
      console.error(error);
      toast.error("Error");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <Column
      style={{
        height: "100%",
        position: "relative",
      }}
    >
      <Row
        style={{
          backgroundColor: Theme.colors.gray[800],
          borderRadius: "2px",
          height: "90%",
          position: "relative",
          alignItems: "flex-start",
        }}
      >
        <ContactList contacts={contacts} />
        <Column
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Row
            style={{
              justifyContent: "space-between",
              padding: "12px",
            }}
          >
            <Row
              gap={12}
              style={{
                width: "300px",
              }}
            >
              <AnonAvatar />
              <Column
                style={{
                  flex: 1,
                }}
              >
                <Row
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {"HelloUser"}
                  </span>
                </Row>
                <span
                  style={{
                    opacity: 0.6,
                  }}
                >
                  Bio goes here
                </span>
              </Column>
            </Row>
            <Row gap={12}>
              <span className="material-symbols-outlined">call</span>
              <span className="material-symbols-outlined">search</span>
            </Row>
          </Row>
          <Column
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: Theme.colors.gray[700],
            }}
          ></Column>
        </Column>
      </Row>
    </Column>
  );
};