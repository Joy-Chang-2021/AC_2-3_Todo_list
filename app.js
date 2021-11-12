const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect('mongodb://localhost/2-3_todo_list') // 設定與資料庫連線
const db = mongoose.connection // 儲存連線狀態、透過這個常數使用不同連線狀態的指令
const Todo = require('./models/todo') // 載入 todo model

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'})) //建立樣板引擎、傳入參數
app.set('view engine', 'hbs') // 啟用樣板引擎

app.get('/', (req, res) => {
  Todo.find() // 取得todo model全部資料，()可傳入參數指定資料
    .lean() // 將 mongoose 的 model物件轉換成 JS 資料陣列
    .then(todos => res.render('index', { todos: todos })) // 資料傳入 index 樣板
    .catch(error => console.error(error)) // 發生錯誤時的處理
})

app.listen(3000, () => {
  console.log('App is running on port 3000.')
})