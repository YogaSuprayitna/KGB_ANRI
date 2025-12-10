import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./styles/App.css";
import { App as AntdApp, ConfigProvider } from "antd";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);
