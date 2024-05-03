const express = require('express')
const connectToMongo=require('./db');
var cors = require('cors')
const app = express()
 
app.use(cors())
app.use(express.json())
const port = 3000



connectToMongo();

//All Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/analgesics',require('./routes/medicines/analgesics'));
app.use('/api/user',require('./routes/user/operations'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})