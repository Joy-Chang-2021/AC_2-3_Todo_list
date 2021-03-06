const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const Todo = require('./models/todo') // 載入 todo model
const bodyParser = require('body-parser')
const mongoose = require('mongoose') // 載入 mongoose
const db = mongoose.connection // 儲存連線狀態、透過這個常數使用不同連線狀態的指令
const PORT = process.env.PORT || 3000 // heroku自動放入
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/2-3_todo_list'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定與資料庫連線


db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //建立樣板引擎、傳入參數
app.set('view engine', 'hbs') // 啟用樣板引擎

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理，協助解析 req.body
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Todo.find() // 取得todo model全部資料，()可傳入參數指定資料
    .lean() // 將 mongoose 的 model物件轉換成 JS 資料陣列
    .then(todos => res.render('index', { todos: todos })) // 資料傳入 index 樣板
    .catch(error => console.error(error)) // 發生錯誤時的處理
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  // 1.
  // const todo = new Todo({ name: name }) // 建立實體資料
  // todo.save() // 將實體資料寫入伺服器
  // 2.
  return Todo.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})