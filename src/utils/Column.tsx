import styled from "styled-components";

export const Column = styled.div<{
  gap?: number;
}>`
  display: flex;
  flex-flow: column;
  gap: ${({ gap }) => (gap ? gap : 2)}px;
`;
