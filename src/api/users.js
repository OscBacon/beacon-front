const domain_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"

const global_options = {
  credentials: 'include',
  headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json"
  }
}


// GET all users
export const getUsers = () => {
  // the URL for the request
  const url = "/users";
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
  const url = `/users/${user_id}`; // replace with heroku instance?
  const request = new Request(domain_url + url, global_options);

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return Promise.reject(res.error);
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
  const url = "/auth/signup";
  
  // Create our request constructor with all the parameters we need
  const request = new Request(domain_url + url, {
    method: "post",
    body: JSON.stringify(user),
    credentials: 'include',
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  return fetch(request)
    .then(function(res) {
        return res.json()
    }).then((json) => {
        return json;
    })
    .catch(error => {
      console.log(error);
    });
};

export const getCurrentUser = () => {
    // the URL for the request
    const url = "/auth/current";

    // Create our request constructor with all the parameters we need
    const request = new Request(domain_url + url, {
        method: "get",
        credentials: 'include',
        headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    return fetch(request)
        .then(function(res) {
            if(res.status !== 200){
                return Promise.reject(res.error);
            }
            return res.json()
        })
        .catch(error => {
          return Promise.reject(error ? error.message : "No current user");
        });
};

export const login = (username, password) => {
    const url = "/auth/login";

    // Create our request constructor with all the parameters we need
    const request = new Request(domain_url + url, {
        method: "post",
        body: JSON.stringify({
            username,
            password
        }),
        credentials: 'include',
        headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    return fetch(request)
        .then(function(res) {
            return res.json()
        }).then((json) => {
            return json;
        }).catch(error => {
            console.log(error);
        });
};

export const logout = () => {
    const url = "/auth/logout";

    // Create our request constructor with all the parameters we need
    const request = new Request(domain_url + url, {
        method: "post",
        credentials: 'include',
        headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    return fetch(request)
        .then(function(res) {
            return res.json()
        }).then((json) => {
            return json;
        }).catch(error => {
            console.log(error);
        });
};

// Patch the user
export const updateUser = (user_id, user_info) => {
  // the URL for the request
  const url = `/users/${user_id}`;
  // Create our request constructor with all the parameters we need
  const request = new Request(domain_url + url, {
    method: 'PATCH',
    body: JSON.stringify(user_info),
    credentials: 'include',
    headers: {
      Accept: "application/json, text/plain, */*",
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