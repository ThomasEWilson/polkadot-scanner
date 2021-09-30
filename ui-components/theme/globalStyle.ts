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
  color: #ffffff;
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
  background: #4F4F4F;
}

*::-webkit-scrollbar-track {
  background: #333333;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}

.eventTableStyles .ant-table-container .ant-table-content table .ant-table-thead tr th:first-child{
    border-top-left-radius: 15px !important;
    border-bottom-left-radius: 15px !important;
  } 

.eventTableStyles .ant-table-container .ant-table-content table .ant-table-thead tr th:last-child{
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
}

.ant-table {
  border-radius: 16px !important;
}
`;
