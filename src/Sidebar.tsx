import { Link, useLocation } from "react-router-dom";
import { Column } from "./utils/Column";
import { Theme } from "./utils/Theme";
import styled from "styled-components";
import { Row } from "./utils/Row";

interface IMenu {
  name: string;
  route: string;
}

const MENU: IMenu[] = [
  {
    name: "Chat",
    route: "/app/chat",
  },
  {
    name: "Journal",
    route: "/app/journal",
  },
];

const StyledLink = styled(Link)<{
  selected: boolean;
}>`
  text-decoration: none;
  width: 100%;
  padding: 12px;
  border-radius: ${Theme.spacing[0]};
  background: ${({ selected }) =>
    selected
      ? "linear-gradient(72.47deg, #7367F0 22.16%, rgba(115, 103, 240, 0.7) 76.47%)"
      : "transparent"};
  box-shadow: ${({ selected }) =>
    selected ? "0px 2px 6px rgba(115, 103, 240, 0.48)" : ""};
  &:hover {
    background: ${({ selected }) =>
      selected
        ? "linear-gradient(72.47deg, #7367F0 22.16%, rgba(115, 103, 240, 0.7) 76.47%)"
        : Theme.colors.gray[700]};
  }
`;

export const Sidebar = () => {
  const location = useLocation();
  return (
    <Column
      style={{
        width: "250px",
        backgroundColor: Theme.colors.gray[800],
        height: "100%",
        position: "relative",
        padding: "12px",
        gap: "24px",
      }}
    >
      <Row gap={4}>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "36px",
          }}
        >
          splitscreen_right
        </span>
        <h2>Rafiki</h2>
      </Row>
      <Column gap={12}>
        {MENU.map((item) => (
          <StyledLink
            selected={location.pathname.includes(item.route)}
            to={item.route}
          >
            {item.name}
          </StyledLink>
        ))}
      </Column>
    </Column>
  );
};
