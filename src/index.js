import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { FaBold } from "react-icons/fa";

const container = document.getElementById("root");
const root = createRoot(container);

const customTheme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'helvetica', sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        fontSize: "1rem",
      },
      table: {
        bg: mode("#fdfdf5", "#212121")(props),
      },
      thead: {
        bg: mode("#55624d", "gray.400")(props),
      },
      th: {
        color: "#ffffff !important",
        textTransform: "capitalize !important",
        cursor: "pointer",
      },
    }),
  },
});

root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
