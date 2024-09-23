const express = require('express'); // Express framework ko import kar rahe hain
const path = require('path'); // Path module ko import kar rahe hain, yeh files ke path manage karne mein madad deta hai
const fs = require('fs'); // File System module ko import kar rahe hain, jo files ko read, write, etc. karne mein madad karta hai
const { error } = require('console'); // Console ke error function ko destructure kar rahe hain (yahan shayad zaroori nahi)

const app = express(); // Express app ka instance bana rahe hain

app.set('view engine', 'ejs'); // View engine ko EJS set kar rahe hain, jo dynamic HTML render karta hai

app.use(express.json()); // JSON data ko process karne ke liye middleware use kar rahe hain
app.use(express.urlencoded({extended:true})); // URL-encoded data (form data) ko handle karne ke liye middleware
app.use(express.static(path.join(__dirname, 'public'))); // Static files ko serve karne ke liye public folder set kar rahe hain

// Home route
app.get('/', (req,res)=>{

    // Files folder mein sab file names ko read kar rahe hain
    fs.readdir(`./files`, (error, files)=>{
        // Index page ko render kar rahe hain aur files array ko bhej rahe hain
        res.render('index', {files});    
    });
    
});

// Specific file ko display karne ka route
app.get('/file/:filename', (req,res)=>{
    // Requested file ko read kar rahe hain
    fs.readFile(`./files/${req.params.filename}`, "utf-8" , (error, filedata)=>{
        // Show page ko render kar rahe hain aur file ka naam aur data bhej rahe hain
        res.render('show', {filename: req.params.filename, filedata: filedata});
    });
});

// Nayi file create karne ka POST route
app.post('/create', (req, res)=>{
    // Title ko space hata kar filename bana rahe hain aur file mein data likh rahe hain
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (error)=>{
        // File create hone ke baad home page par redirect kar rahe hain
        res.redirect('/');
    });
});

// Edit page ko render karne ka route
app.get('/edit/:filename', (req, res)=>{
    // Edit page ko render kar rahe hain, file ka naam bhej rahe hain jo edit ki ja rahi hai
    res.render('edit', {filename: req.params.filename});
});

// Edit request ko handle karne ka POST route
app.post('/edit', (req, res)=>{
    // File ka naam rename kar rahe hain, purane naam ko naya naam diya ja raha hai
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (error)=>{
        // Edit hone ke baad home page par redirect kar rahe hain
        res.redirect('/');
    });
});

// Server ko 3000 port par run kar rahe hain
app.listen(3000, ()=>{
    console.log("Server running at 3000");
});
