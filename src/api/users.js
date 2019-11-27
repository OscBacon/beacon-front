const domain_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"

// GET all users
export const getUsers = () => {
  // the URL for the request
  const url = "/users";

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
  const url = `/users/${user_id}`; // replace with heroku instance?

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
                return null;
            }
            return res.json()
        })
        .catch(error => {
            console.log(error);
        });
};

export const login = (email, password) => {
    const url = "/auth/login";

    // Create our request constructor with all the parameters we need
    const request = new Request(domain_url + url, {
        method: "post",
        body: JSON.stringify({
            email,
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
