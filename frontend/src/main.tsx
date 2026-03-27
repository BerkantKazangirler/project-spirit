import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import DataProvider from "./contexts/data.tsx";

createRoot(document.getElementById("root")!).render(
  <DataProvider>
    <App />
  </DataProvider>,
);
