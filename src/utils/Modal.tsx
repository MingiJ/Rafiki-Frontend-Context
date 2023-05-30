import { css } from "@emotion/css";
import { FC, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { Theme } from "./Theme";

export const Modal: FC<
  PropsWithChildren<{ open: boolean; close: () => void }>
> = ({ open, close, children }) => {
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
          backdropFilter: "blur(2px)",
        }}
        onClick={close}
      ></div>
      <div
        className={css`
          padding: 12px;
          background-color: ${Theme.colors.gray[600]};
          border-radius: 6px;
          min-width: 300px;
          z-index: 2;
        `}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
