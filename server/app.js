import path from 'path'
import express from 'express'
import hbs from 'hbs'
import './src/db/mongoose.js'
import userRouter from './src/routers/user.js'
import methodOverride from 'method-override'
import bodyParser from 'body-parser'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
let urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser)
app.use(methodOverride('_method'))
const port = process.env.PORT || 3000


//Define paths for express config
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

//Setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(userRouter)






app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

export default app;