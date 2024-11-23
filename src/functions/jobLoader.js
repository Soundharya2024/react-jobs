const jobLoader = async ({ params }) => {
  const res = await fetch(
    "https://soundharya2024.github.io/jobs-json/jobs.json"
  );
  const data = await res.json();
  const singleJob = data.jobs.filter((job) => job.id === params.id);
  return singleJob[0]; //Only one job will be returned in a array of objects matching the id
};

export default jobLoader;
