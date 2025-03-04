use(sample_restaurants)

// Counts all restaurants in the "Queens" borough, grouping them by restaurant name.
// Then returns a document for each restaurant name with the count and an array of the addresses
// in the format "[Building], [Street]"
db.restaurants.aggregate([
    {
      $match: {
        borough: "Queens"
      }
    },

    {
      $group: {
        _id: "$name",
        count: {$sum: 1},

        fullAddress: {
            $push: {
                    $concat: ["$address.building", ", ", "$address.street"]
                }
            }
        }
    }
])

// Counts restaurants per borough per name of restaurant, returning only the ones
// that have a count greater than 50, sorted in descending order. Output should
// include borough and restaurant (chain) name
// ! I think this is incorrect.
db.restaurants.aggregate([
    {
      $group: {
        _id: "$name",

        count: {$sum: 1},

        nameAndBorough: {
            $push: {
                    $concat: ["$count", "$name", " located in ", "$borough"]
                }
            }
        },
    },
    {
        $match: {
            count: {$gt: 50}
        }
    },
    {
        $sort: {
            count: -1
        }
    }
])




/*
    Example document:
[
  {
    _id: '5eb3d668b31de5d588f4292a',
    address: {
      building: '2780',
      coord: [ -73.98241999999999, 40.579505 ],
      street: 'Stillwell Avenue',
      zipcode: '11224'
    },
    borough: 'Brooklyn',
    cuisine: 'American',
    grades: [
      { date: '2014-06-10T00:00:00.000Z', grade: 'A', score: 5 },
      { date: '2013-06-05T00:00:00.000Z', grade: 'A', score: 7 },
      { date: '2012-04-13T00:00:00.000Z', grade: 'A', score: 12 },
      { date: '2011-10-12T00:00:00.000Z', grade: 'A', score: 12 }
    ],
    name: 'Riviera Caterer',
    restaurant_id: '40356018'
  }
]
*/