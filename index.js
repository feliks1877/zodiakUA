const express = require('express')
const helmet = require("helmet");
const path = require('path')
const mongoose = require('mongoose')
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
const addWorkRoutes = require('./routes/addWork')
const luxRoutes = require('./routes/lux')
const workRoutes = require('./routes/work')
const reviewRoutes = require('./routes/review')
const authRoutes = require('./routes/auth')
const lkRoutes = require('./routes/lk')
const sortRoutes = require('./routes/sort')
const cronRoutes = require('./routes/cron')
let favicon = require('serve-favicon')
const keys = require('./keys')
const bot = require('./bot/bot')
const fileMiddleware = require('./middleware/file')
const varMiddleware = require('./middleware/variables')


const app = express()


app.disable('x-powered-by')
app.use(helmet.dnsPrefetchControl())
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())


app.use(async (req, res, next) => {
    if (req.headers.host.match(/^www/) !== null) {
        await res.redirect(301,'https://zodiak.world/')
    }else{
        await next()
    }
})
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

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(compression())

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '3d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}

app.use(express.static('public', options))
app.use(express.static('data', options))
app.use(express.static('bot', options))
app.use('/images', express.static(path.join(__dirname, 'images'), options))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
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

app.use(homeRoutes)
app.use(escortRoutes)
app.use(addRoutes)
app.use(addWorkRoutes)
app.use(luxRoutes)
app.use(workRoutes)
app.use(reviewRoutes)
app.use(authRoutes)
app.use(lkRoutes)
app.use(sortRoutes)
app.use(cronRoutes)

const PORT = process.env.PORT || 2000

if(process.env.PORT){
    app.use (function (req, res, next) {
        console.log(req.headers.host, req.url)
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {

            // request was via http, so redirect to https
            res.redirect(301,'https://' + req.headers.host + req.url);
        }
    })
}

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start().catch(e => {
    console.log('ERR START',e)
})


