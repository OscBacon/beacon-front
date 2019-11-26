const domain_url = "http://localhost:3002"

// GET all users
export const getUsers = () => {
  // the URL for the request
  const url = "/users"; // replace with heroku instance?

  return fetch(domain_url + url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get events");
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

// GET a specific user
export const getUser = (user_id) => {
  // the URL for the request
  const url = `/events/${user_id}`; // replace with heroku instance?

  return fetch(domain_url + url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get the event");
      }
    })
    .catch(error => {
      console.log("failed to get the event")
      console.log(error);
    });
};

// POST request to add a new user
export const addUser = (user) => {
  // the URL for the request
  const url = "/users";
  
  // Create our request constructor with all the parameters we need
  const request = new Request(domain_url + url, {
    method: "post",
    body: JSON.stringify(user),
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