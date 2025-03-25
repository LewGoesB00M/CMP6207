// ! In the final version of this script, you may need to change the file extension.
// ! It's currently ".mongodb.js" for use in VSCode.

// Generate DB like the OG students one with random nums. Week 6 also has a similar generated DB.
// Difficulty is in associations. 
// Users have houses (?) (one to one?), Houses have rooms, rooms have sensors.

// The theoretical 'source' of your data is mostly unimportant. It's about how you structure it, 
// as well as your indexes and queries. 


// The brief directly specifies the following sensors:
// Smart door locks, automated blind shutters, lights & light switches, temeprature, smoke alarms.
// What would their readings be? (Door locked/open [1,0], blinds open/closed [1,0], light on off [1,0], temp [int], smoke alarm [1,0?])

// Consider some extras. Power consumption?
// Think about what sensors people would even really have.