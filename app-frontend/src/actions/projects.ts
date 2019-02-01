
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
  .then(response => response.json()); // parses response to JSON
}


export function addProject(name: string, description?: string) {
    postData('/projects', {
        name: name,
        description: description
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        console.log(JSON.stringify(myJson));
    });
}
