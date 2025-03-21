
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Destination from '../models/PopularDestination.js';
import Hotel from '../models/Hotel.js';
import City from '../models/City.js';


console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedData = async () => {
    await Destination.deleteMany();
    await Hotel.deleteMany();
    await City.deleteMany();

    await Destination.insertMany([
        { code: 1211, name: 'Mumbai', imageUrl: '/images/cities/mumbai.jpg' },
        { code: 1212, name: 'Bangkok', imageUrl: '/images/cities/bangkok.jpg' },
        { code: 1213, name: 'London', imageUrl: '/images/cities/london.jpg' },
        { code: 1214, name: 'Dubai', imageUrl: '/images/cities/dubai.jpg' },
        { code: 1215, name: 'Oslo', imageUrl: '/images/cities/oslo.jpg' },
    ]);

    await City.insertMany([
        { name: 'Pune' },
        { name: 'Bangalore' },
        { name: 'Mumbai' },
    ]);

    await Hotel.insertMany([
        { name: 'Hotel Pune', city: 'Pune', address: '123 Pune St', price: 100, rating: 4.5, imageUrl: '/images/hotels/pune.jpg' },
        { name: 'Hotel Bangalore', city: 'Bangalore', address: '456 Bangalore Rd', price: 150, rating: 4.2, imageUrl: '/images/hotels/bangalore.jpg' },
    ]);

    console.log('Data seeded!');
    mongoose.connection.close();
};

seedData();
