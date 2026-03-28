const fs = require('fs');

const data = `Telugu,Action,RRR,8.0,2022,NTR; Ram Charan; Alia Bhatt,182 min,S. S. Rajamouli,Netflix
Telugu,Drama,Baahubali: The Beginning,8.0,2015,Prabhas; Rana Daggubati; Anushka Shetty,159 min,S. S. Rajamouli,Hotstar
Telugu,Action,Pushpa: The Rise,7.6,2021,Allu Arjun; Rashmika Mandanna,179 min,Sukumar,Amazon Prime
Telugu,Romance,Geetha Govindam,7.7,2018,Vijay Deverakonda; Rashmika Mandanna,148 min,Parasuram,Amazon Prime
Telugu,Drama,Jersey,8.5,2019,Nani; Shraddha Srinath,160 min,Gowtam Tinnanuri,Netflix
Telugu,Fantasy,Eega,7.7,2012,Nani; Samantha; Sudeep,145 min,S. S. Rajamouli,Hotstar
Telugu,Action,Magadheera,7.7,2009,Ram Charan; Kajal Aggarwal,147 min,S. S. Rajamouli,Sun NXT
Telugu,Drama,Ala Vaikunthapurramuloo,7.3,2020,Allu Arjun; Pooja Hegde,165 min,Trivikram Srinivas,Netflix
Telugu,Thriller,HIT: The First Case,7.7,2020,Vishwak Sen; Ruhani Sharma,125 min,Sailesh Kolanu,Amazon Prime
Telugu,Comedy,F2: Fun and Frustration,6.1,2019,Venkatesh; Varun Tej,148 min,Anil Ravipudi,Netflix
Hindi,Drama,3 Idiots,8.4,2009,Aamir Khan; Kareena Kapoor; R. Madhavan,171 min,Rajkumar Hirani,Netflix
Hindi,Drama,Dangal,8.3,2016,Aamir Khan; Fatima Sana Shaikh,161 min,Nitesh Tiwari,Disney+ Hotstar
Hindi,Comedy,PK,8.1,2014,Aamir Khan; Anushka Sharma,153 min,Rajkumar Hirani,Netflix
Hindi,Action,Pathaan,5.9,2023,Shah Rukh Khan; Deepika Padukone,146 min,Siddharth Anand,Amazon Prime
Hindi,Thriller,Andhadhun,8.2,2018,Ayushmann Khurrana; Tabu,139 min,Sriram Raghavan,Netflix
Hindi,Comedy,Hera Pheri,8.1,2000,Akshay Kumar; Paresh Rawal,156 min,Priyadarshan,Amazon Prime
Hindi,Thriller,Drishyam,8.2,2015,Ajay Devgn; Tabu,163 min,Nishikant Kamat,Hotstar
Hindi,Romance,Dilwale Dulhania Le Jayenge,8.0,1995,Shah Rukh Khan; Kajol,189 min,Aditya Chopra,Amazon Prime
Hindi,Romance,Kabir Singh,7.0,2019,Shahid Kapoor; Kiara Advani,172 min,Sandeep Reddy Vanga,Netflix
Hindi,Drama,Zindagi Na Milegi Dobara,8.2,2011,Hrithik Roshan; Farhan Akhtar,155 min,Zoya Akhtar,Netflix
English,Action,Avengers: Endgame,8.4,2019,Robert Downey Jr.; Chris Evans,181 min,Anthony Russo; Joe Russo,Disney+
English,Action,Avengers: Infinity War,8.4,2018,Robert Downey Jr.; Chris Hemsworth,149 min,Anthony Russo; Joe Russo,Disney+
English,Romance,Titanic,7.9,1997,Leonardo DiCaprio; Kate Winslet,195 min,James Cameron,Disney+
English,Thriller,Inception,8.8,2010,Leonardo DiCaprio; Joseph Gordon-Levitt,148 min,Christopher Nolan,Netflix
English,Sci-Fi,Interstellar,8.6,2014,Matthew McConaughey; Anne Hathaway,169 min,Christopher Nolan,Amazon Prime
English,Action,The Dark Knight,9.0,2008,Christian Bale; Heath Ledger,152 min,Christopher Nolan,Netflix
English,Drama,The Shawshank Redemption,9.3,1994,Tim Robbins; Morgan Freeman,142 min,Frank Darabont,Amazon Prime
English,Drama,Forrest Gump,8.8,1994,Tom Hanks; Robin Wright,142 min,Robert Zemeckis,Netflix
English,Action,Gladiator,8.5,2000,Russell Crowe; Joaquin Phoenix,155 min,Ridley Scott,Amazon Prime
English,Drama,Joker,8.4,2019,Joaquin Phoenix; Robert De Niro,122 min,Todd Phillips,Netflix`;

const colors = ['1a1a2e', '0f3460', 'e94560', '533483', '16213e', '395b64', '2c3639'];

const movies = data.split('\n').filter(line => line.trim() !== '').map((line, index) => {
    const [language, genre, title, rating, year, cast, duration, director, platform] = line.split(',');
    const color = colors[index % colors.length];
    return {
        id: index + 1,
        language,
        genre,
        title,
        rating: parseFloat(rating),
        year: parseInt(year),
        cast: cast.split('; ').map(c => c.trim()),
        duration,
        director,
        platform,
        image: `https://via.placeholder.com/300x450/${color}/ffffff?text=${encodeURIComponent(title ? title.split(': ')[0] : 'Movie')}`
    };
});

// Let's add more as requested
movies.push({
    id: movies.length + 1,
    language: 'English',
    genre: 'Sci-Fi',
    title: 'The Matrix',
    rating: 8.7,
    year: 1999,
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    duration: '136 min',
    director: 'Lana Wachowski, Lilly Wachowski',
    platform: 'HBO Max',
    image: 'https://via.placeholder.com/300x450/004d40/ffffff?text=The+Matrix'
});

movies.push({
    id: movies.length + 1,
    language: 'Hindi',
    genre: 'Action',
    title: 'Sholay',
    rating: 8.1,
    year: 1975,
    cast: ['Dharmendra', 'Sanjeev Kumar', 'Hema Malini', 'Amitabh Bachchan'],
    duration: '204 min',
    director: 'Ramesh Sippy',
    platform: 'Amazon Prime',
    image: 'https://via.placeholder.com/300x450/ff6f00/ffffff?text=Sholay'
});

movies.push({
    id: movies.length + 1,
    language: 'Telugu',
    genre: 'Drama',
    title: 'Mahanati',
    rating: 8.5,
    year: 2018,
    cast: ['Keerthy Suresh', 'Dulquer Salmaan', 'Samantha'],
    duration: '177 min',
    director: 'Nag Ashwin',
    platform: 'Amazon Prime',
    image: 'https://via.placeholder.com/300x450/880e4f/ffffff?text=Mahanati'
});

if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}
fs.writeFileSync('data/movies.json', JSON.stringify(movies, null, 2));
console.log('movies.json has been generated!');
