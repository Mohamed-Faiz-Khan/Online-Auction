const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SECRET_KEY = 'my_super_secret_123!';

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auctionDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ========== USER SCHEMA ==========
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wonAuctions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuctionItem' }]
});

const User = mongoose.model('User', userSchema);

// ========== AUCTION ITEM SCHEMA ==========
const auctionItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    startingBid: { type: Number, required: true },
    auctionStart: { type: Date, required: true },
    auctionEnd: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    currentBid: { type: Number, default: 0 },
    highestBidder: { type: String, default: '' },
    isClosed: { type: Boolean, default: false }
});

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

// ========== MIDDLEWARE: AUTHENTICATION ==========
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Unauthorized: Invalid token' });

        req.user = user;
        next();
    });
};

// ========== MULTER: FILE UPLOAD CONFIG ==========
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ========== USER SIGN-UP ==========
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Signup failed' });
    }
});

// ========== USER SIGN-IN ==========
app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, message: 'Sign-in successful!' });
    } catch (error) {
        console.error('Sign-in Error:', error);
        res.status(500).json({ message: 'Sign-in failed' });
    }
});

// ========== POST AN AUCTION ==========
app.post('/auction', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { itemName, startingBid, auctionStart, auctionEnd } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const newAuction = new AuctionItem({ itemName, startingBid, auctionStart, auctionEnd, imageUrl });
        await newAuction.save();
        res.json({ message: 'Auction posted successfully!' });
    } catch (error) {
        console.error('Auction Posting Error:', error);
        res.status(500).json({ message: 'Failed to post auction' });
    }
});

// ========== GET ACTIVE AUCTIONS ==========
app.get('/auctions', async (req, res) => {
    try {
        const auctions = await AuctionItem.find({ auctionEnd: { $gt: new Date() } });
        res.json(auctions);
    } catch (error) {
        console.error('Fetching Auctions Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// ✅ Get a single auction item
app.get('/auctions/:id', async (req, res) => {
    try {
        const auction = await AuctionItem.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ Place a bid on an auction
app.post('/bid/:id', authenticate, async (req, res) => {
    try {
        const { bid } = req.body;
        const auction = await AuctionItem.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (bid <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid must be higher than the current bid' });
        }

        // ✅ Update auction with new bid
        auction.currentBid = bid;
        auction.highestBidder = req.user.username;
        await auction.save();

        res.json({ message: 'Bid placed successfully!' });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Failed to place bid' });
    }
});

// ========== SERVER START ==========
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
