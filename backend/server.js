import express from "express"
import cors from "cors"
import names from "./api/names.route.js"

const app = express()

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../frontend/build'))
}


app.use("/api/v1/names", names)
app.use("*", (req, res) => res.status(404).json({ error: "This isn't a valid page.}"}))

export default app