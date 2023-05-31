import { Outlet, useSearchParams } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { Column } from "../utils/Column";
import { Row } from "../utils/Row";
import { css } from "@emotion/css";
import { Theme } from "../utils/Theme";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { ContactProvider } from "./ContactProvider";
import { JournalProvider } from "./JournalProvider";
import styled from "styled-components";
const StyledMenuToggler = styled.span`
  @media (min-width: 600px) {
    display: none;
  }
`;
export const Dashboard = () => {
  const { logOut } = useContext(AuthContext);
  const [sideOpen, setSideOpen] = useState(false);
  return (
    <JournalProvider>
      <ContactProvider>
        <Row
          gap={8}
          style={{
            height: "100%",
            position: "relative",
            alignItems: "flex-start",
          }}
        >
          <div
            onClick={() => {
              setSideOpen(false);
            }}
            className={css`
              z-index: 2;
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              backdrop-filter: blur(2px);
              display: ${sideOpen ? "flex" : "none"};
              @media (min-width: 600px) {
                display: none;
              }
            `}
            id={"overlay"}
          ></div>
          <div
            className={css`
              @media (max-width: 600px) {
                position: absolute;
                transform: translateX(${sideOpen ? 0 : -300}px);
                box-shadow: 2px 4px 4px ${Theme.colors.gray[900]};
                transition: all 0.2s;
              }
              z-index: 3;
              height: 100%;
            `}
          >
            <Sidebar />
          </div>
          <Column
            gap={24}
            style={{
              padding: "12px",
              width: "100%",
              height: "100%",
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

              <Row>
                <span
                  className="material-symbols-outlined"
                  onDoubleClick={() => {
                    logOut();
                  }}
                >
                  person
                </span>
                <StyledMenuToggler
                  className="material-symbols-outlined"
                  onClick={() => {
                    setSideOpen(true);
                  }}
                >
                  menu
                </StyledMenuToggler>
              </Row>
            </Row>
            <Outlet />
          </Column>
        </Row>
      </ContactProvider>
    </JournalProvider>
  );
};
