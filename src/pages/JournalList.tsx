import { FC, useContext, useState } from "react";
import { Column } from "../utils/Column";
import { Row } from "../utils/Row";
import { Theme } from "../utils/Theme";
import { AnonAvatar } from "./AnonAvatar";
import { css } from "@emotion/css";
import { IconButton } from "../utils/IconButton";
import { Modal } from "../utils/Modal";
import { AddGroup } from "./AddGroup";
import { IJournal, JournalContext } from "./JournalProvider";

export const JournalList: FC<{
  journals: IJournal[];
  addJournal: (g: IJournal) => void;
}> = ({ journals, addJournal }) => {
  const { getActiveJournal, setActiveJournal } = useContext(JournalContext);
  const activeJournal = getActiveJournal();
  const [addGroupModal, setAddGroupModal] = useState(false);
  return (
    <>
      <Modal
        open={addGroupModal}
        close={() => {
          setAddGroupModal(false);
        }}
      >
        {/* <AddGroup
          onAdd={(g) => {
            addJournal(g);
            setAddGroupModal(false);
          }}
        /> */}
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
            <h2>Journal Entries</h2>
            <IconButton
              className="material-symbols-outlined"
              onClick={() => {
                setAddGroupModal(true);
              }}
            >
              create
            </IconButton>
          </Row>
          {journals.map((c) => (
            <Row
              onClick={() => {
                if (activeJournal == c) {
                  setActiveJournal(null);
                  return;
                }
                setActiveJournal(c);
              }}
              gap={12}
              style={{
                width: "300px",
                padding: "12px",
                borderRadius: "6px",
              }}
              className={css`
                background: ${activeJournal == c
                  ? "linear-gradient(72.47deg, #7367F0 22.16%, rgba(115, 103, 240, 0.7) 76.47%)"
                  : "transparent"};
                cursor: pointer;
                &:hover {
                  background-color: ${Theme.colors.gray[600]};
                }
              `}
            >
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
                    {c.title}
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
