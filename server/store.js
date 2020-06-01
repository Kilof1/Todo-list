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
const uuid = require('uuid')

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const addTask = async ({ title, description }) => (
    new Promise((resolve, reject) => {
      const gen = storage.TableUtilities.entityGenerator
      console.log('addtask - gen')
      const task = {
        PartitionKey: gen.String('task'),
        RowKey: gen.String(uuid.v4()),
        title,
        description,
      }
      console.log('addtask - task')
      service.insertEntity(table, task, (error) => {
        !error ? resolve() : reject()
        if(error) {
          console.log(error);
        }
      })
      console.log('addtask - insertEntity')
    })
    ,console.log('addtask - Promise')
  )

module.exports = {
  init,
  addTask
}