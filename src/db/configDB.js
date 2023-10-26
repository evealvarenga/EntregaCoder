import mongoose from "mongoose";

const URI = "mongodb+srv://ealvarenga:HitomiEchizen100@cluster0.f2pvn62.mongodb.net/bdentrega15?retryWrites=true&w=majority"
mongoose
    .connect(URI)
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error))