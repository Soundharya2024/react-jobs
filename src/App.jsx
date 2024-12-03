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
import EditJobPage from "./pages/EditJobPage";
import { toast } from "react-toastify";

export default function App() {
  const url = `https://api.github.com/repos/soundharya2024/jobs-json/contents/jobs.json`;
  //Add New Job
  async function addJob(newJob) {
    const token = prompt(
      "Please enter the GitHub Personal Access Token for accessing jobs.json"
    );
    if (!token) {
      toast.error("Access denied");
    } else {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const currentSHA = data.sha;
          let jsonObject;
          try {
            // Decode Base64 to string
            const jsonString = atob(data.content);
            // Parse string to JSON
            jsonObject = JSON.parse(jsonString);
          } catch (error) {
            console.error("Error decoding Base64:", error);
          }

          //Add id to the new job
          newJob.id = (jsonObject.jobs.length + 1).toString();

          //Adding new job to the existing json object
          jsonObject.jobs.push(newJob);
          console.log(jsonObject);

          //proceed to update the file with the SHA
          fetch(url, {
            method: "PUT",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              message: "Updated jobs.json",

              content: btoa(JSON.stringify(jsonObject)), // Encode data as base64

              sha: currentSHA,
            }),
          })
            .then((response) => {
              if (response.ok) return response.json();
              return Promise.reject(response);
            })
            .then((data) => {
              console.log("Jobs JSON File updated with new job:", data);
              toast.success("Job added successfully");
            })
            .catch((error) => {
              console.log("Error updating Jobs JSON file with new job", error);
              toast.error(error.statusText);
            });
        })
        .catch((error) => console.log("Error reading Jobs JSON file", error));

      //checkLatestDeploymentStatus();
    }
    return;
  }

  //Delete Job
  async function deleteJob(id) {
    const token = prompt(
      "Please enter the GitHub Personal Access Token for accessing jobs.json"
    );
    if (!token) {
      toast.error("Access denied");
    } else {
      fetch(url)
        .then((response) => response.json())

        .then((data) => {
          const currentSHA = data.sha;
          let jsonObject;
          try {
            // Decode Base64 to string
            const jsonString = atob(data.content);
            // Parse string to JSON
            jsonObject = JSON.parse(jsonString);
          } catch (error) {
            console.error("Error decoding Base64:", error);
          }

          `//Deleting job with ${id} in the existing json object`;
          const jsonArray = jsonObject.jobs;
          // Find the index of the object with the matching ID
          const index = jsonArray.findIndex((obj) => obj.id === id);

          // If the object is found, delete it from the array
          if (index !== -1) {
            jsonArray.splice(index, 1);

            //proceed to update the file after deleting with the SHA
            fetch(url, {
              method: "PUT",

              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                message: `Updated jobs.json with delete of job with id: ${id}`,

                content: btoa(JSON.stringify(jsonObject)), // Encode data as base64

                sha: currentSHA,
              }),
            })
              .then((response) => {
                if (response.ok) return response.json();
                return Promise.reject(response);
              })
              .then((data) => {
                console.log(
                  `Jobs JSON File updated with delete of job with id: ${id}:`,
                  data
                );
                toast.success("Job deleted succesfully");
              })
              .catch((error) => {
                console.log(
                  `Error updating Jobs JSON file with delete of job with id: ${id}`,
                  error
                );
                toast.error(error.statusText);
              });
          } else {
            console.log(`Job with id: ${id} not found in the JSON file`);
          }
        })
        .catch((error) =>
          console.log(
            `Error reading Jobs JSON file for delete of job ${id}:`,
            error
          )
        );
    }
    return;
  }

  //Update Job
  async function updateJob(updateJob) {
    const token = prompt(
      "Please enter the GitHub Personal Access Token for accessing jobs.json"
    );
    if (!token) {
      toast.error("Access denied");
    } else {
      fetch(url)
        .then((response) => response.json())

        .then((data) => {
          const currentSHA = data.sha;
          let jsonObject;
          try {
            // Decode Base64 to string
            const jsonString = atob(data.content);
            // Parse string to JSON
            jsonObject = JSON.parse(jsonString);
          } catch (error) {
            console.error("Error decoding Base64:", error);
          }

          `//Editing the job with id:${updateJob.id} in the existing json object`;
          const jsonArray = jsonObject.jobs;
          // Find the index of the object with the matching ID
          const index = jsonArray.findIndex((obj) => obj.id === updateJob.id);

          // If the object is found, edit it in the array
          if (index !== -1) {
            jsonArray[index] = updateJob;
          }
          console.log(jsonObject);

          //proceed to update the file with the SHA
          fetch(url, {
            method: "PUT",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              message: "Updated jobs.json",

              content: btoa(JSON.stringify(jsonObject)), // Encode data as base64

              sha: currentSHA,
            }),
          })
            .then((response) => {
              if (response.ok) return response.json();
              return Promise.reject(response);
            })
            .then((data) => {
              console.log(
                `Jobs JSON File updated with edit for job with id: ${updateJob.id}:`,
                data
              );
              toast.success("Job edited successfully");
            })
            .catch((error) => {
              console.log(
                `Error updating Jobs JSON file with edit for job with id: ${updateJob.id}:`,
                error
              );

              toast.error(error.statusText);
            });
        })
        .catch((error) => console.log("Error reading Jobs JSON file", error));

      //checkLatestDeploymentStatus();
    }
    return;
  }

  // async function checkLatestDeploymentStatus() {
  //   try {
  //     const response = await fetch(
  //       `https://api.github.com/repos/soundharya2024/jobs-json/deployments`
  //     );

  //     const data = await response.json();
  //     data.sort((a, b) => b.created_at.localeCompare(a.created_at));
  //     console.log("Latest Deployment:", data[0]); // The first deployment in the sorted list is the latest

  //     fetch(data[0].statuses_url)
  //       .then((response) => response.json())
  //       .then((data) => console.log("Latest Deployment Status:", data))
  //       .catch((error) =>
  //         console.log("Error fetching latest deployment status", error)
  //       );
  //   } catch (error) {
  //     console.log("Error fetching deployment for the repo", error);
  //   }
  // }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route path="/react-jobs" element={<HomePage />} />
        <Route path="/react-jobs/jobs" element={<JobsPage />} />
        <Route
          path="/react-jobs/add-job"
          element={<AddJobPage addJobSubmit={addJob} />}
        />
        <Route
          path="/react-jobs/jobs/:id"
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
        />
        <Route
          path="/react-jobs/edit-job/:id"
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
