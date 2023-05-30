import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { Column } from "../utils/Column";
import { Row } from "../utils/Row";
import { css } from "@emotion/css";
import { Theme } from "../utils/Theme";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const Dashboard = () => {
  const { logOut } = useContext(AuthContext);
  return (
    <Row
      gap={8}
      style={{
        height: "100%",
        position: "relative",
        alignItems: "flex-start",
      }}
    >
      <Sidebar />
      <Column
        gap={24}
        style={{
          padding: "12px",
          width: "100%",
        }}
      >
        <Row
          className={css`
            box-shadow: 0px 2px 7px 1px rgba(51, 48, 60, 0.03),
              0px 4px 7px 0px rgba(51, 48, 60, 0.02),
              0px 1px 4px 2px rgba(51, 48, 60, 0.01);
            width: 100%;
            padding: 12px;
            border-radius: ${Theme.spacing[0]};
            background-color: ${Theme.colors.gray[800]};
            justify-content: space-between;
          `}
        >
          <span className="material-symbols-outlined">dark_mode</span>
          <span
            className="material-symbols-outlined"
            onDoubleClick={() => {
              logOut();
            }}
          >
            person
          </span>
        </Row>
        <Outlet />
      </Column>
    </Row>
  );
};
