use("sample_restaurants")

/*

? Capped collections:
    Of fixed size declared at creation. Much faster than standard (dynamic) collections.
    First In, First Out (FIFO). At size cap, oldest is removed. 

    Can be capped by size in bytes ("size": 1000000), amount of documents ("max": 1000), 
    or both.

    Writing to capped collections can be slow, and updating documents in them is outright
    not recommended. (Updating single values is likely fine, but adding a new column is ill-advised)
*/

/*

? Time-to-live (TTL) indexes:
    Documents are stored for a set time and are then deleted.
    Specified using the 'expireAfterSeconds' argument in createIndex.

    Use-cases include shopping carts and login sessions.

    Monitored by MongoDB TTLMonitor. By default, TTLMonitor runs every minute.
    In huge databases, this is actually a performance inhibitor.
    ? Does he want me to actually account for that? It is possible, see Lecture 9.

*/

/*

! Time-series collections:
    Efficiently store time-series data.
    Typically 'three dimensions':
        time (datetime) field, 
        measurement (readings/metrics).
        metadata (source, sensor id, location, etc) 

    Uses an underlying columnar storage format.
    "Similar to bucket pattern" (I don't know what that is.)

    ! Refer to Lecture 9 PPTX for info on their creation. This is important.

    Reduced complexity in comparison to some other services, because they're queried as normal. 
    MongoDB translates your regular queries to the more efficient underlying column storage query for you.

    Faster reading and more efficient querying.
    Uses less storage space.
    Can be used alongside TTL indexes.

    ? Limitations apply. (https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/):

*/

/*

? Full-text indexes:
    Help to search for text quickly, with support for multiple languages and stop words.
    Seems to be some very complex logic behind these. They're not just storing strings.

    Stemming:
        Reduces words to the stem - "standing, stands, stood" - "stand"
    
    Stop words:
        Filler words. 'the', 'my', and more. Google this.

    Scoring:
        Semantic score of most relevant to query.

    All indexes take time to create initially, but full-text indexes in particular take a very long time.
    It's best to set up full-text indexes when the system is offline or if performance isn't relevant,
    as MongoDB can be overloaded if a full-text index is created on a busy collection.

    It's possible that a full-text index won't fit in RAM due to their larger size.

    * See Lecture 9 slides for further notes. They go into great depth on the usage of these indexes.

*/


/*

? Geospatial indexes:
    Two options:
        Planar (2d)
        Sphere (2dsphere)

    * Apparently 2dsphere is just better. Planar acts as though the Earth is flat.
    * That's fine for very short distances, but if we query a larger area, there would be discrepancies.
    ! When an index is created in planar or sphere, it cannot be queried in the other format.
    
    Coordinates specified as points or a polygon.
    Point is for one location, polygon defines an area.
    Polygons defined as an array. Last row must be equal to the first row to close the shape.

    When querying these, max and min distance can be specified. This is good for examples like 
    "where are fast food restaurants near me". Min distance can be good to set to not show results
    directly on top of, or in extreme proximity to, the original point.

*/

// ! I think the restaurants index is incorrect, and might need to be "address.coord" instead.
db.restaurants.createIndex({ coord: "2dsphere" })
db.neighborhoods.createIndex({ geometry: "2dsphere" })

// Finds the neighbourhood of a given point.
db.neighborhoods.findOne({
    geometry: {
        $geoIntersects: {
            $geometry: { type: "Point", coordinates: [-73.93414657, 40.82302903]} 
        }
     }
})

// Storing the result of this query as a variable which can then be accessed in another query.
var neighborhood = db.neighborhoods.findOne({ 
    geometry: {
        $geoIntersects: { 
            $geometry: { 
                type: "Point", 
                coordinates: [-73.93414657, 40.82302903] 
            } 
        } 
    }
})
    
// Using the neighborhood variable, all restaurants in that neighborhood can be identified.
// ? Rather than outputting them all, we can just do a count instead.
db.restaurants.find({ 
    "address.coord" : {$geoWithin: {$geometry:neighborhood.geometry}}
}).count()

// Finds all restaurants within 400 [metres?] of the given point.
// ! This required the creation of an address.coord 2dsphere index not shown in this JS file. 
db.restaurants.find({
    "address.coord": {
        $nearSphere: {
            $geometry: {
                type: "Point",
                coordinates: [ -73.93414657, 40.82302903 ]
            },
            
            $maxDistance: 400
        }
    }    
}).count()



