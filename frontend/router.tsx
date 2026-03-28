import { MarketingPage } from "@/pages";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <MainLayout />,
    // errorElement: <ErrorPage />,
    children: [{ index: true, element: <MarketingPage /> }],
  },
  // {
  //   path: "*",
  //   element: <NotFoundPage />,
  // },
]);
