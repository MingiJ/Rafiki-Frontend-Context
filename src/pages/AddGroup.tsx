import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Column } from "../utils/Column";
import { css } from "@emotion/css";
import { Theme } from "../utils/Theme";
import { backendUrl } from "../backendUrl";
import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { produce } from "immer";
import Select from "react-select";
import { IGroup } from "./ContactProvider";
import { v4 } from "uuid";

type FormData = {
  name: string;
  members: string[];
};

export const AddGroup: FC<{ onAdd: (group: IGroup) => void }> = ({ onAdd }) => {
  const { logIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "user/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status !== 200) throw new Error(await response.text());

      const { token } = await response.json();
      logIn(token);

      navigate("/app/chat");
    } catch (error: any) {
      toast.error(error.message ?? "Error!");
    }
    setLoading(false);
  };
  const [formData, setFormData] = useState<FormData>({
    name: "",
    members: [],
  });
  const { authUserEmail } = useContext(AuthContext);
  const [users, setUsers] = useState(
    [] as { email: string; username: string }[]
  );
  const [members, setMembers] = useState([] as { email: string }[]);
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
      setUsers(users.filter((u: any) => u.email !== authUserEmail()));
    } catch (error: any) {
      console.error(error);
      toast.error("Error");
    }
    setLoading(false);
  };
  const { getToken } = useContext(AuthContext);
  const createGroup = async (data: IGroup) => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status !== 200) throw new Error(await response.text());
      onAdd(data);
    } catch (error: any) {
      console.error(error);
      toast.error("Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Column
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minWidth: "400px",
        width: "100%",
        padding: "12px 6px 12px 6px",
      }}
    >
      <Column gap={24} style={{ width: "100%" }}>
        <Column>
          <h2>Create Group</h2>
        </Column>
        <Column gap={16}>
          <Column gap={6}>
            <label>Name</label>
            <input
              className={css`
                padding: 12px;
                border-radius: 2px;
                background-color: ${Theme.colors.gray[100]};
                color: ${Theme.colors.gray[950]};
                outline: none;
                border: none;
              `}
              onChange={({ target: { value } }) => {
                setFormData(
                  produce((draft) => {
                    draft.name = value;
                  })
                );
              }}
            />
          </Column>
          <Column gap={6}>
            <label>Members</label>
            <Column
              className={css`
                & * {
                  color: ${Theme.colors.gray[950]};
                }
              `}
            >
              <Select
                defaultValue={[] as any[]}
                isMulti
                name="Members"
                options={users.map(({ email, username }) => ({
                  label: username,
                  value: email,
                }))}
                onChange={(newValue) => {
                  console.log(newValue);
                  setMembers(newValue.map((n) => ({ email: n.value })));
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Column>
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
            onClick={() => {
              createGroup({
                members: members.map(({ email }) => email),
                owner: getToken(),
                name: formData.name,
                id: v4(),
              });
            }}
          >
            {loading ? "Loading..." : "Add"}
          </button>
        </Column>
      </Column>
    </Column>
  );
};
