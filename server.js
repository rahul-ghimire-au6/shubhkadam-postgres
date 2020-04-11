const app = require("./app")





app.get('/',(req,res)=>{
    res.json({"msg":"Welcome to shubhkadam"})
})




let Port = process.env.PORT || 5555
app.listen(Port, () => {
    console.log(`Server listening at ${Port}`)
})