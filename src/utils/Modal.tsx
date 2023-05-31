import { css } from "@emotion/css";
import { FC, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { Theme } from "./Theme";
import styled from "styled-components";

const StyledCloseButton = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  padding: 6px;
  z-index: 3;
`;

export const Modal: FC<
  PropsWithChildren<{ open: boolean; close: () => void; padding?: number }>
> = ({ open, close, children, padding = 12 }) => {
  if (!open) return null;
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        onClick={close}
      ></div>
      <StyledCloseButton onClick={close} className="material-symbols-outlined">
        close
      </StyledCloseButton>
      <div
        className={css`
          @media (max-width: 600px) {
            width: 100%;
            height: 100%;
          }
          padding: ${padding}px;
          background-color: ${Theme.colors.gray[900]};
          border-radius: 6px;
          min-width: 300px;
          z-index: 2;
          box-shadow: 4px 4px 8px ${Theme.colors.gray[950]};
        `}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
