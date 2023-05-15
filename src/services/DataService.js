const DataService = (() => {
  // const BASE_URL = process.env.REACT_APP_API_ROOT;
  const BASE_URL = 'http://localhost:3001';

  const requestHeaders = (token) => ({ headers: {'Authorization': 'Bearer '+ token, 'Content-Type': 'application/json' } });

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
    return {
      first_name: "Juan Cruz",
      last_name: "Pick",
      email: "alecthompson@mail.com",
      fantasy_name: "Homadessss",
      cuit: "20383242135",
      phone: "990999090"
    }
  }

  const fetchUserJobs = async (id) => {
    return [
      {total: "0", fecha: "12/12/12", estado: "Terminado", info: "info", archivos: "Link"},
      {total: "0", fecha: "12/12/12", estado: "Terminado", info: "info", archivos: "Link"},
      {total: "0", fecha: "12/12/12", estado: "Terminado", info: "info", archivos: "Link"},
      {total: "0", fecha: "12/12/12", estado: "Terminado", info: "info", archivos: "Link"},
    ]
  }

  const fetchJobData = async (id) => {
    return {}
  }

  return {
    fetchPendingJobs: () => fetchPendingJobs(),
    fetchUsers: () => fetchUsers(),
    fetchUserData: (id) => fetchUserData(id),
    fetchUserJobs: (id) => fetchUserJobs(id),
    fetchJobData: (id) => fetchJobData(id),
  }
})();

export default DataService;
