const domain_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"

const global_options = {
  credentials: 'include',
  headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json"
  }
}

// GET all stats
export const getStats = () => {
    // the URL for the request
    const url = "/admin/analytics"; 
  
    const request = new Request(domain_url + url, global_options);
  
    return fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return Promise.reject("Could not get analytics");
        }
      })
      .catch(error => {
        console.log("failed to get the resources")
        console.log(error);
      });
};

export const searchQuery = (type, query) => {
     // the URL for the request
    const url = `/admin/search/${type}/${query}`; 
  
    const request = new Request(domain_url + url, global_options);
  
    return fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return Promise.reject("Couldn't search");
        }
      })
      .catch(error => {
        console.log("failed to get the resources")
        console.log(error);
      });
}