// Stores 100 students with randomised exam, homework and quiz scores to the Faculty DB in collection scores.
// ? Code is from Lab 3.
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
    {type: {$in: ["exam", "quiz"]}},
);

// Set everyone's quiz scores to 0.
db.scores.updateMany(
    {type: "quiz"},
    {$set: {score: 0}}
);

// Finds the total scores across all 3 types for each student.
db.scores.aggregate([
    {$group:
        {
            _id: "$student_id",
            sumScores: {$sum: "$score"}
        }
    }
])

// Calculates the average score for each assessment type.
// ? It puts it in a new collection called 'means'.
db.students.runCommand( {
    mapReduce: "scores",
    map: function() {
        emit( this.type, this.score);
    },
    reduce: function(type, values) {
        var value = 0;
        for (var index = 0; index < values.length; ++index) {
            value += values[index];
        }
        return value/index;
    },
    out: {
        replace: "means"
    }
} )

// Show the output means.
db.means.find()

// ! He also asks you to do this using aggregation, as MapReduce is now deprecated.