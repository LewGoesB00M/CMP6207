// ! Compass is a very useful tool that you can use in future. These labs simply demonstrate command-line proficiency,
// ! though the functionality is even simpler in Compass.

// ? This lab won't give the expected final output unless you run the other JS file in this directory. 
// ? Normally, that could be done within the code, but the MongoDB VSCode extension doesn't support calling other files.
// * mongosh --file import-restaurants-sample-db.js     <- From outside the mongo shell and inside this directory.
use("sample_restaurants")

// Find all restaurants located in the Bronx that serve American cuisine or ice cream.
// Only returns the cuisine and restaurant name.
db.restaurants.find(
    {
        borough: "Bronx",
        cuisine: {$in: ["American", "Ice Cream, Gelato, Yogurt, Ices"]}
    },
    {_id: 0, cuisine: 1, name: 1}
)

// Finds the Restaurant ID, name, borough and cuisine for restaurants with scores LESS THAN 9.
// Score is part of grades, so it can be queried as "grades.score".
db.restaurants.find(
    {
        "grades.score": {$lte: 9}
    },
    {_id: 0, restaurant_id: 1, name: 1, borough: 1, cuisine: 1}
)
// A limitation here is that this is retrieving restaurants that have achieved a 9 at any time, even if they're better now.


// Finds the Restaurant ID, name, borough, cuisine, address and geographical location where
// the SECOND element of their coordinates array is more than 43 but less than 54.
    // Coord is part of address.
    // To access the second record, coord.1 works (arrays start at 0)
db.restaurants.find(
    {  
        "address.coord.1": {$gt: 43, $lt: 54},
    },

    {_id: 0, restaurant_id: 1, name: 1, borough: 1, cuisine: 1,
        "address.building": 1, "address.street": 1, "address.coord": 1}
)

// Finds the Restaurant ID, name and grades where 
// the SECOND element of the grades array has grade: A, score: 9
// and date: "2014-08-11T00:00:00Z"
// ! There aren't any restaurants that meet those conditions on 2014-08-11. (Or any scores on that date at all for that matter)
// ? Removing this from the query makes it retrieve actual results, with restaurants that have gotten grade A and score 9.
db.restaurants.find(
    {
        grades: {
            $elemMatch: {
                grade: "A",
                score: 9,
                //date: "2014-08-11T00:00:00Z"
            }
        }
    },
    {_id: 0, restaurant_id: 1, name: 1, grades: 1}
)

// Arranges the cuisine names in ascending order while also sorting boroughs in descending order.
// ! Also limiting to only cuisine and borough to verify it worked. This isn't part of the lab.
db.restaurants.find(
    {}, // No condition, find all.
    {_id: 0, name: 1, cuisine: 1, borough: 1}
).sort(
    {cuisine: 1, borough: -1}
); 


// Finds the amount of restaurants with the word "Street" in their address.
// ? This doesn't seem to work within $elemMatch.
db.restaurants.find(
    {
        // ! Uses regex that translates to "contains the phrase 'street' case insensitive."
        // ? Regex doesn't need quotation marks.
        "address.street": {$regex: /street/i}
    }
)

// Selects all documents where the coord field is a Double.
// ? This is all of them except for two.
// ? The two that this doesn't find simply have no coordinates at all.
db.restaurants.find(
    {
        "address.coord": {$type: "double"}
    }
).limit(3)
// ! Limited to 3 as each document is very long.


// Changes the restaurant called "Juni" to "American_New".
db.restaurants.updateOne(
    {name: "Juni"},
    {$set: {name: "American_New"}}
)

// Updates all restaurants with zipcode 10016 to be located in borough DC.
db.restaurants.updateMany(
    {"address.zipcode": "10016"},
    {$set: {borough: "DC"}}
)

// ! Not part of the lab, counting before deletion.
db.restaurants.countDocuments({borough: "Staten Island"}) // 969

// Deletes all restaurants located in borough Staten Island.
db.restaurants.deleteMany(
    {borough: "Staten Island"}
)

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