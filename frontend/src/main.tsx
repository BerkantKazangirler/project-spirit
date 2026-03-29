import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { DataProvider } from "@/contexts";
import { router } from "../router.tsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <DataProvider>
    {/* <App /> */}
    <RouterProvider router={router} />
  </DataProvider>,
);
