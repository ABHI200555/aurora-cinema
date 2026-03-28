const fs = require('fs');

const dataMap = {
  "Khaleja": { cast: ["Mahesh Babu", "Anushka Shetty"], director: "Trivikram Srinivas" },
  "Rangasthalam": { cast: ["Ram Charan", "Samantha"], director: "Sukumar" },
  "Temper": { cast: ["Jr NTR", "Kajal Aggarwal"], director: "Puri Jagannadh" },
  "Kshanam": { cast: ["Adivi Sesh", "Adah Sharma"], director: "Ravikanth Perepu" },
  "C/o Kancharapalem": { cast: ["Subba Rao", "Radha Bessy"], director: "Maha Venkatesh" },
  "Pelli Choopulu": { cast: ["Vijay Deverakonda", "Ritu Varma"], director: "Tharun Bhascker" },
  "Sye": { cast: ["Nithiin", "Genelia D'Souza"], director: "S.S. Rajamouli" },
  "Ready": { cast: ["Ram Pothineni", "Genelia D'Souza"], director: "Srinu Vaitla" },
  "Oopiri": { cast: ["Nagarjuna", "Karthi", "Tamannaah"], director: "Vamshi Paidipally" },
  "Agent Sai Srinivasa Athreya": { cast: ["Naveen Polishetty", "Shruti Sharma"], director: "Swaroop RSJ" },
  "Simhadri": { cast: ["Jr NTR", "Bhumika Chawla"], director: "S.S. Rajamouli" },
  "Nuvvu Naaku Nachav": { cast: ["Venkatesh", "Arti Agarwal"], director: "K. Vijaya Bhaskar" },
  "Tholi Prema": { cast: ["Pawan Kalyan", "Keerthi Reddy"], director: "A. Karunakaran" },
  "Indra": { cast: ["Chiranjeevi", "Sonali Bendre"], director: "B. Gopal" },
  "King": { cast: ["Nagarjuna", "Trisha"], director: "Srinu Vaitla" },
  "Bommarillu": { cast: ["Siddharth", "Genelia D'Souza"], director: "Bhaskar" },
  "Chatrapathi": { cast: ["Prabhas", "Shriya Saran"], director: "S.S. Rajamouli" },
  "Anukokunda Oka Roju": { cast: ["Charmme Kaur", "Jagapathi Babu"], director: "Chandra Sekhar Yeleti" },
  "Jagadeka Veerudu Athiloka Sundari": { cast: ["Chiranjeevi", "Sridevi"], director: "K. Raghavendra Rao" },
  "Sankarabharanam": { cast: ["J.V. Somayajulu", "Manju Bhargavi"], director: "K. Viswanath" },
  "Lagaan": { cast: ["Aamir Khan", "Gracy Singh"], director: "Ashutosh Gowariker" },
  "Barfi!": { cast: ["Ranbir Kapoor", "Priyanka Chopra"], director: "Anurag Basu" },
  "Welcome": { cast: ["Akshay Kumar", "Katrina Kaif"], director: "Anees Bazmee" },
  "Ek Tha Tiger": { cast: ["Salman Khan", "Katrina Kaif"], director: "Kabir Khan" },
  "Special 26": { cast: ["Akshay Kumar", "Anupam Kher"], director: "Neeraj Pandey" },
  "Rang De Basanti": { cast: ["Aamir Khan", "Siddharth"], director: "Rakeysh Omprakash Mehra" },
  "Housefull": { cast: ["Akshay Kumar", "Riteish Deshmukh"], director: "Sajid Khan" },
  "My Name Is Khan": { cast: ["Shah Rukh Khan", "Kajol"], director: "Karan Johar" },
  "Aashiqui 2": { cast: ["Aditya Roy Kapur", "Shraddha Kapoor"], director: "Mohit Suri" },
  "Singham": { cast: ["Ajay Devgn", "Kajal Aggarwal"], director: "Rohit Shetty" },
  "Talaash": { cast: ["Aamir Khan", "Kareena Kapoor"], director: "Reema Kagti" },
  "De Dana Dan": { cast: ["Akshay Kumar", "Katrina Kaif"], director: "Priyadarshan" },
  "Queen": { cast: ["Kangana Ranaut", "Rajkummar Rao"], director: "Vikas Bahl" },
  "Jab We Met": { cast: ["Shahid Kapoor", "Kareena Kapoor"], director: "Imtiaz Ali" },
  "Krrish": { cast: ["Hrithik Roshan", "Priyanka Chopra"], director: "Rakesh Roshan" },
  "No Entry": { cast: ["Anil Kapoor", "Salman Khan"], director: "Anees Bazmee" },
  "Black": { cast: ["Amitabh Bachchan", "Rani Mukerji"], director: "Sanjay Leela Bhansali" },
  "Hum Dil De Chuke Sanam": { cast: ["Salman Khan", "Aishwarya Rai"], director: "Sanjay Leela Bhansali" },
  "Ghajini": { cast: ["Aamir Khan", "Asin"], director: "A.R. Murugadoss" },
  "Raazi": { cast: ["Alia Bhatt", "Vicky Kaushal"], director: "Meghna Gulzar" },
  "Iron Man": { cast: ["Robert Downey Jr.", "Gwyneth Paltrow"], director: "Jon Favreau" },
  "Captain America: Civil War": { cast: ["Chris Evans", "Robert Downey Jr."], director: "Anthony Russo, Joe Russo" },
  "Thor: Ragnarok": { cast: ["Chris Hemsworth", "Tom Hiddleston"], director: "Taika Waititi" },
  "Avatar": { cast: ["Sam Worthington", "Zoe Saldana"], director: "James Cameron" },
  "The Green Mile": { cast: ["Tom Hanks", "Michael Clarke Duncan"], director: "Frank Darabont" },
  "Se7en": { cast: ["Brad Pitt", "Morgan Freeman"], director: "David Fincher" },
  "Whiplash": { cast: ["Miles Teller", "J.K. Simmons"], director: "Damien Chazelle" },
  "The Silence of the Lambs": { cast: ["Jodie Foster", "Anthony Hopkins"], director: "Jonathan Demme" },
  "The Lord of the Rings: The Fellowship of the Ring": { cast: ["Elijah Wood", "Ian McKellen"], director: "Peter Jackson" },
  "The Lord of the Rings: The Return of the King": { cast: ["Elijah Wood", "Viggo Mortensen"], director: "Peter Jackson" },
  "Toy Story": { cast: ["Tom Hanks", "Tim Allen"], director: "John Lasseter" },
  "Toy Story 3": { cast: ["Tom Hanks", "Tim Allen"], director: "Lee Unkrich" },
  "Pirates of the Caribbean: The Curse of the Black Pearl": { cast: ["Johnny Depp", "Orlando Bloom"], director: "Gore Verbinski" },
  "Mad Max: Fury Road": { cast: ["Tom Hardy", "Charlize Theron"], director: "George Miller" },
  "Blade Runner 2049": { cast: ["Ryan Gosling", "Harrison Ford"], director: "Denis Villeneuve" },
  "The Social Network": { cast: ["Jesse Eisenberg", "Andrew Garfield"], director: "David Fincher" },
  "Django Unchained": { cast: ["Jamie Foxx", "Christoph Waltz"], director: "Quentin Tarantino" },
  "La La Land": { cast: ["Ryan Gosling", "Emma Stone"], director: "Damien Chazelle" },
  "Get Out": { cast: ["Daniel Kaluuya", "Allison Williams"], director: "Jordan Peele" },
  "Shutter Island": { cast: ["Leonardo DiCaprio", "Mark Ruffalo"], director: "Martin Scorsese" }
};

let db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

db = db.map(movie => {
  if (dataMap[movie.title]) {
    return {
      ...movie,
      cast: dataMap[movie.title].cast,
      director: dataMap[movie.title].director
    };
  }
  return movie;
});

fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
console.log('Successfully patched cast and directors!');
