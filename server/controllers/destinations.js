import pool from "../config/database.js";

const createDestination = async (req, res) => {
    const { destination, description, city, country, img_url, flag_img_url } = req.body; 

    if (!destination || !description || !city || !country || !img_url || !flag_img_url) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    try {
        const createDestinationSQL = `
            INSERT INTO destinations (destination, description, city, country, img_url, flag_img_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const params = [destination, description, city, country, img_url, flag_img_url];
        const newDestination = await pool.query(createDestinationSQL, params); 
        res.status(201).json(newDestination.rows[0]); 
    } catch (error) {
        return res.status(409).json({error: error.message});
    }
};

const getDestinations = async (req, res) => {
    const getDestinationsSQL = `
        SELECT * FROM destinations ORDER BY id ASC; 
    `;

    try {
        const results = await pool.query(getDestinationsSQL);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({error: error.message})
    };
};

const getDestinationByID = async (req, res) => {
    const id  = parseInt(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const getDestinationByIDSQL = `
        SELECT * FROM destinations WHERE id = $1;
    `;

    try {
        const params = [id];
        const destination = await pool.query(getDestinationByIDSQL, params);
        res.status(200).json(destination.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const updateDestination = async (req, res) => {
    const id  = parseInt(req.params.id); 
    const { destination, description, city, country, img_url, flag_img_url } = req.body; 

    if (!id || !destination || !description || !city || !country || !img_url || !flag_img_url) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const updateDestinationSQL = `
        UPDATE destinations 
        SET destination = $1, description = $2, city = $3, country = $4, img_url = $5, flag_img_url = $6
        WHERE id = $7
        RETURNING *;
    `;

    try {
        const params = [destination, description, city, country, img_url, flag_img_url, id];
        const updatedDestination = await pool.query(updateDestinationSQL, params);
        res.status(200).json(updatedDestination.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const deleteDestination = async (res, res) => {
    const id  = parseInt(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const deleteDestinationSQL = `
        DELETE FROM destinations WHERE id = $1;
    `;

    try {
        const params = [id];
        const deletedDestination = await pool.query(deleteDestinationSQL, params);
        res.status(200).json(deletedDestination.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

export default {
    createDestination, 
    getDestinations, 
    getDestinationByID, 
    updateDestination, 
    deleteDestination, 
};