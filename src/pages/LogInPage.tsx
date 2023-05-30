import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Column } from "../utils/Column";
import { css } from "@emotion/css";
import { Theme } from "../utils/Theme";
import { backendUrl } from "../backendUrl";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(4, "Password should be atleast 4 characters"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const LogInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
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

  return (
    <Column
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Column gap={12}>
          <Column>
            <h2>Welcome Back to Rafiki</h2>
            <small>Enter your details to Log In</small>
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
                {...register("email")}
              />
              {errors.email && (
                <p
                  style={{
                    fontSize: 12,
                    color: Theme.colors.red,
                    textTransform: "capitalize",
                    opacity: 0.7,
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </Column>
            <Column>
              <input
                className={css`
                  padding: 12px;
                  border-radius: 2px;
                  background-color: ${Theme.colors.gray[800]};
                  outline: none;
                  border: none;
                `}
                type="password"
                placeholder="6 character password"
                {...register("password")}
              />
              {errors.password && (
                <p
                  style={{
                    fontSize: 12,
                    color: Theme.colors.red,
                    textTransform: "capitalize",
                    opacity: 0.7,
                  }}
                >
                  {errors.password.message}
                </p>
              )}
            </Column>
            <Link to="/sign-up">Don't have an account? Sign Up</Link>

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
              {loading ? "Loading..." : "Log In"}
            </button>
          </Column>
        </Column>
      </form>
    </Column>
  );
};
