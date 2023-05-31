import { useContext, useEffect, useState } from "react";
import { Column } from "../utils/Column";
import { Theme } from "../utils/Theme";
import { ContactContext } from "./ContactProvider";
import { get, useForm } from "react-hook-form";
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
import { JournalContext } from "./JournalProvider";
import { IJournal } from "./JournalProvider";

const schema = yup
  .object({
    body: yup.string().required("Cannot save empty journal"),
    title: yup.string().required("Cannot save empty journal"),
    timestamp: yup.number(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface IJournalContent {
  body: string;
  timestamp: number;
  title: string;
}
export const JournalContent = () => {
  const { getActiveJournal } = useContext(JournalContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [journalContent, setJournalContent] = useState<IJournalContent>();
  const { getToken, authUserEmail } = useContext(AuthContext);
  const onSubmit = async (data: FormData) => {
    try {
      setJournalContent({
        title: data.title,
        body: data.body,
        timestamp: Date.now(),
      });
      reset({ title: "", body: "" });
    } catch (error: any) {
      toast.error("Error saving journal entry");
    }
  };

  const [loading, setLoading] = useState(false);
  const fetchJournal = async (activeJournal: IJournal) => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "journal/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: getToken(),
          journal: activeJournal,
        }),
      });
      if (response.status !== 200) throw new Error(await response.text());
      const { journal } = await response.json();
      setJournalContent(journal);
    } catch (error: any) {
      console.error(error);
      toast.error("Error");
    }
    setLoading(false);
  };
  useEffect(() => {
    const activeJournal = getActiveJournal();
    if (!activeJournal) return;
    fetchJournal(activeJournal);
  }, [getActiveJournal]);
  console.log(getActiveJournal(), "I am from get active journal");

  if (!getActiveJournal()) return null;
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <Column
      style={{
        minHeight: "80.2vh",
        maxHeight: "80.2vh",
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
          placeholder="What is the title?..."
          {...register("title")}
        />
      </Row>

      <Row
        style={{
          width: "100%",
          alignItems: "flex-end",
        }}
      >
        <textarea
          className={css`
            padding: 12px;
            border-radius: 2px;
            background-color: ${Theme.colors.gray[600]};
            outline: none;
            border: none;
            width: 100%;
          `}
          placeholder="How are you feeling today..."
          {...register("body")}
        />
        <span
          className="material-symbols-outlined"
          style={{
            padding: "12px",
            cursor: "pointer",
          }}
          onClick={() => {
            if (errors.body && errors.body.message) {
              toast.error(errors.body.message);
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
