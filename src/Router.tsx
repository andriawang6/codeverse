import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import CodeEditor from "./components/CodeEditor";
import Banking from "./pages/Banking";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/editor", // New route for the code editor
    element: <CodeEditor />,
  },
  {
    path: "/banking", // New route for the code editor
    element: <Banking />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
