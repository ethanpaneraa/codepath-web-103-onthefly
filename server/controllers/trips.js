import pool from "../config/database.js"; 

const createTrip = async (req, res) => {
    const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body; 

    if (!title || !description || !img_url || !num_days || !start_date || !end_date || !total_cost) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const createTripSQL = `
        INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    try {
        const params = [title, description, img_url, num_days, start_date, end_date, total_cost];
        const newTrip = await pool.query(createTripSQL, params); 
        res.status(201).json(newTrip.rows[0]); 
    } catch (error) {
        res.status(409),json({error: error.message}); 
    };
};

const getTrips = async (req, res) => {
    const getTripsSQL = `
        SELECT * FROM trips ORDER BY id ASC; 
    `;

    try {
        const results = await pool.query(getTripsSQL);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({error: error.message})
    };
};

const getTripById = async (req, res) => {
    const { id } = parseInt(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const getTripByIdSQL = `
        SELECT * FROM trips WHERE id = $1;
    `;

    try {
        const params = [id];
        const trip = await pool.query(getTripByIdSQL, params);
        res.status(200).json(trip.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const updateTrip = async (req, res) => {
    const { id } = parseInt(req.params.id); 
    const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body; 

    if (!id || !title || !description || !img_url || !num_days || !start_date || !end_date || !total_cost) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const updateTripSQL = `
        UPDATE trips SET title = $1, description = $2, img_url = $3, num_days = $4, start_date = $5, end_date = $6, total_cost = $7 
        WHERE id = $8;
    `;

    try {
        const params = [title, description, img_url, num_days, start_date, end_date, total_cost, id];
        const updatedTrip = await pool.query(updateTripSQL, params);
        res.status(200).json(updatedTrip.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const deleteTrip = async (req, res) => {
    const { id } = parseInt(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const deleteTripSQL = `
        DELETE FROM trips WHERE id = $1;
    `;

    try {
        const params = [id];
        const deletedTrip = await pool.query(deleteTripSQL, params);
        res.status(200).json(deletedTrip.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

export default {
    createTrip, 
    getTrips, 
    getTripById, 
    deleteTrip, 
};
