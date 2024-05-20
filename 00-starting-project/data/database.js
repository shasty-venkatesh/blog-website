const mysql=require('mysql2/promise');

const data=mysql.createPool({
  host:'localhost',
  user:'root',
  database:'blog',
  password:'sandel25477'
})

module.exports=data;

