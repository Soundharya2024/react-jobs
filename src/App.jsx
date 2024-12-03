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
import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(false);

  const url = `https://api.github.com/repos/soundharya2024/jobs-json/contents/jobs.json`;
  //Add New Job
  async function addJob(newJob) {
    const token = prompt(
      "Please enter the GitHub Personal Access Token for accessing jobs.json"
    );
    if (!token) {
      toast.error("Access denied");
    } else {
      setLoading(true);
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
            setLoading(false);
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
              checkLatestDeploymentStatus();
            })
            .catch((error) => {
              console.log("Error updating Jobs JSON file with new job", error);
              toast.error(error.statusText);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("Error reading Jobs JSON file", error);
          setLoading(false);
        });
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
      setLoading(true);
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
            setLoading(false);
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
                checkLatestDeploymentStatus();
              })
              .catch((error) => {
                console.log(
                  `Error updating Jobs JSON file with delete of job with id: ${id}`,
                  error
                );
                toast.error(error.statusText);
                setLoading(false);
              });
          } else {
            console.log(`Job with id: ${id} not found in the JSON file`);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(
            `Error reading Jobs JSON file for delete of job ${id}:`,
            error
          );
          setLoading(false);
        });
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
      setLoading(true);
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
            setLoading(false);
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
              checkLatestDeploymentStatus();
            })
            .catch((error) => {
              console.log(
                `Error updating Jobs JSON file with edit for job with id: ${updateJob.id}:`,
                error
              );
              toast.error(error.statusText);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("Error reading Jobs JSON file", error);
          setLoading(false);
        });
    }
    return;
  }

  async function checkLatestDeploymentStatus() {
    let isSuccess = false;
    let timeoutId;
    let intervalId;

    async function check() {
      fetch(`https://api.github.com/repos/soundharya2024/jobs-json/deployments`)
        .then((response) => response.json())
        .then((data) => fetch(data[0].statuses_url)) // The first deployment in the list is the latest
        .then((response) => response.json())
        .then((data) => {
          console.log("Latest Deployment:", data[0]);
          isSuccess = data[0].state === "success" ? true : false;
          if (isSuccess) {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            setLoading(false);
          } else {
            if (!intervalId) intervalId = setInterval(check, 60000);
          }
        })
        .catch((error) => {
          console.log("Error fetching latest deployment status", error);
          setLoading(false);
        });
    }

    timeoutId = setTimeout(check, 60000);
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route path="/react-jobs/" element={<HomePage />} />
        <Route path="/react-jobs/jobs" element={<JobsPage />} />
        <Route
          path="/react-jobs/add-job"
          element={<AddJobPage addJobSubmit={addJob} loading={loading} />}
        />
        <Route
          path="/react-jobs/jobs/:id"
          element={<JobPage deleteJob={deleteJob} loading={loading} />}
          loader={jobLoader}
        />
        <Route
          path="/react-jobs/edit-job/:id"
          element={
            <EditJobPage updateJobSubmit={updateJob} loading={loading} />
          }
          loader={jobLoader}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
