import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import NamesDAO from "./dao/namesDAO.js"
dotenv.config()

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 5000

MongoClient.connect(
    process.env.NAMES_DB_URI,
    {
        maxPoolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {

    await NamesDAO.injectDB(client)

    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
})

process.on('SIGINT', () => { console.log("Killing process"); process.exit(); });