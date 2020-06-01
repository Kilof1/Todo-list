function Filter() {
    this.handle = (requestOptions, next) => {
      console.log(requestOptions);
      next(requestOptions, (returnObject, finalCallback, next) => {
        console.log(returnObject);
      })
    }
  }
  

const storage = require('azure-storage')
const retry = new storage.LinearRetryPolicyFilter();
const logging = new Filter();
const service = storage.createTableService().withFilter(logging).withFilter(retry);
const table = 'tasks'

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

module.exports = {
  init
}