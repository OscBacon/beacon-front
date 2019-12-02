const domain_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"

const global_options = {
  credentials: 'include',
  headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json"
  }
}

// GET all events
export const getEvents = () => {
  // the URL for the request
  const url = "/events"; // replace with heroku instance?

  const request = new Request(domain_url + url, global_options);

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get events");
      }
    })
    .then(json => {
      return json.events;
    })
    .catch(error => {
      console.log("failed to get the resources")
      console.log(error);
    });
};

// GET a specific event
export const getEvent = (event_id) => {
  // the URL for the request
  const url = `/events/${event_id}`; // replace with heroku instance?

  const request = new Request(domain_url + url, global_options);

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return Promise.reject("Couldn't find event");
      }
    })
    .catch(error => {
      alert(error.message)
    });
};

export const getUsersEvents = (user_id) =>  {
  const url = `/events/users/${user_id}`; 

  const request = new Request(domain_url + url, global_options);

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return Promise.reject("Couldn't find event");
      }
    })
    .catch(error => {
      alert(error.message)
    });
}

// POST request to add a new event
export const addEvent = (event) => {
  // the URL for the request
  const url = "/events";

  // Create our request constructor with all the parameters we need
  const request = new Request(domain_url + url, {
    method: "post",
    body: JSON.stringify(event),
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

// Patch the event
export const updateEvent = (event_id, event) => {
  // the URL for the request
  const url = `/events/${event_id}`;
  // Create our request constructor with all the parameters we need
  const request = new Request(domain_url + url, {
    method: 'PATCH',
    body: JSON.stringify(event),
    credentials: "include",
    headers: {
      Accept: "application/json, text/plain, */*",
      credentials: 'include',
      "Content-Type": "application/json",
      mode: 'cors'
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

