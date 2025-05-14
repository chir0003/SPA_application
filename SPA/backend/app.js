const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require('http');
const cors = require('cors');
let app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { Translate } = require("@google-cloud/translate").v2;
const { ObjectId } = require('mongodb');

app.use(express.json());


app.use(cors({
  origin: 'http://localhost:4200',  // Change the port if needed
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}));
const admin = require("firebase-admin");
app.use(express.static('.dist/a3/browser'))
//Get a reference to the private key
const serviceAccount = require("./serviceAccountKey.json");

// initialize the access to Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

// Collections for counting CRUD operations
const operationCountersRef = db.collection('operationCounters').doc('counters');

async function incrementCounter(operation) {
  let doc = await operationCountersRef.get();
  
  if (!doc.exists) {
      // Initialize the document with all the operation fields
      await operationCountersRef.set({ create: 0, retrieve: 0, update: 0, delete: 0 });
      doc = await operationCountersRef.get();  
  }

  const data = doc.data();
  
  
  const currentCount = data[operation] !== undefined ? data[operation] : 0;
  
  await operationCountersRef.update({ [operation]: currentCount + 1 });
}

const Driver = require("./models/driver");
const Package = require("./models/package");
const driverRoutes = require('./routes/driver-routes');
const packageRoutes = require('./routes/package-routes');

const print = console.log;
const VIEWS_PATH = path.join(__dirname, "/views/");

const url = "mongodb://localhost:27017/a2db";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function connect() {
	await mongoose.connect(url);
}
connect()
	.catch((err) => console.log(err));

const PORT_NUMBER = 3000;

app.use('/34073604/chirag',express.static("node_modules/bootstrap/dist/css"));
app.use("/34073604/chirag/images", express.static("images"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));

app.listen(PORT_NUMBER, function () {
	console.log(`listening on port ${PORT_NUMBER}`);
});

app.get('/34073604/chirag/counters', async function (req, res) {
  try {
    const doc = await db.collection('operationCounters').doc('counters').get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Counters document not found' });
    }
    
    const data = doc.data();
    
    // Return the data as JSON
    res.json({ counts: data });
  } catch (error) {
    console.error('Error retrieving counters:', error);
    // Return error message as JSON
    res.status(500).json({ message: 'Failed to retrieve counters', error: error.message });
  }
});

// Initialize Google Cloud Translation

const translate = new Translate();

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for translate requests from the client
  socket.on('translate', async ({ description, language }) => {
    try {
      const [translation] = await translate.translate(description, language);
      socket.emit('translationResult', { translatedDescription: translation });
    } catch (error) {
      console.error('Translation error:', error);
      socket.emit('translationError', { message: 'Failed to translate' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



// Routes
app.use('/34073604/chirag/api/v1/drivers', driverRoutes);
app.use('/34073604/chirag/api/v1/packages', packageRoutes);

