import { FC, useContext } from "react";
import { Column } from "../utils/Column";
import { Row } from "../utils/Row";
import { Theme } from "../utils/Theme";
import { AnonAvatar } from "./AnonAvatar";
import { css } from "@emotion/css";
import { IContact } from "./ChatPage";
import { ContactContext } from "./ContactProvider";

export const ContactList: FC<{ contacts: IContact[] }> = ({ contacts }) => {
  const { getActiveContact, setActiveContact } = useContext(ContactContext);
  const activeContact = getActiveContact();
  return (
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
        <h2>Contacts</h2>
        {contacts.map((c) => (
          <Row
            onClick={() => {
              if (activeContact == c) {
                setActiveContact(null);
                return;
              }
              setActiveContact(c);
            }}
            gap={12}
            style={{
              width: "300px",
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
  );
};
