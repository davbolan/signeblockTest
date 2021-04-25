'use strict';

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({version:'2012-08-10'});
const uuid = require('uuid');

const signeblockTable = process.env.tableName;

// Almacena el body de la petición en DynamoDB.
module.exports.postSigneblock = (event, context, callback) => {

  const requestBody = JSON.parse(event.body);

  const data = {
    id : uuid.v4(),
    body : requestBody
  };

  return db.put({
    TableName : signeblockTable,
    Item : data
  })
  .promise()
  .then(() => {
    callback(null, response(201, data));
  })
  .catch((err) => response(null, response(err.statusCode, err)));
};

// Recupera todo lo que está almacenado en DynamoDB.
module.exports.getSigneblock = async (event, context, callback) => {
  return db
    .scan({
      TableName: signeblockTable
    })
    .promise()
    .then((items) => {
      callback(null, response(200, items.Items));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

//Genera una respuesta
function response(statusCode, data){
  return {
    statusCode: statusCode,
    body: JSON.stringify(data)
  };
}