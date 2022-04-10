// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// font-awesome
// app.use(express.static('./node_modules/font-awesome/fonts'))

// routes setting
app.get('/', (req, res) => {
  // console.log('request', req)
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {

  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)

  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  // console.log('req.query', req.query)
  const keyword = req.query.keyword

  function searchWord(event) {
    return event.toLowerCase().includes(keyword.toLowerCase())
  }

  const name = restaurantList.results.filter(restaurant => {
    return searchWord(restaurant.name)
  })

  const categories = restaurantList.results.filter(restaurant => {
    return searchWord(restaurant.category)
  }) 

  // 使用 concat 組合兩個 filter 過的 array, 可能會有重複的狀況
  // 使用 filter 過濾 categories array, name.indexOf(條件) === -1 代表不存在於 name array, 這種情況下，再把選項拿進 name array 裡面組合
  const restaurants = name.concat(categories.filter(category => name.indexOf(category) === -1))
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})