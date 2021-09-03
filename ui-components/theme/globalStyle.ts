import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html, body {
  margin: 0;
  padding: 0;

  /* font */
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-variant-numeric: tabular-nums;
  font-weight: 400;
  color: ${({ theme }) => theme.text.primary};
}


button {
  border: none;
  box-shadow: none;
  outline: none;
  appearance: none;
}

p, ul {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

input {
  min-width: 0;
  appearance: none;
  border: none;
  box-shadow: none;
}

p, span {
  cursor: inherit;
}

*::-webkit-scrollbar {
  width: 2px;
  border-radius: 2px;
}

*::-webkit-scrollbar-thumb {
  background: ${({ theme }) => theme.colors.gray2};
}

*::-webkit-scrollbar-track {
  background: ${({ theme }) => theme.colors.gray1};
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}
`;
