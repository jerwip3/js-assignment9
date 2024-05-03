// Establishes connection to the MongoDB

const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const dbName = 'foodtruck-api'
const client = new MongoClient(url)

const getCollection = async (collectionName) => {
    await client.connect()
    return client.db(dbName).collection(collectionName)
}

module.exports = { getCollection }