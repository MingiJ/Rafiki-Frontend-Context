import { createContext, useContext, useEffect, useState } from "react";
import { Column } from "../utils/Column";
import { Socket, io } from "socket.io-client";
import { backendUrl } from "../backendUrl";
import { AuthContext } from "./AuthProvider";
import toast from "react-hot-toast";
import { Row } from "../utils/Row";
import { Theme } from "../utils/Theme";
import { ContactList } from "./ContactList";
import { AnonAvatar } from "./AnonAvatar";
import { css } from "@emotion/css";
import { ContactContext, ContactProvider, IGroup } from "./ContactProvider";
import { ChatContent } from "./ChatContent";
import { GroupContent } from "./GroupContent";
export interface IContact {
  email: string;
  username: string;
}

export const SocketContext = createContext({
  socket: null as null | Socket,
});

export const ChatPage = () => {
  const { authUserEmail, getToken } = useContext(AuthContext);
  const [socket, setSocket] = useState(null as null | Socket);
  useEffect(() => {
    const socket = io(backendUrl, { query: { token: getToken() } });
    console.log("connecting");
    setSocket(socket);

    socket.on("error", () => {
      console.log("An error occurred");
    });
  }, [getToken]);
  const [groups, setGroups] = useState([] as IGroup[]);
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
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "group/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: getToken(),
        }),
      });
      if (response.status !== 200) throw new Error(await response.text());
      const { groups } = await response.json();
      setGroups(groups);
    } catch (error: any) {
      console.error(error);
      toast.error("Error");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);
  const { getActiveContact } = useContext(ContactContext);
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <SocketContext.Provider value={{ socket }}>
      <Column
        style={{
          position: "relative",
          height: "90%",
        }}
      >
        <Row
          style={{
            backgroundColor: Theme.colors.gray[800],
            borderRadius: "2px",
            position: "relative",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          <ContactList contacts={contacts} groups={groups} />
          <Column
            style={{
              flex: 1,
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
            {getActiveContact() ? <ChatContent /> : <GroupContent />}
          </Column>
        </Row>
      </Column>
    </SocketContext.Provider>
  );
};
