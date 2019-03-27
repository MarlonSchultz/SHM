
// tslint:disable-next-line:no-any
export function postData(url: string = '', data: any = {}): Promise<any> {
    // Default options are marked with *
      return fetch(`http://localhost:8081${url}`, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
              'Content-Type': 'application/json',
              // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: 'follow', // manual, *follow, error
          referrer: 'no-referrer', // no-referrer, *client
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      // tslint:disable-next-line:no-any
      .then((response: any) =>
          response); // parses response to JSON
    }

    // tslint:disable-next-line:no-any
export function getData(url: string = ''): Promise<any> {
        // Default options are marked with *
          return fetch(`http://localhost:8081${url}`, {
              method: 'GET', // *GET, POST, PUT, DELETE, etc.
              mode: 'cors', // no-cors, cors, *same-origin
              cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
              credentials: 'same-origin', // include, *same-origin, omit
              headers: {
                  'Content-Type': 'application/json',
                  // "Content-Type": "application/x-www-form-urlencoded",
              },
              redirect: 'follow', // manual, *follow, error
              referrer: 'no-referrer', // no-referrer, *client
          })
          // tslint:disable-next-line:no-any
          .then((response: any) =>
              response); // parses response to JSON
        }
