import { FC } from "react";
import { Column } from "../utils/Column";
import { Row } from "../utils/Row";
import { Theme } from "../utils/Theme";
import { AnonAvatar } from "./AnonAvatar";
import { css } from "@emotion/css";
import { IContact } from "./ChatPage";

export const ContactList: FC<{ contacts: IContact[] }> = ({ contacts }) => {
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
