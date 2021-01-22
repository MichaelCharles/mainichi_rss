import express from 'express'
import readMainichi from './read-mainichi.js'

const app = express()
const port = 3000

app.get('/rss.xml', async (req, res) => {
    const feed = await readMainichi();
  res.send(feed)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})