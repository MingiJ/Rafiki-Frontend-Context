import { FC, useContext, useState } from "react";
import { Column } from "../utils/Column";
import { Row } from "../utils/Row";
import { Theme } from "../utils/Theme";
import { AnonAvatar } from "./AnonAvatar";
import { css } from "@emotion/css";
import { IContact } from "./ChatPage";
import { ContactContext, IGroup } from "./ContactProvider";
import { IconButton } from "../utils/IconButton";
import { Modal } from "../utils/Modal";
import { AddGroup } from "./AddGroup";
import { GroupContent } from "./GroupContent";
import { ChatContent } from "./ChatContent";

export const ContactList: FC<{
  contacts: IContact[];
  groups: IGroup[];
  addGroup: (g: IGroup) => void;
}> = ({ contacts, groups, addGroup }) => {
  const { getActiveContact, setActiveContact, getActiveGroup, setActiveGroup } =
    useContext(ContactContext);
  const activeContact = getActiveContact();
  const activeGroup = getActiveGroup();
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [chatContentModal, setChatContentModal] = useState(false);
  const [groupContentModal, setGroupContentModal] = useState(false);

  return (
    <>
      <Modal
        open={groupContentModal}
        close={() => setGroupContentModal(false)}
        padding={0}
      >
        <GroupContent />
      </Modal>
      <Modal
        open={chatContentModal}
        close={() => setChatContentModal(false)}
        padding={0}
      >
        <ChatContent />
      </Modal>
      <Modal
        open={addGroupModal}
        close={() => {
          setAddGroupModal(false);
        }}
      >
        <AddGroup
          onAdd={(g) => {
            addGroup(g);
            setAddGroupModal(false);
          }}
        />
      </Modal>
      <Column
        gap={36}
        style={{
          padding: "12px",
        }}
      >
        <Row
          gap={12}
          style={{
            width: "100%",
          }}
        >
          <AnonAvatar />
          <input
            className={css`
              flex: 1;
              padding: 12px;
              border-radius: 2px;
              background-color: transparent;
              border: 2px solid ${Theme.colors.gray[600]};
              outline: none;
              border-radius: 24px;
            `}
          />
        </Row>
        <Column gap={12}>
          <Row
            style={{
              justifyContent: "space-between",
            }}
          >
            <h2>Groups</h2>
            <IconButton
              className="material-symbols-outlined"
              onClick={() => {
                setAddGroupModal(true);
              }}
            >
              group_add
            </IconButton>
          </Row>
          {groups.map((c) => (
            <Row
              onClick={() => {
                if (window.innerWidth <= 600) {
                  setActiveGroup(c);
                  setGroupContentModal(true);
                  return;
                }
                if (activeGroup == c) {
                  setActiveGroup(null);
                  return;
                }
                setActiveGroup(c);
              }}
              gap={12}
              style={{
                padding: "12px",
                borderRadius: "6px",
              }}
              className={css`
                background: ${activeGroup == c
                  ? "linear-gradient(72.47deg, #7367F0 22.16%, rgba(115, 103, 240, 0.7) 76.47%)"
                  : "transparent"};
                cursor: pointer;
                &:hover {
                  background-color: ${Theme.colors.gray[600]};
                }
                width: 300px;
                @media (max-width: 600px) {
                  width: 100%;
                }
              `}
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
                    {c.name}
                  </span>
                  <span
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    12 March
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
          ))}
        </Column>
        <Column gap={12}>
          <Row
            style={{
              justifyContent: "space-between",
            }}
          >
            <h2>Chats</h2>
          </Row>
          {contacts.map((c) => (
            <Row
              onClick={() => {
                if (window.innerWidth <= 600) {
                  setActiveContact(c);
                  setChatContentModal(true);
                  return;
                }
                if (activeContact == c) {
                  setActiveContact(null);
                  return;
                }
                setActiveContact(c);
              }}
              gap={12}
              style={{
                padding: "12px",
                borderRadius: "6px",
              }}
              className={css`
                background: ${activeContact == c
                  ? "linear-gradient(72.47deg, #7367F0 22.16%, rgba(115, 103, 240, 0.7) 76.47%)"
                  : "transparent"};
                cursor: pointer;
                &:hover {
                  background-color: ${Theme.colors.gray[600]};
                }
                width: 300px;
                @media (max-width: 600px) {
                  width: 100%;
                }
              `}
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
                    key={c.email}
                  >
                    {c.username}
                  </span>
                  <span
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    12 March
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
          ))}
        </Column>
      </Column>
    </>
  );
};
