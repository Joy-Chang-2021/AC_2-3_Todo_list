const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/2-3_todo_list')
const Todo = require('../todo') // 載入 todo model
const db = mongoose.connection


db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({name: `name-${i}`})
  }
  console.log('done.')
})