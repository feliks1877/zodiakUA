const express = require ('express')
const path = require('path')
const mongoose = require('mongoose')
// const helmet = require('helmet')
const compression = require('compression')
const Handlebars = require('handlebars')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const escortRoutes = require('./routes/escorts')
const addRoutes = require('./routes/add')
const luxRoutes = require('./routes/lux')
const workRoutes = require('./routes/work')
const reviewRoutes = require('./routes/review')
const authRoutes = require('./routes/auth')
const lkRoutes = require('./routes/lk')
const sortRoutes = require('./routes/sort')
const cronRoutes = require('./routes/cron')
const keys = require('./keys')
const fileMiddleware = require('./middleware/file')
const varMiddleware = require('./middleware/variables')


const app = express()

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
})

mongoose.set('useFindAndModify', false)

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs',hbs.engine)
app.set('view engine', 'hbs')
app.set('views','views')
app.use(express.static('public'))
app.use(express.static('data'));
app.use(express.static(path.join(__dirname,'jquery')))
app.use(express.static(path.join(__dirname,'images')))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(fileMiddleware.array('photo[]'))
app.use(varMiddleware)
app.use(flash())
app.use(compression())
app.use(homeRoutes)
app.use(escortRoutes)
app.use(addRoutes)
app.use(luxRoutes)
app.use(workRoutes)
app.use(reviewRoutes)
app.use(authRoutes)
app.use(lkRoutes)
app.use(sortRoutes)
app.use(cronRoutes)

const PORT = process.env.PORT || 2000

async function start(){
    try{
        await mongoose.connect(keys.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }catch (e){
        console.log(e)
    }
}
start()


