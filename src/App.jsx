import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage from "./pages/JobPage";
import jobLoader from "./functions/jobloader";
import AddJobPage from "./pages/AddJobPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/react-jobs" element={<HomePage />} />
      <Route path="/react-jobs/jobs" element={<JobsPage />} />
      <Route path="/react-jobs/add-job" element={<AddJobPage />} />
      <Route
        path="/react-jobs/jobs/:id"
        element={<JobPage />}
        loader={jobLoader}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
