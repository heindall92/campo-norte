import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DataHubProvider } from "@/lib/data";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataHubProvider>
      <App />
    </DataHubProvider>
  </StrictMode>,
);
