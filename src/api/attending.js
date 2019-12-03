const domain_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"

const global_options = {
  credentials: 'include',
  headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json"
  }
}

// GET all attendings
export const getAttendings = () => {
  // the URL for the request
  const url = "/attendings"; // replace with heroku instance?
  const request = new Request(domain_url + url, global_options);
  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get attendings");
      }
    })
    .then(json => {
      return json.user;
    })
    .catch(error => {
      console.log("failed to get the resources")
      console.log(error);
    });
};

// GET a specific attending by user_id
export const getAttendingByUser = (user_id) => {
  // the URL for the request
  const url = `/attendings/users/${user_id}`;
  const request = new Request(domain_url + url, global_options);

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get the attendings");
      }
    })
    .catch(error => {
      console.log("failed to get the attendings")
      console.log(error);
    });
};

// GET a specific attending by event_id
export const getAttendingByEvent = (event_id) => {
    // the URL for the request
    const url = `/attendings/events/${event_id}`;
    const request = new Request(domain_url + url, global_options);
    return fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("Could not get the attendings");
        }
      })
      .catch(error => {
        console.log("failed to get the attendings")
        console.log(error);
      });
  };

// POST request to add a new attending
export const addAttending = (attending) => {
  // the URL for the request
  const url = "/attendings";
  
  // Create our request constructor with all the parameters we need
  const request = new Request(domain_url + url, {
    method: "post",
    body: JSON.stringify(attending),
    credentials: "include",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  return fetch(request)
    .then(function(res) {
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

// Delete request to add a new attending
export const deleteAttending = (user_id, event_id) => {
    // the URL for the request
    const url = `/attendings`;
    
    // Create our request constructor with all the parameters we need
    const request = new Request(domain_url + url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user_id,
        event: event_id
      })
    });
  
    // Send the request with fetch()
    return fetch(request)
      .then(function(res) {
        if (res.status === 200) {
          return res.json()
        } else {
            alert("Could not delete the attending");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };