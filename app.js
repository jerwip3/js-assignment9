const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const apiRoutes = require('./api-routes')

app.use(express.json())
app.use(express.static('public'))
app.use(apiRoutes)

// Routes to redirect to the frontend pages from the root URL
app.get('/', (_, response) => {
    response.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.get('/menu', (_, response) => {
    response.sendFile('menu.html', { root: path.join(__dirname, 'public') })
})

app.get('/contact', (_, response) => {
    response.sendFile('contact.html', { root: path.join(__dirname, 'public') })
})

app.get('/admin', (_, response) => {
    response.sendFile('admin.html', { root: path.join(__dirname, 'public') })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
})