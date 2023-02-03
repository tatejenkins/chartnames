import express from "express"
import cors from "cors"
import names from "./api/names.route.js"

const app = express()
const path = require('path')

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname,'frontend','build','index.html')))



app.use("/api/v1/names", names)
app.use("*", (req, res) => res.status(404).json({ error: "This isn't a valid page.}"}))

export default app