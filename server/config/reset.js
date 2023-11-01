import pool from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import { create } from "domain";

const currentPath = fileURLToPath(import.meta.url);
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), "../config/data/data.json")); 
const tripsData = JSON.parse(tripsFile);

const createTripsTable = async () => {

    const createTripsTableSQL = `
        CREATE TABLE IF NOT EXISTS trips (
            id serial PRIMARY KEY, 
            title varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            img_url text NOT NULL, 
            num_days integer NOT NULL, 
            start_date date NOT NULL,
            end_date date NOT NULL, 
            total_cost money NOT NULL
        ); 
    `;

    try {
        const res = await pool.query(createTripsTableSQL); 
        console.log("Trips table created successfully!")
    } catch (error) {
        console.log("Error creating trips table:", error)
    };
};

const createDestinationsTable = async () => {

    const createDestinationsTableSQL = `
        CREATE TABLE IF NOT EXISTS destinations (
            id serial PRIMARY KEY, 
            destination varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            city varchar(100) NOT NULL,
            country varchar(100) NOT NULL,
            img_url text NOT NULL,
            flag_img_url text NOT NULL
        ); 
    `;

    try {
        const res = await pool.query(createDestinationsTableSQL);
        console.log("Destinations table created successfully!")
    } catch (error) {
        console.log("Error creating destinations table:", error)
    };

    try {
        const res = await pool.query(createDestinationsTableSQL); 
        console.log("Destinations table created successfully!")
    } catch (error) {
        console.log("Error creating destinations table:", error)
    };
};

const createActivitiesTable = async () => {

    const createActivitiesTableSQL = `
        CREATE TABLE IF NOT EXISTS activities (
            id serial PRIMARY KEY, 
            trip_id int NOT NULL, 
            activity varchar(100) NOT NULL,
            num_votes integer DEFAULT 0, 
            FOREIGN KEY(trip_id) references trips(id)
        );
    `;

    try {
        const res = await pool.query(createActivitiesTableSQL); 
        console.log("Activities table created successfully!"); 
    } catch (error) {
        console.log("Error creating activities table:", error)
    };

};

const createTripsDestinationsTable = async () => {

    const createTripsDestinationsTableSQL = `
        CREATE TABLE IF NOT EXISTS trips_destinations (
            trip_id int NOT NULL, 
            destination_id int NOT NULL, 
            PRIMARY KEY(trip_id, destination_id),
            FOREIGN KEY(trip_id) references trips(id) ON UPDATE CASCADE,
            FOREIGN KEY(destination_id) references destinations(id) ON UPDATE CASCADE
        );
    `;

    try {
        const res = await pool.query(createTripsDestinationsTableSQL); 
        console.log("Trips_destinations table created successfully!");
    } catch (error) {
        console.log("Error creating trips_destinations table:", error)
    };

};

const createUsersTable = async () => {

    const createUsersTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY, 
            githubid integer NOT NULL,
            username varchar(100) NOT NULL,
            avatarurl varchar(500) NOT NULL, 
            accesstoken varchar(500) NOT NULL
        );
    `;

    try {
        const res = await pool.query(createUsersTableSQL); 
        console.log("Users table created successfully!");
    } catch (error) {
        console.log("Error creating users table:", error)
    };

};

const createTripsUsersTable = async () => {

    const createTripsUsersTableSQL = `
        CREATE TABLE IF NOT EXISTS trips_users (
            trip_id int NOT NULL, 
            user_id int NOT NULL, 
            PRIMARY KEY(trip_id, user_id),
            FOREIGN KEY(trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE
        );
    `;

    try {
        const res = await pool.query(createTripsUsersTableSQL);
        console.log("Trips_users table created successfully!"); 
    } catch (error) {
        console.log("Error creating trips_users table:", error)
    };

};

const seedTripsTable = async () => {
    await createTripsTable(); 

    tripsData.forEach((trip) => {

        const insertQuery = {
            text:  `INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        };

        const values = [
            trip.title, 
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost,
        ];

        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.log("Error seeding trips table:", err);
                return
            } else {
                console.log(`✅ ${trip.title} added successfully`);
            };
        });
    });
};

seedTripsTable();
createDestinationsTable(); 
createActivitiesTable(); 
createTripsDestinationsTable(); 
createUsersTable(); 
createTripsUsersTable();;