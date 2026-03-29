import { PulseLoader } from "@/components/ui/loader";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const MarketingPage = lazy(async () => {
  const module = await import("@/pages/home");
  return { default: module.Home };
});

const DashboardPage = lazy(async () => {
  const module = await import("@/pages/dashboard");
  return { default: module.Dashboard };
});

const AnalyticsPage = lazy(async () => {
  const module = await import("@/pages/analytics");
  return { default: module.AIAnalytics };
});

const withSuspense = (element: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex items-center bg-[#0F1419] justify-center min-h-screen">
        <PulseLoader />
      </div>
    }
  >
    {element}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <MainLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(<MarketingPage />) },
      {
        path: "dashboard",
        element: withSuspense(<DashboardPage />),
      },
      {
        path: "analytics",
        element: withSuspense(<AnalyticsPage />),
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <NotFoundPage />,
  // },
]);
