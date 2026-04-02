const fs = require('fs');
const express = require('express');
const app = express(); // Create an express application
app.use(express.json()); // Middleware to parse JSON bodies

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//// Below code is for IST time zone
// app.use((req, res, next) => {
//   req.requestTime = new Date().toLocaleString('en-IN', {
//     timeZone: 'Asia/Kolkata',
//   });
//   next();
// });

// ---------------Basic route handlers for GET and POST requests to the root URL---------------------------
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from server!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('Data received successfully!');
// });

// Read the tours data from the JSON file.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// ---------------Route handlers for tour resources---------------------------
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.json({
    status: 'success',
    result: tours.length,
    requestedTime: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  // Check if the tour with the given ID exists
  // if(id > tours.length){
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'not found with this id',
    });
  }

  res.json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
  // res.send('Done Successfully!');
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated data here.../>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//Route handlers for tour resources
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// GET method to get all tours ----------------------------------
// GET method to get a specific tour by ID ----------------------------------

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// POST method to create new tour ----------------------------------
// PATCH method to update a tour by ID ----------------------------------
// DELETE method to delete a tour by ID ----------------------------------
// Start the server and listen on a specific port ---------------------------
