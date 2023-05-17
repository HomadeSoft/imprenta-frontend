const DataService = (() => {
  // const BASE_URL = process.env.REACT_APP_API_ROOT;
  const BASE_URL = 'http://localhost:3001';

  const requestHeaders = (token) => ({ headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" } });

  const fetchUsers = async () => {
    const url = `${BASE_URL}/users/allUsers`;
    const token = "2"

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.users, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchPendingJobs = async () => {
    const url = `${BASE_URL}/jobs/allJobs`;
    const token = "2"

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.jobs, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchUserData = async (id) => {
    const url = `${BASE_URL}/users/user?userId=${id}`;
    const token = "2"

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchUserJobs = async (id) => {
    const url = `${BASE_URL}/jobs/userJobs?userId=${id}`;
    const token = "2"

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.jobs, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchJobData = async (id) => {
    const url = `${BASE_URL}/jobs/job?id=${id}`;
    const token = "2"

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const submitJob = async (job) => {
    const url = `${BASE_URL}/jobs/create`;
    const token = "2";

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(job),
      headers: requestHeaders(token),
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  return {
    fetchPendingJobs: () => fetchPendingJobs(),
    fetchUsers: () => fetchUsers(),
    fetchUserData: (id) => fetchUserData(id),
    fetchUserJobs: (id) => fetchUserJobs(id),
    fetchJobData: (id) => fetchJobData(id),
    submitJob: (job) => submitJob(job),
  }
})();

export default DataService;
