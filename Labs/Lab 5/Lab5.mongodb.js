// ? This lab uses the restaurants DB from Lab 4.
// ! I didn't attend class on this week, so hopefully he didn't discuss anything too useful.

use("sample_restaurants")

// Counts the number of restaurants for each borough.
db.restaurants.aggregate(
    {
        $group: {
            _id: "$borough",
            count: {$count: {}}
        }
    }
)

// Shows the name, zipcode and highest score attained by each restaurant.
// ? It specifies "maximum score", though it seems that lower is better for scores?
db.restaurants.aggregate(
    [
        {
            $project: {
                name: 1,
                zip: "$address.zipcode",
                maxScore: { $max: "$grades.score" }
            }
        }
    ]
)

// Finds the restaurants with cuisine “Hamburgers” or “Italian” within
// “Manhattan” borough and also showing number of branches of that restaurant in that borough.
// ! I also sorted it in descending order to show that the number of branches works.
db.restaurants.aggregate([
    {
      $match: {
        borough: "Manhattan",
        cuisine: { $in: ["Hamburgers", "Italian"] }
      }
    },
    {
      $group: {
        _id: {
          name: "$name",
          cuisine: "$cuisine",
          borough: "$borough"
        },
        branches: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        cuisine: "$_id.cuisine",
        borough: "$_id.borough",
        branches: 1
      }
    },
    {
        $sort: {branches: -1}
    }
])

// Finds the restaurants named “Bareburger” and their average score of each
// branch, along with its borough and the zip code of each restaurant.
// ? This query uses the "unwind" operator, which creates a new document for each grade.
// ? The query cannot calculate the average without this step.
// ! I also sorted them in descending order.
db.restaurants.aggregate([
    {
      $match: {
        name: "Bareburger"
      }
    },
    { 
        $unwind: "$grades"
    },
    {
      $group: {
        _id: {
          name: "$name",
          borough: "$borough",
          zipcode: "$address.zipcode"
        },
        avgScore: { $avg: "$grades.score" }
      }
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        borough: "$_id.borough",
        zipcode: "$_id.zipcode",
        avgScore: 1
      }
    },
    {
      $sort: { avgScore: -1 }
    }
  ])

// Aggregates all the cuisines and the numbers of restaurant for each cuisine in the 
// “Queens” borough and stores them in a new collection called "queens_cuisines"
// ? This query uses the "out" operator to store its results in a collection.
db.restaurants.aggregate([
    {
      $match: {
        borough: "Queens"
      }
    },
    {
      $group: {
        _id: "$cuisine",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        cuisine: "$_id",
        count: 1
      }
    },
    {
      $out: "queens_cuisines"
    }
])

// ? This new collection now exists and can be queried.
db.queens_cuisines.countDocuments()
// Compass or VSCode Mongo can see it much easier.


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