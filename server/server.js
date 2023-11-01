import express from "express"; 
import cors from "cors"; 
import tripRoutes from "./routes/trips.js";

const PORT = process.env.PORT || 3001; 

const app = express(); 1
app.use(express.json()); 
app.use(cors());


app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
    res.status(200).send(`<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>'`)
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
}); 