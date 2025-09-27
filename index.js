import express from "express";
import bodyParser from "body-parser";
import pg from "pg";



const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database:"Permalist",
    password: "Kenya@12",
    port: 5432
  });

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


  
let items = [
  
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },

];

app.get("/",async (req, res) => {
  try{
    const list =  await db.query("Select * FROM Items ORDER BY id ASC")
    items = list.rows;
  
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    }); 
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO Items (title) values($1)", [item]);

    res.redirect("/");
  }catch(err){
    console.log(err);
  }
  
});

app.post("/edit",async (req, res) => {
  const name = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try{
    await db.query("UPDATE Items set title = ($1) where id = ($2)", [name, id]);
    res.redirect("/");

  }catch(err){
    console.log(err);
  }

});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;

  try{
    db.query('DELETE FROM Items where id = ($1)', [id]);
    res.redirect("/");

  }catch(err){
    console.log(err);
  }

});

//db.end();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
