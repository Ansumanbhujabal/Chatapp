import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import store from "./store";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer
      position="bottom-center"
      autoClose={500}
      hideProgressBar={false}
    />
  </>
);

// You can now use `toast` to show alerts anywhere in your app
// Example: toast.success("Success message");
// Example: toast.error("Error message");

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//       <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} transition="slide" />
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
