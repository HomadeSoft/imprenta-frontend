import axios from "axios";

const DataService = (() => {
  const BASE_URL = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';
  //const BASE_URL = 'http://localhost:3001';



  const requestHeaders = (token) => ({ headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" } });
  const requestPostHeaders = (token) => ({ 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' });

  const fetchUsers = async (token) => {
    const url = `${BASE_URL}/users/allUsers`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.users, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchPendingJobs = async (token) => {
    const url = `${BASE_URL}/jobs/allJobs`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.jobs, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchUserData = async (token, id) => {
    const url = `${BASE_URL}/users/user?userId=${id}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchUserJobs = async (token, id) => {
    const url = `${BASE_URL}/jobs/userJobs?userId=${id}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.jobs, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchJobData = async (token, id) => {
    const url = `${BASE_URL}/jobs/job?id=${id}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const submitJob = async (token, job) => {
    const url = `${BASE_URL}/jobs/create`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify(job)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const savePrices = async (token, prices) => {
    const url = `${BASE_URL}/json_prices/save`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify({ prices: prices })
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data.prices.data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchPrices = async (token) => {
    // console.log(token)
    // debugger
    const url = `${BASE_URL}/json_prices`;
    console.log(requestHeaders(token))
    // debugger
    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data.prices.data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const updateJobPrice = async (token, id, price) => {
    const url = `${BASE_URL}/jobs/update`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify({ id: id, total_price_cents: price })
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const changeStatus = async (token, id, newStatus) => {
    const url = `${BASE_URL}/jobs/changeStatus`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify({ id: id, new_status: newStatus })
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const uploadToServer = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      await axios.post(`${BASE_URL}/upload/a`, formData);
      alert('El trabajo se subio exitosamente');
    } catch (error) {
      alert('Ups, algo salio mal');
      console.error(error);
    }

  }

  return {
    fetchPendingJobs: (token) => fetchPendingJobs(token),
    fetchUsers: (token) => fetchUsers(token),
    fetchUserData: (token, id) => fetchUserData(token, id),
    fetchUserJobs: (token, id) => fetchUserJobs(token, id),
    fetchJobData: (token, id) => fetchJobData(token, id),
    submitJob: (token, job) => submitJob(token, job),
    savePrices: (token, prices) => savePrices(token, prices),
    fetchPrices: (token) => fetchPrices(token),
    updateJobPrice: (token, id, price) => updateJobPrice(token, id, price),
    changeStatusPending: (token, id) => changeStatus(token, id, "pending"),
    changeStatusInProgress: (token, id) => changeStatus(token, id, "in_progress"),
    changeStatusCanceled: (token, id) => changeStatus(token, id, "canceled"),
    changeStatusFinished: (token, id) => changeStatus(token, id, "finished"),
    uploadToServer: (file, folder) => uploadToServer(file, folder),
  }
})();

export default DataService;
