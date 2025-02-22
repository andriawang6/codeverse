import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import CodeEditor from "./components/CodeEditor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/editor", // New route for the code editor
    element: <CodeEditor />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
