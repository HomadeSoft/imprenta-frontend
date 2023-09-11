import axios from "axios";
// import { accordionSummaryClasses } from "@mui/material";

const DataService = (() => {
  const BASE_URL = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';
  //const BASE_URL = 'http://localhost:3001';

  const requestHeaders = (token) => ({ headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" } });
  const requestPostHeaders = (token) => ({ 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' });

  const fetchUsers = async (token, searchTerm) => {
    let queryString = '';
    if (searchTerm) {
      queryString = queryString.concat(`q[first_name_or_last_name_or_fantasy_name_or_email_or_cuit_cont]=${searchTerm}`)
    }

    const url = `${BASE_URL}/users/allUsers?${queryString}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.users, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchPendingJobs = async (token, searchTerm) => {
    let queryString = '';
    if (searchTerm) {
      queryString = queryString.concat(`q[user_first_name_or_user_last_name_or_user_fantasy_name_or_user_email_cont]=${searchTerm}`)
    }
    // if(pageIndex){
    //   queryString = queryString.concat(`page=${pageIndex}`)
    // }
    const url = `${BASE_URL}/jobs/pendingJobs?${queryString}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.jobs, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchPendingJobsFromUser = async (token, userEmail) => {
    const url = `${BASE_URL}/jobs/userJobsByEmail?userEmail=${userEmail}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data?.jobs, meta: data?.meta, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchAllJobs = async (token, searchTerm) => {
    let queryString = '';
    if (searchTerm) {
      queryString = queryString.concat(`q[user_first_name_or_user_last_name_or_user_fantasy_name_or_user_email_cont]=${searchTerm}`)
    }

    const url = `${BASE_URL}/jobs/allJobs?${queryString}`;

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

  const fetchUserDataByEmail = async (token, email) => {
    // TODO: Add email parameter on Rails
    const url = `${BASE_URL}/users/user?email=${email}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        if (data?.status === "error") {
          throw new Error("Usuario inexistente")
        }
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

  const deleteJob = async (token, id) => {
    const url = `${BASE_URL}/jobs/delete?id=${id}`;

    return fetch(url, { method: 'POST', headers: requestHeaders(token) })
      .then((response) => response.ok)
      .then((success) => {
        return { success: success, error: null }
      })
      .catch((err) => {
        return { success: null, error: err }
      })
  }

  const setDownloadedFile = async (token, id) => {
    const url = `${BASE_URL}/jobs/setDownloaded?id=${id}`;

    return fetch(url, { method: 'POST', headers: requestHeaders(token) })
      .then((response) => response.ok)
      .then((success) => {
        return { success: success, error: null }
      })
      .catch((err) => {
        return { success: null, error: err }
      })
  }

  const setNotDownloadedFile = async (token, id) => {
    const url = `${BASE_URL}/jobs/setNotDownloaded?id=${id}`;

    return fetch(url, { method: 'POST', headers: requestHeaders(token) })
      .then((response) => response.ok)
      .then((success) => {
        return { success: success, error: null }
      })
      .catch((err) => {
        return { success: null, error: err }
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
        console.error(err);
        return { data: null, error: 'Ups, algo salio mal' }
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
    const url = `${BASE_URL}/json_prices`;
    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data.prices.data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchProducts = async (token, searchTerm) => {
    let queryString = '';
    if (searchTerm) {
      queryString = queryString.concat(`q[medida_or_tipo_papel_cont]=${searchTerm}`)
    }

    const url = `${BASE_URL}/productos?${queryString}`;

    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data.productos, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchAvailableProducts = async (token) => {
    const url = `${BASE_URL}/productos?q[enabled_eq]=true`;
    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data.productos, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchTroquelados = async (token) => {
    const url = `${BASE_URL}/troquelados`;
    return fetch(url, requestHeaders(token))
      .then((response) => response.json())
      .then((data) => {
        return { data: data.troquelados, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const fetchProductData = async (id) => {
    const url = `${BASE_URL}/productos/${id}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const saveProducto = async (token, producto) => {
    const url = `${BASE_URL}/productos/${producto.id}`;

    return fetch(url, {
      method: 'PUT',
      headers: requestPostHeaders(token),
      body: JSON.stringify(producto)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const updateProductPrice = async (token, price) => {
    const url = `${BASE_URL}/precios/${price.id}`;

    return fetch(url, {
      method: 'PUT',
      headers: requestPostHeaders(token),
      body: JSON.stringify(price)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const createProductPrice = async (token, price) => {
    const url = `${BASE_URL}/precios`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify(price)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const deleteProductPrice = async (token, price) => {
    const url = `${BASE_URL}/precios/${price.id}`;

    return fetch(url, {
      method: 'DELETE',
      headers: requestPostHeaders(token)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  const createProduct = async (token, product) => {
    const url = `${BASE_URL}/productos`;
    console.log(JSON.stringify(product));
    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify(product)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data, error: null }
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

  const updateJobFile = async (token, id, fileNames) => {
    const url = `${BASE_URL}/jobs/update`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify({ id: id, file_names: fileNames })
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
      return { data: "", error: null }
    } catch (error) {
      console.error(error);
      return { data: null, error: 'Ups, algo salio mal' }
    }
  }

  const saveUser = async (token, user) => {
    const url = `${BASE_URL}/users/update`;

    return fetch(url, {
      method: 'POST',
      headers: requestPostHeaders(token),
      body: JSON.stringify(user)
    })
      .then((response) => response.json())
      .then((data) => {
        return { data: data.user.data, error: null }
      })
      .catch((err) => {
        return { data: null, error: err }
      })
  }

  return {
    fetchPendingJobs: (token, searchTerm = null) => fetchPendingJobs(token, searchTerm),
    fetchPendingJobsFromUser: (token, userEmail) => fetchPendingJobsFromUser(token, userEmail),
    fetchAllJobs: (token, searchTerm = null) => fetchAllJobs(token, searchTerm),
    fetchUsers: (token, searchTerm = null) => fetchUsers(token, searchTerm),
    fetchUserData: (token, id) => fetchUserData(token, id),
    fetchUserDataByEmail: (token, email) => fetchUserDataByEmail(token, email),
    fetchUserJobs: (token, id) => fetchUserJobs(token, id),
    fetchJobData: (token, id) => fetchJobData(token, id),
    deleteJob: (token, id) => deleteJob(token, id),
    submitJob: (token, job) => submitJob(token, job),
    setDownloadedFile: (token, id) => setDownloadedFile(token, id),
    setNotDownloadedFile: (token, id) => setNotDownloadedFile(token, id),
    savePrices: (token, prices) => savePrices(token, prices),
    fetchPrices: (token) => fetchPrices(token),
    updateJobPrice: (token, id, price) => updateJobPrice(token, id, price),
    updateJobFile: (token, id, fileNames) => updateJobFile(token, id, fileNames),
    changeStatusPending: (token, id) => changeStatus(token, id, "pending"),
    changeStatusInProgress: (token, id) => changeStatus(token, id, "in_progress"),
    changeStatusCanceled: (token, id) => changeStatus(token, id, "canceled"),
    changeStatusFinished: (token, id) => changeStatus(token, id, "finished"),
    uploadToServer: (file, folder) => uploadToServer(file, folder),
    saveUser: (token, user) => saveUser(token, user),
    fetchProducts: (token, searchTerm = null) => fetchProducts(token, searchTerm),
    fetchAvailableProducts: (token) => fetchAvailableProducts(token),
    createProduct: (token, product) => createProduct(token, product),
    fetchProductData: (id) => fetchProductData(id),
    fetchTroquelados: (id) => fetchTroquelados(id),
    saveProducto: (token, producto) => saveProducto(token, producto),
    updateProductPrice: (token, price) => updateProductPrice(token, price),
    createProductPrice: (token, price) => createProductPrice(token, price),
    deleteProductPrice: (token, price) => deleteProductPrice(token, price),
  }
})();

export default DataService;
