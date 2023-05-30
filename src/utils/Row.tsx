import styled from "styled-components";

export const Row = styled.div<{
  gap?: number;
}>`
  position: relative;
  display: flex;
  flex-flow: row;
  gap: ${({ gap }) => (gap ? gap : 2)}px;
  align-items: center;
`;
