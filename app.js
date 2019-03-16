const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient; //allow us to establish a connection
const ObjectId = require("mongodb").ObjectID; //allow us to work with document ids
const imdb = require("./src/imdb");
const DENZEL_IMDB_ID = "nm0000243";

const CONNECTION_URL = "mongodb+srv://nanoui:D3nZel@denzel-t5s7b.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "movies"; //to create and use

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

// the API should listen locally the port 9292
app.listen(9292, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("movies");
        console.log(`Connected to ${DATABASE_NAME} !`);
    });
});

//create / add a movie in the database
app.post("/movies", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

//to populate the database with the scrapped movies
app.get("/movies/populate", async (request, response) => {
  const movies = await imdb(DENZEL_IMDB_ID);
  collection.insertMany(movies, (err, result) => {
    if (err) {
      return response.status(500).send(err);
    }
    response.send(`Total movies added : ${movies.length}`);
  });
});

//to return all data in our collection representing movies that are the must-watch

//Fetch a random must-watch movie
app.get("/movies", (request, response) => {
  collection
    .aggregate([
      { $match: { metascore: { $gte: 70 } } },
      { $sample: { size: 1 } }
    ])
    .toArray((error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result);
    });
});

//Fetch a specific movie according to its id
app.get("/movies/:id", (request, response) => {
  collection.find({ id: request.params.id }).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// //Search for Denzel's movies, using a query
// app.get("/movies/search", (request, response) => {
//   console.log(request.query.limit);
//   collection
//     .aggregate([
//       {
//         $match: { metascore: { $gte: Number(request.query.metascore) } }
//       },
//       { $sample: { size: Number(request.query.limit) } }
//     ])
//     .toArray((error, result) => {
//       if (error) {
//         return response.status(500).send(error);
//       }
//       response.send(result);
//     });
// });
