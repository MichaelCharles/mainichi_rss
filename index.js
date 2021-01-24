import dotenv from "dotenv";
import express from 'express'
import readMainichi from './read-mainichi.js'
dotenv.config()

const app = express()
const port = 3000

app.get('mainichi/rss.xml', async (req, res) => {
    const feed = await readMainichi();
  res.send(feed)
})

app.listen(port, () => {
  console.log(`Ready to feed...`)
})