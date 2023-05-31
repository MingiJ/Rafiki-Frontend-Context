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
import { AddJournalEntry } from "../modals/AddJournalEntry";
import { AuthContext } from "./AuthProvider";
import { EditJournalEntry } from "../modals/EditJournalEntry";
import { produce } from "immer";
import { formatDistanceToNow } from "date-fns";

export const JournalList: FC<{
  journals: IJournal[];
  addJournal: (g: IJournal) => void;
  editJournal: (newJournal: IJournal, index: number) => void;
}> = ({ journals, addJournal, editJournal }) => {
  const { getActiveJournal, setActiveJournal } = useContext(JournalContext);
  const activeJournal = getActiveJournal();
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [editJournalEntry, setEditJournalEntry] = useState({
    open: false,
    index: 0,
  });
  const { authUserEmail } = useContext(AuthContext);
  return (
    <>
      <Modal
        open={editJournalEntry.open}
        close={() => {
          setEditJournalEntry(
            produce((draft) => {
              draft.open = false;
            })
          );
        }}
      >
        {
          <EditJournalEntry
            initial={journals[editJournalEntry.index] as IJournal}
            onEdit={(edited: IJournal) => {
              editJournal(edited, editJournalEntry.index);
              setEditJournalEntry(
                produce((draft) => {
                  draft.open = false;
                })
              );
            }}
          />
        }
      </Modal>
      <Modal
        open={addGroupModal}
        close={() => {
          setAddGroupModal(false);
        }}
      >
        <AddJournalEntry
          onAdd={(j) => {
            addJournal({
              ...j,
              owner: authUserEmail(),
            });
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
            placeholder="Search Journal Entry..."
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
          {journals.map((journal, journalIndex) => (
            <Row
              onClick={() => {
                if (activeJournal == journal) {
                  setActiveJournal(null);
                  return;
                }
                setActiveJournal(journal);
              }}
              gap={12}
              style={{
                padding: "12px",
                borderRadius: "6px",
              }}
              className={css`
                background: ${activeJournal == journal
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
                    {journal.title}
                  </span>
                  <Column
                    gap={4}
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        opacity: 0.6,
                      }}
                    >
                      {(journal as any).timestamp !== undefined
                        ? formatDistanceToNow(Date.now(), { addSuffix: true })
                        : "A while back"}
                    </span>
                    <span
                      className={css`
                        &:hover {
                          color: lightseagreen;
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditJournalEntry({
                          open: true,
                          index: journalIndex,
                        });
                      }}
                      style={{
                        borderBottom: "2px solid #fafafa",
                      }}
                    >
                      Edit
                    </span>
                  </Column>
                </Row>
                <span
                  style={{
                    opacity: 0.6,
                  }}
                >
                  {journal.body.substring(0, 20) + "..."}
                </span>
              </Column>
            </Row>
          ))}
        </Column>
      </Column>
    </>
  );
};
