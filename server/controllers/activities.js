import pool from "../config/database.js"; 

const createActivity = async (req, res) => {
    const { activity, trip_id } = req.body;

    if (!activity || !trip_id) {
        return res.status(400).json({ error: "Missing required fields" });
    };  

    const createActivitySQL = `
        INSERT INTO activities (activity, trip_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    try {
        const params = [activity, trip_id];
        const newActivity = await pool.query(createActivitySQL, params);
        res.status(201).json(newActivity.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const getActivities = async (req, res) => {
    const getActivitiesSQL = `
        SELECT * FROM activities ORDER BY id ASC;
    `;

    try {
        const results = await pool.query(getActivitiesSQL);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const getActivityById = async (req, res) => {
    const id  = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }; 

    const getActivityByIdSQL = `
        SELECT * FROM activities WHERE id = $1;
    `;

    try {
        const params = [id];
        const activity = await pool.query(getActivityByIdSQL, params);
        res.status(200).json(activity.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    }; 
};

const updateActivity = async (req, res) => {
    const id  = parseInt(req.params.id);

    const { num_votes } = req.body;

    if (!id || !num_votes) {
        return res.status(400).json({ error: "Missing required fields" });
    };

    const updateActivitySQL = `
        UPDATE activities SET num_votes = $1 WHERE id = $2 RETURNING *;
    `;

    try {
        const params = [num_votes, id];
        const activity = await pool.query(updateActivitySQL, params);
        res.status(200).json(activity.rows[0]);
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

const deleteActivity = async (req, res) => {
    const id = parseInt(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    };

    const deleteActivitySQL = `
        DELETE FROM activities WHERE id = $1;
    `;

    try {
        const params = [id];
        await pool.query(deleteActivitySQL, params);
        res.status(200).json({ message: "Activity deleted successfully!" });
    } catch (error) {
        res.status(409).json({error: error.message});
    };
};

export default {
    createActivity, 
    getActivities, 
    getActivityById, 
    updateActivity, 
    deleteActivity, 
};