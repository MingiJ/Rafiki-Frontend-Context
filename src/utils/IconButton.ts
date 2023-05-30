import styled from "styled-components";
import { Theme } from "./Theme";

export const IconButton = styled.span`
  padding: 6px;
  background-color: ${Theme.colors.gray[700]};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: ${Theme.colors.gray[600]};
  }
`;
