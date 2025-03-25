use("sample_restaurants")

// The original search for restaurants by borough, accompanied with explain() to show time taken and steps.
db.restaurants.find({"borough" : "Brooklyn"}).explain("executionStats")
// * This query takes 114 milliseconds (on the laptop)

// ? executionStats shows the time taken as well as other useful stats.
// ? Other options are "queryPlanner" (minimal detail) and "allPlansExecution" (extreme detail)

// Creating an index that will speed up querying restaurants by borough.
db.restaurants.createIndex({borough: 1})
db.restaurants.find({"borough" : "Brooklyn"}).explain("executionStats")
// * This query takes 98 milliseconds.
// * It makes the time complexity o(log₂ n) instead of o(n). An ENORMOUS improvement best seen in larger DBs.
// *    log₂ 10,000 = 13
// *    log₂ 100,000 = 16
// *    log₂ 1,000,000 = 19
//      It's log with a subscript 2. VSCode makes it hard to see.

// ? Queries now automatically use the index, because MongoDB uses its "query planner".
// ? The planner searches for the best way to execute a given query. 
// ? You'll know if it used an index or not based on the query plan.
// ?    If it uses COLLSCAN, it did not use any index and will likely be slower as a result.
// ?    If it uses IXSCAN, an index was used and will likely be faster as a result.

// ! To test the initial query, this index must be dropped through 
// ! "db.restaurants.dropIndex(borough_1)" or in the Compass GUI.

/*

? Question 2:
?   "We have an index on the 'address' field. Will a query on 'address.zipcode' use this index?"

!   Query "address.zipcode": "11224" is 11ms with an address index only. It does not use this index.
!   With an address.zipcode index, it's 0ms (so fast it couldn't even measure).

*   No, it will not, as indexes do not include nested fields. 
*   Instead, an index would also be needed on address.zipcode.

*   Indexes add a small write performance penalty, as they need to be updated as CRUD operations are performed.
*   They're not unique to MongoDB or NoSQL. Indexes are a general database function used universally.

*/

// Creates an index in ascending order for address.zipcode.
// ? A sorting order is applied because sorting in RAM is an expensive operation.
// ? Apparently, descending order single-field indexes are actually bad practice and perform slower.
db.restaurants.createIndex({"address.zipcode": 1})


/*

? Question 4:
?   "We have a compound index of 'borough: 1, cuisine: -1'. Which of the following queries use it?"

db.restaurants.find({"borough" : "Brooklyn") 
* TRUE, as borough is the prefix.

db.restaurants.find({"cuisine" : "Hamburgers") 
! FALSE, as cuisine is not the prefix. Non-prefixes aren't used in independent searches.

db.restaurants.find({"borough" : "Brooklyn", "cuisine" : "Hamburgers" })
* TRUE, as the search matches both indexed fields.

db.restaurants.find().sort( {borough: -1} )
* TRUE, as the index can simply be traversed backwards for the one field. 

db.restaurants.find().sort( {borough: 1, cuisine: 1 } )
! FALSE, as cuisine was sorted in the opposite order when the index was made.

db.restaurants.find().sort( {borough: -1, cuisine: 1 } )
* TRUE, as this is the exact opposite of the compound index, and can therefore be read backwards.

db.restaurants.find().sort( {cuisine: 1, borough: -1 } )
! FALSE, as the index uses borough as the prefix, not cuisine.


? Question 5:
?   "Repeat Q4 but with the index "borough: 1, cuisine: -1, name: -1".
!   Removed queries 1, 2, 4, 5, and 7, as the explanations were the same.

db.restaurants.find({"borough" : "Brooklyn", "cuisine" : "Hamburgers" })
* TRUE, as the search matches SEQUENTIAL indexed fields.
? If it were borough, name, cuisine, it'd be false as it wouldn't be sequential to the index.

db.restaurants.find().sort( {borough: -1, cuisine: 1 } )
! FALSE (was TRUE), as this is not the exact opposite of the index.


? Question 6:
?   Is it possible to create the index "address.coord: 1, grades: -1"?

*   No, it isn't. This is because they are considered parallel arrays, which cannot be indexed 
*   together. Grades is an array of [date, score, grade], and address.coord is an array of [coordX, coordY].
*   MongoDB doesn't allow for the creation of indexes on parallel arrays due to the potential for exponential 
*   growth as either array grows, as an index would be needed for all combinations. This would collosally increase
*   storage requirements and processing overhead to an unmanageable level.

*/

// Queries restaurants that aren't grade A, also including their name and street.
db.restaurants.find({"grades.grade" : { $ne : "A"} } , {"name" : 1 , "address.street": 1}).explain("executionStats")
// ? 97ms in Compass, 25359 (all) docs examined.

// Creates an index, which will instead be used for that query.
// * Name and street are projections. We're only actually searching by grade. 
db.restaurants.createIndex({ "grades.grade": 1 })
db.restaurants.find({"grades.grade" : { $ne : "A"} } , {"name" : 1 , "address.street": 1}).explain("executionStats")
// ? 24ms in Compass, 11616 docs examined.


// Queries scores to find those of a grade C with scores over 50.
db.restaurants.find({"grades.score" : {$gt : 50} , "grades.grade" : "C"})
// ? 112 ms in Compass, 25359 (all) docs examined.

db.restaurants.createIndex({"grades.score": 1, "grades.grade": 1})
db.restaurants.find({"grades.score" : {$gt : 50} , "grades.grade" : "C"})
// ? 2 ms in Compasss, 349 docs examined. An enormous increase in speed (5600%)!

/*

? Question 8:
?   What are the differences between the two index strategies below?
?       createIndex({ borough: 1, cuisine: 1 })   
?   
?       createIndex({ borough: 1 })
?       createIndex({ cuisine: 1 })

* Strategy A involves creating a compound index. This works very well if there are frequently queries 
* on both borough and cuisine, and will maximise storage and write operation efficiency. Additionally,
* this strategy is beneficial if sorting by cuisine after searching by borough frequently occurs, 
* provided this sorting is in ascending order. If it's in descending order, the index can't be used. 

* Strategy B instead creates two singlular indexes, and is better when querying only cuisine.
* Querying only borough would be the same with either strategy as borough is the prefix in Strategy A.
* It's also helpful if queries aren't necessarily predictable and involve many combinations of fields.

* In summary, most real-world applications where queries are mostly predefined and expected will see 
* larger benefits from compound indexes as per Strategy A. However, if there are lots of queries using 
* lots of different fields in various combinations, Strategy B could theoretically work better.

*/