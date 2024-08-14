import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'product': new ObjectId('66bb732203d9bfc23d8458ed'),
    },
  },
  {
    '$group': {
      '_id': null,
      'averageRating': {
        '$avg': '$rating',
      },
      'numOfReviews': {
        '$sum': 1,
      },
    },
  },
]

const client = await MongoClient.connect('')
const coll = client.db('Ecomm').collection('reviews')
const cursor = coll.aggregate(agg)
const result = await cursor.toArray()
await client.close()
