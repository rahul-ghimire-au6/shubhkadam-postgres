const app = require("./app")









let Port = process.env.port || 5555
app.listen(Port, () => {
    console.log(`Server listening at ${Port}`)
})