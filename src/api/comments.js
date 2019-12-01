const domain_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"

const global_options = {
  credentials: 'include',
  headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json"
  }
}

// GET all events
export const getComments = (event) => {
    // the URL for the request
    const url = `/comments/${event}`; 
  
    const request = new Request(domain_url + url, global_options);
  
    return fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("Could not get comments");
        }
      })
      .catch(error => {
        console.log("failed to get the resources")
        console.log(error);
      });
  };


// POST request to add a new event
export const addComment = (event, comment) => {
    // the URL for the request
    const url = `/comments/${event}`;
  
    // Create our request constructor with all the parameters we need
    const request = new Request(domain_url + url, {
      method: "post",
      body: JSON.stringify(comment),
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    });
  
    // Send the request with fetch()
    return fetch(request)
      .then(function (res) {
        if (res.status === 200) {
          return true
        } else {
          return false
        }
      })
      .catch(error => {
        console.log(error);
      });
  };