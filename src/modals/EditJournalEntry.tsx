import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Column } from "../utils/Column";
import { css } from "@emotion/css";
import { Theme } from "../utils/Theme";
import { backendUrl } from "../backendUrl";
import { toast } from "react-hot-toast";
import { FC, useContext, useState } from "react";
import { AuthContext } from "../pages/AuthProvider";
import { IJournal } from "../pages/JournalProvider";

const schema = yup
  .object({
    title: yup.string().required(),
    body: yup.string().required(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const EditJournalEntry: FC<{
  initial: FormData;
  onEdit: (item: IJournal) => void;
}> = ({ initial, onEdit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initial,
  });
  const { authUserEmail } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const { getToken } = useContext(AuthContext);
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "journal/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          //@ts-ignore
          _id: data._id,
          owner: getToken(),
        }),
      });
      if (response.status !== 200) throw new Error(await response.text());
      toast.success("Journal entry edited successfully!");
      onEdit({ ...data, owner: authUserEmail() });
    } catch (error: any) {
      toast.error(error.message ?? "Error!");
    }
    setLoading(false);
  };

  return (
    <Column style={{}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Column gap={12}>
          <Column>
            <h2>Edit Journal Entry</h2>
          </Column>
          <Column gap={6}>
            <Column>
              <input
                className={css`
                  padding: 12px;
                  border-radius: 2px;
                  background-color: ${Theme.colors.gray[800]};
                  outline: none;
                  border: none;
                `}
                placeholder="example@example.com"
                {...register("title")}
              />
              {errors.title && (
                <p
                  style={{
                    fontSize: 12,
                    color: Theme.colors.red,
                    textTransform: "capitalize",
                    opacity: 0.7,
                  }}
                >
                  {errors.title.message}
                </p>
              )}
            </Column>
            <Column>
              <textarea
                rows={10}
                className={css`
                  padding: 12px;
                  border-radius: 2px;
                  background-color: ${Theme.colors.gray[800]};
                  outline: none;
                  border: none;
                `}
                placeholder="6 character password"
                {...register("body")}
              />
              {errors.body && (
                <p
                  style={{
                    fontSize: 12,
                    color: Theme.colors.red,
                    textTransform: "capitalize",
                    opacity: 0.7,
                  }}
                >
                  {errors.body.message}
                </p>
              )}
            </Column>

            <button
              disabled={loading}
              className={css`
                padding: 12px;
                border-radius: 2px;
                background-color: ${Theme.colors.primary};
                outline: none;
                border: none;
                cursor: pointer;
              `}
              type="submit"
            >
              {loading ? "Loading..." : "Edit"}
            </button>
          </Column>
        </Column>
      </form>
    </Column>
  );
};
