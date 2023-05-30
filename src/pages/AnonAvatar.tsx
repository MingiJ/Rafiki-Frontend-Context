import { Theme } from "../utils/Theme";

export function AnonAvatar() {
  return (
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor: Theme.colors.gray[700],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "32px",
        }}
      >
        person
      </span>
    </div>
  );
}
