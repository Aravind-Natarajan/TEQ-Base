// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://aravind485528:aravind485528@cluster0.sp31750.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log('MongoDB error:', err));

//Employee register schema Create a User model
const userSchema = new mongoose.Schema({
  name: String,
  emp:String,
  email: String,
  password: String
});
const User = mongoose.model('signup', userSchema);



//login endpoint
app.post('/login', async (req, res) => {
  const { emp, password } = req.body;

  try {
    const user = await User.findOne({ emp });

    if (!user) {
      console.log("entry")
      return res.status(404).json({ message: "No record existed" });
      
    }
    if (user.password === password) {
      console.log("Password block")
      return res.json({ message: "Success" });
    } else {
      console.log("incorrect")
      return res.status(401).json({ message: "The password is incorrect" });
    }
  }
  catch (error) {
    console.log("server error")
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Employee Register endpoint
app.post('/register', async (req, res) => {
  const { name,email ,password,emp } = req.body;
  const user = new User({ name,email, password,emp });

  try {
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});


//get employee data to show the frontend
// Define the endpoint to get all signups data
app.get('/signups', async (req, res) => {
  try {
    const signups = await User.find(); // Fetch all users from the 'signups' collection
    res.json(signups);  // Send the array back to the client
    console.log("Signups Data:", signups); // Log the data to ensure it's an array
  } catch (err) {
    res.status(500).json({ message: 'Error fetching signups data' });
  }
});


//student register schema Create a User model
const studentSchema = new mongoose.Schema({
  regno: String,
  name:String,
  course: String,
  slot: Number,
  trainer:String,
  mode:String,
  status:String
});
const Student = mongoose.model('student details', studentSchema);

// Update all documents with status 'On process'
// const addStatusToAllStudents = async () => {
//   try {
//     await Student.updateMany({}, { $set: { status: 'On process' } });
//     console.log('Status added to all students');
//   } catch (error) {
//     console.error('Error updating students:', error);
//   }
// };
// addStatusToAllStudents();

//student register for admin
app.post('/studentreg', async (req, res) => {
  const { regno,name,course ,slot,trainer,mode,status } = req.body;
  const std = new Student({ regno,name,course,slot,trainer,mode,status });

  try {
    await std.save();
    res.status(201).send('Student Data registered successfully');
  } catch (error) {
    res.status(400).send('Error registering Student data');
  }
});

// student retrieve student data
app.get('/student/:regno', async (req, res) => {
  try {
    const student = await Student.findOne({ regno: req.params.regno });
    if (student) {
      res.json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    res.status(500).send('Error retrieving student');
  }
});

//student update student data
app.put('/studentreg', async (req, res) => {
  const { regno, name, course, slot, trainer,mode,status } = req.body;
  console.log(req.body)
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { regno: regno },
      { name, course, slot, trainer, mode, status },
      { new: true } // Returns the updated document
    );
    if (updatedStudent) {
      res.json('Student updated successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    res.status(500).send('Error updating student data');
  }
});

// student delete student data
app.delete('/studentreg/:regno', async (req, res) => {
  try {
    const { regno } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ regno });
    if (deletedStudent) {
      res.json('Student deleted successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    res.status(500).send('Error deleting student data');
  }
});

//STUDENT DETAILS GET IN DATABASE TO REACT COMPONENT
app.get('/studentdetails', async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all student data from MongoDB
    res.json(students); // Send the data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data' }); // Error handling
  }
});



// Get student details grouped by trainer and slot
app.get('/shedule', async (req, res) => {
  try {
    // Fetch only students with status "on process"
    const students = await Student.find({ status: 'On process' }); // Filter students by status

    // Group students by trainer and slot
    const groupedData = {};

    students.forEach((student) => {
      const { trainer, slot } = student;

      // Create a new object for each trainer if it doesn't exist
      if (!groupedData[trainer]) {
        groupedData[trainer] = {
          trainerName: trainer,
          slots: [[], [], [], []], // Assuming there are 4 slots
        };
      }

      // Add student to the appropriate slot
      groupedData[trainer].slots[slot - 1].push(student);
    });

    const result = Object.values(groupedData); // Convert groupedData object to an array
    res.json(result); // Send the grouped data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data' }); // Error handling
  }
});



//employ login show only our student details

app.get('/empstudent/:empId', async (req, res) => {
  const empId = req.params.empId;

  try {
    // Assuming students are related to employees via empId (you may need to add this relation in the schema)
    const students = await Student.find({ empId }); // Filter students based on empId
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this Employee ID' });
    }

    res.json(students); // Send the student data as JSON
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});


// Get employee details by empId
app.get('/employee/:empId', async (req, res) => {
  const empId = req.params.empId;
  
  try {
    const employee = await User.findOne({ emp: empId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee); // Return the employee details (including name)
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get students by trainer name
app.get('/students/by-trainer/:trainerName', async (req, res) => {
  const trainerName = req.params.trainerName;
  
  try {
    const students = await Student.find({ trainer: trainerName,status: 'On process' });

    if (!students.length) {
      return res.status(404).json({ message: 'No students found for this trainer' });
    }
    
    res.json(students); // Return the students data
  } catch (error) {
    console.error('Error fetching student data by trainer:', error);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

//Show the student name in report table
app.get('/students/by-trainer/:trainer', async (req, res) => {
  try {
    const trainer = req.params.trainer;
    const students = await Student.find({ trainer }); // Find students whose trainer matches employee name
    res.json(students);
  } catch (error) {
    res.status(500).send('Error fetching student data');
  }
});

// report data field 

//report data schema
const reportSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  teamName: { type: String, required: true },
  date: { type: String, required: true },
  slots: [
    {
      timing: { type: String, required: true },
      activities: { type: String, required: false },
      students: [
        {
          name: { type: String, required: true },
          course: { type: String, required: true },
          checked: { type: Boolean, default: false },
        }
      ],
      studentCount: { type: Number, default: 0 },
    }
  ]
});

const Report = mongoose.model('reportdata', reportSchema);

//store report data
app.post('/reports', async (req, res) => {
  try {
    const { employeeName, teamName, date, slots } = req.body;
    
    // Validate required fields
    if (!employeeName || !teamName || !date || !slots || slots.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: employeeName, teamName, date, or slots.' });
    }
    
    const reportData = new Report(req.body);
    const savedReport = await reportData.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error saving report:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error saving report', error: error.message });
  }
});

//get the report data in database show the ui
app.get('/reportshowing', async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json(reports); // Send data as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Create the uploads directory if it doesn't exist
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use the uploads directory to store files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to avoid name conflicts
  },
});

const upload = multer({ storage });

// Define the schema for the uploaded file
const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
});

const Image = mongoose.model('Image', ImageSchema);

// Create the upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file || !req.body.name) {
    return res.status(400).json({ message: 'Please provide your name and select an image.' });
  }

  const newImage = new Image({
    name: req.body.name,
    filename: req.file.filename,
    path: req.file.path,
  });

  newImage.save()
    .then((image) => {
      res.json({ message: 'File uploaded successfully!', image });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error saving image to database.', error: err });
    });
});

 // Route to fetch all images from the database
app.get('/images', (req, res) => {
  Image.find()
    .then(images => {
      // Assuming the image model stores the file name as 'path'
      const imagesWithFullPath = images.map(image => ({
        ...image.toObject(),
        path: `${image.path}` // Making path relative to the server's base URL
      }));
      res.json(imagesWithFullPath);
    })
    .catch(err => {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: 'Failed to fetch images' });
    });
});









// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


