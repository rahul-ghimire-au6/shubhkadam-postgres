const app = require("./app")









let Port = process.env.PORT || 5555
app.listen(Port, () => {
    console.log(`Server listening at ${Port}`)
})