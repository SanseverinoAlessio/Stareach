let express = require('express');
let app = express();
let port = process.env.PORT || 3000;
let path = require('path');
let secure = require('express-force-https');

//app.use(secure);


app.use(express.static(path.join(__dirname, '/dist/To-do-list')));

app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'/dist/To-do-list/index.html'));
});
app.listen(port,()=>{
  console.log('avviato!');
});
