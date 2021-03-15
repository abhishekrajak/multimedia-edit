const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message)
    console.log('UNCAUGHT EXCEPTION shutting down server')
    process.exit(1)
})

const app = require('./app')

// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );
//
// mongoose
//     .connect(DB, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//     })
//     .then(() => console.log('database connection successful'));

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`port : ${port}`)
})

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION shutting down server')
    server.close(() => {
        process.exit(1)
    })
})
