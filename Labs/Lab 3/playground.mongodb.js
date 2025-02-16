// THIS FILE DOCUMENTS ALL THE COMMANDS USED, 
// THOUGH RUNNING THIS FILE WILL ONLY YIELD THE OUTPUT
// OF THE FINAL COMMAND. Nevertheless, all commands 
// are run, which can be clearly seen by querying the DB 
// in another terminal.

use("faculty");

// Create 100 students with randomised scores.
for (let i = 1; i <= 100; i++) {
    db.scores.insertOne(
        {
            "student_id": i,
            "type": "homework",
            "score": Math.random() * 100
        }
    );
    db.scores.insertOne(
        {
            "student_id": i,
            "type": "quiz",
            "score": Math.random() * 100
        }
    );
    db.scores.insertOne(
        {
            "student_id": i,
            "type": "exam",
            "score": Math.random() * 100
        }
    );
};

// Finds all exam and quiz scores, NOT homework scores.
db.scores.find(
    {type: {$in: ["exam", "quiz"]}}
);

// Set everyone's quiz scores to 0.
db.scores.updateMany(
    {type: "quiz"},
    {$set: {score: 0}}
);

// Counts everyone with homework scores over 50.
db.scores.countDocuments(
    {$and: 
        [
            {score: {$gte: 50}},
            {type: "homework"}
        ]
    }
);

// Creates the staff collection with some sample data.
db.staff.insertMany([
    { "name":"Ana", "age":35,"gender":"F","exp":10,subjects:["DS","C","OS"],"type":"Full Time","qualification":"M.Tech" },
    { "name":"Ina", "age":38,"gender":"F","exp":12,subjects:["JAVA","DBMS"],"type":"Full Time", "qualification":"Ph.D"},
    { "name":"Tom", "age":32,"gender":"M","exp":8,subjects:["C","CPP"],"type":"Part Time","qualification":"M.Tech" },
    { "name":"Kim", "age":40,"gender":"M","exp":9,subjects:["JAVA","DBMS","NETWORKING"],"type":"Full Time", "qualification":"Ph.D"},
    { "name":"Rajan", "age":35,"gender":"M","exp":7,subjects:["DS","C","OS"],"type":"Full Time","qualification":"M.Tech" },
    { "name":"Antonio", "age":38,"gender":"M","exp":10,subjects:["JAVA","DBMS","OS"],"type":"Part Time", "qualification":"Ph.D"},
    { "name":"Stiv", "age":32,"gender":"F","exp":8,subjects:["C","CPP","MATHS"],"type":"Part Time","qualification":"M.Tech" },
    { "name":"Nandi", "age":39,"gender":"M","exp":11,subjects:["JAVA","DBMS","NETWORKING"],"type":"Full Time", "qualification":"Ph.D"},
    { "name":"Natan", "age":35,"gender":"M","exp":9,subjects:["JAVA",".Net","NETWORKING"],"type":"Full Time", "qualification":"Ph.D"},
    { "name":"Liora", "age":40,"gender":"F","exp":13,subjects:["MATHS"],"type":"Full Time", "qualification":"Ph.D"}
]);


db.staff.find(); // Finds all.

db.staff.countDocuments(); // Counts all.

// db.staff.find({qualification: "M.Tech"}); // Finds all with M.Tech qualification.
db.staff.countDocuments({qualification: "M.Tech"}); // Counts all with M.Tech qualification.

// Finds all whose experience is between 8 and 12 years.
db.staff.find({
    exp: {$gte: 8, $lte: 12}
});

// Finds all who teach MATHS or JAVA.
db.staff.find({
    subjects: {$in: ["MATHS", "JAVA"]}
});

// Finds all who teach JAVA, who are over 20, and have a PHD.
db.staff.find({
    subjects: {$in: ["JAVA"]},
    age: {$gt: 20},
    qualification: "Ph.D"
});

// Finds all who are part-time employees OR teach Java.
db.staff.find({
    $or: [
        {subjects: {$in: ["JAVA"]}},
        {"type": "Part Time"}
    ]
});

// Adds a new staff member called Susan.
db.staff.insertOne(
    { "name":"Susan", "age":36,"gender":"F","exp":15,subjects:["BIG DATA"," DATA MINING"],
      "type":"Full Time", "qualification":"Ph.D"}
);

// Adds 2 to all ages and experiences.
db.staff.updateMany(
    {}, // No filter (select all)
    {$inc: {age: 2, exp: 2}}
);

// Updates Stiv with a PHD and full-time.
db.staff.updateOne(
    {name: "Stiv"},
    {$set: {qualification: "Ph.D", type: "Full Time"}}
);

// Updates all maths teachers to also teach PSK.
db.staff.updateMany(
    {subjects: {$in: ["MATHS"]}},
    {$push: {subjects: "PSK"}}
);

// Removes all staff over 55.
// There actually aren't any.
db.staff.deleteMany(
    {age: {$gt: 55}}
);

// Outputs all staff names and qualifications.
db.staff.find(
    {}, // No condition, find all.
    // Don't return any columns other than name and qualification.
    {_id: 0, name: 1, qualification: 1} 
);

// Seems you can use "true" boolean or 0/1.

// Returns an ascending-sorted list in order of experience
// of all staff names, qualifications and experience.
db.staff.find(
    {},
    {_id: 0, name: 1, qualification: 1, exp: 1} 
).sort(
    {exp: 1}
);

// Finds the top 5 staff ages by sorting in descending order.
db.staff.find().sort({age: -1}).limit(5);
// 1 ascending, -1 descending.