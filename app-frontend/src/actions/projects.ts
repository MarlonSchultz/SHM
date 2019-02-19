
function postData(url = ``, data = {}) {
// Default options are marked with *
  return fetch('http://localhost:8081' + url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then((response) => {
      return response;
  }); // parses response to JSON
}

function getData(url = ``) {
    // Default options are marked with *
      return fetch('http://localhost:8081' + url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
              "Content-Type": "application/json",
              // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
      })
      .then((response) => {
          return response;
      }); // parses response to JSON
    }

export function addProject(name: string, description?: string) {
    return postData('/projects', {
        name: name,
        description: description
    })
    .then(function(response) {
        return response.status == 201;
    });
}

export function getProjects() {
    return getData('/projects')
    .then(function(response) {
        return response.json();
    });
}

export interface Project {
    id? : number,
    name: string,
    description?: string,
}