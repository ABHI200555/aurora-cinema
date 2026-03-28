const fs = require('fs');

const rawData = `Language,Movie Type,Movie Name,Rating,Year
Telugu,Action,RRR,8.0,2022
Telugu,Drama,Baahubali: The Beginning,8.0,2015
Telugu,Action,Baahubali: The Conclusion,8.2,2017
Telugu,Action,Pushpa: The Rise,7.6,2021
Telugu,Drama,Jersey,8.5,2019
Telugu,Romance,Geetha Govindam,7.7,2018
Telugu,Fantasy,Eega,7.7,2012
Telugu,Action,Magadheera,7.7,2009
Telugu,Drama,Ala Vaikunthapurramuloo,7.3,2020
Telugu,Thriller,HIT: The First Case,7.7,2020
Telugu,Comedy,F2: Fun and Frustration,6.1,2019
Telugu,Action,Sarileru Neekevvaru,6.0,2020
Telugu,Action,Bharat Ane Nenu,7.5,2018
Telugu,Drama,Mahanati,8.4,2018
Telugu,Action,Arjun Reddy,8.1,2017
Telugu,Comedy,Julayi,7.2,2012
Telugu,Drama,Leader,8.0,2010
Telugu,Action,Dookudu,7.4,2011
Telugu,Fantasy,Anji,6.3,2004
Telugu,Thriller,Goodachari,7.9,2018
Hindi,Drama,3 Idiots,8.4,2009
Hindi,Drama,Dangal,8.3,2016
Hindi,Comedy,PK,8.1,2014
Hindi,Action,Pathaan,5.9,2023
Hindi,Thriller,Andhadhun,8.2,2018
Hindi,Comedy,Hera Pheri,8.1,2000
Hindi,Thriller,Drishyam,8.2,2015
Hindi,Romance,Dilwale Dulhania Le Jayenge,8.0,1995
Hindi,Romance,Kabir Singh,7.0,2019
Hindi,Drama,Zindagi Na Milegi Dobara,8.2,2011
Hindi,Action,War,6.5,2019
Hindi,Drama,Gully Boy,7.9,2019
Hindi,Comedy,Munna Bhai M.B.B.S.,8.1,2003
Hindi,Drama,Taare Zameen Par,8.4,2007
Hindi,Thriller,Kahaani,8.1,2012
Hindi,Action,Don,7.1,2006
Hindi,Comedy,Chup Chup Ke,6.9,2006
Hindi,Drama,Swades,8.2,2004
Hindi,Romance,Veer-Zaara,7.8,2004
Hindi,Action,Sholay,8.1,1975
English,Action,Avengers: Endgame,8.4,2019
English,Action,Avengers: Infinity War,8.4,2018
English,Romance,Titanic,7.9,1997
English,Thriller,Inception,8.8,2010
English,Sci-Fi,Interstellar,8.6,2014
English,Action,The Dark Knight,9.0,2008
English,Drama,The Shawshank Redemption,9.3,1994
English,Drama,Forrest Gump,8.8,1994
English,Action,Gladiator,8.5,2000
English,Drama,Joker,8.4,2019
English,Sci-Fi,The Matrix,8.7,1999
English,Adventure,Jurassic Park,8.1,1993
English,Animation,The Lion King,8.5,1994
English,Animation,Frozen,7.4,2013
English,Action,Spider-Man: No Way Home,8.2,2021
English,Fantasy,Harry Potter and the Sorcerer's Stone,7.6,2001
English,Crime,The Godfather,9.2,1972
English,Drama,Fight Club,8.8,1999
English,Crime,Pulp Fiction,8.9,1994
English,Horror,The Conjuring,7.5,2013
Telugu,Action,Khaleja,7.6,2010
Telugu,Drama,Rangasthalam,8.2,2018
Telugu,Action,Temper,7.4,2015
Telugu,Thriller,Kshanam,8.2,2016
Telugu,Drama,C/o Kancharapalem,8.8,2018
Telugu,Romance,Pelli Choopulu,8.2,2016
Telugu,Action,Sye,7.9,2004
Telugu,Comedy,Ready,7.3,2008
Telugu,Drama,Oopiri,8.0,2016
Telugu,Thriller,Agent Sai Srinivasa Athreya,8.4,2019
Telugu,Action,Simhadri,7.3,2003
Telugu,Drama,Nuvvu Naaku Nachav,8.7,2001
Telugu,Romance,Tholi Prema,8.2,1998
Telugu,Action,Indra,7.5,2002
Telugu,Comedy,King,7.2,2008
Telugu,Drama,Bommarillu,8.2,2006
Telugu,Action,Chatrapathi,7.6,2005
Telugu,Thriller,Anukokunda Oka Roju,8.0,2005
Telugu,Fantasy,Jagadeka Veerudu Athiloka Sundari,8.0,1990
Telugu,Drama,Sankarabharanam,8.9,1980
Hindi,Drama,Lagaan,8.1,2001
Hindi,Drama,Barfi!,8.1,2012
Hindi,Comedy,Welcome,7.0,2007
Hindi,Action,Ek Tha Tiger,5.7,2012
Hindi,Thriller,Special 26,8.0,2013
Hindi,Drama,Rang De Basanti,8.1,2006
Hindi,Comedy,Housefull,5.4,2010
Hindi,Drama,My Name Is Khan,7.9,2010
Hindi,Romance,Aashiqui 2,7.0,2013
Hindi,Action,Singham,6.8,2011
Hindi,Thriller,Talaash,7.2,2012
Hindi,Comedy,De Dana Dan,5.6,2009
Hindi,Drama,Queen,8.2,2013
Hindi,Romance,Jab We Met,7.9,2007
Hindi,Action,Krrish,6.4,2006
Hindi,Comedy,No Entry,6.6,2005
Hindi,Drama,Black,8.2,2005
Hindi,Romance,Hum Dil De Chuke Sanam,7.5,1999
Hindi,Action,Ghajini,7.3,2008
Hindi,Thriller,Raazi,7.8,2018
English,Action,Iron Man,7.9,2008
English,Action,Captain America: Civil War,7.8,2016
English,Action,Thor: Ragnarok,7.9,2017
English,Sci-Fi,Avatar,7.9,2009
English,Drama,The Green Mile,8.6,1999
English,Crime,Se7en,8.6,1995
English,Drama,Whiplash,8.5,2014
English,Thriller,The Silence of the Lambs,8.6,1991
English,Fantasy,The Lord of the Rings: The Fellowship of the Ring,8.8,2001
English,Fantasy,The Lord of the Rings: The Return of the King,9.0,2003
English,Animation,Toy Story,8.3,1995
English,Animation,Toy Story 3,8.3,2010
English,Adventure,Pirates of the Caribbean: The Curse of the Black Pearl,8.1,2003
English,Action,Mad Max: Fury Road,8.1,2015
English,Sci-Fi,Blade Runner 2049,8.0,2017
English,Drama,The Social Network,7.7,2010
English,Crime,Django Unchained,8.4,2012
English,Drama,La La Land,8.0,2016
English,Horror,Get Out,7.7,2017
English,Thriller,Shutter Island,8.2,2010`;

let previousDb = [];
try {
  previousDb = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));
} catch(e) {}

const colors = ['1a1a2e', '0f3460', 'e94560', '533483', '16213e', '395b64', '2c3639'];

const lines = rawData.split('\n').filter(line => line.trim() && !line.startsWith('Language'));

const newMovies = lines.map((line, index) => {
    const [language, genre, title, rating, year] = line.split(',');
    
    // Attempt to merge from previousDB to preserve cast/duration etc
    const existing = previousDb.find(m => m.title === title);
    
    if (existing) {
        return existing;
    }

    const color = colors[index % colors.length];
    
    // Instead of simple gradient, let's use loremflickr based on title/genre to give some realism
    // e.g. https://loremflickr.com/300/450/action,movie
    const imageUrl = `https://loremflickr.com/300/450/${encodeURIComponent(genre.toLowerCase())},movie?lock=${index}`;

    return {
        id: previousDb.length + index + 1,
        language,
        genre,
        title,
        rating: parseFloat(rating),
        year: parseInt(year),
        cast: ['Actor 1', 'Actor 2'], // default placeholder
        duration: '120 min',
        director: 'Unknown',
        platform: ['English'].includes(language) ? 'Netflix' : 'Amazon Prime',
        image: imageUrl
    };
});

// Avoid duplicates
const finalDbMap = new Map();
previousDb.forEach(m => finalDbMap.set(m.title, m));
newMovies.forEach(m => finalDbMap.set(m.title, m));

const finalDb = Array.from(finalDbMap.values());
// re-assign IDs to be safe
finalDb.forEach((m, i) => m.id = i + 1);

fs.writeFileSync('data/movies.json', JSON.stringify(finalDb, null, 2));
console.log('movies.json updated with new dataset and LoremFlickr images.');
