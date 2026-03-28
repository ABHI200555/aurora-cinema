const fs = require('fs');

const rawCsvData = `Language,Movie Type,Movie Name,Rating,Year,Image_URL
Telugu,Action,RRR,8.0,2022,https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg
Telugu,Drama,Baahubali: The Beginning,8.0,2015,https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg
Telugu,Action,Baahubali: The Conclusion,8.2,2017,https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_2_The_Conclusion_poster.jpg
Telugu,Action,Pushpa: The Rise,7.6,2021,https://upload.wikimedia.org/wikipedia/en/7/7b/Pushpa_-_The_Rise.jpg
Telugu,Drama,Jersey,8.5,2019,https://upload.wikimedia.org/wikipedia/en/2/2e/Jersey_2019_poster.jpg
Telugu,Romance,Geetha Govindam,7.7,2018,https://upload.wikimedia.org/wikipedia/en/5/5e/Geetha_Govindam_poster.jpg
Telugu,Fantasy,Eega,7.7,2012,https://upload.wikimedia.org/wikipedia/en/2/28/Eega_poster.jpg
Telugu,Action,Magadheera,7.7,2009,https://upload.wikimedia.org/wikipedia/en/1/1e/Magadheera_Poster.jpg
Telugu,Drama,Ala Vaikunthapurramuloo,7.3,2020,https://upload.wikimedia.org/wikipedia/en/5/59/Ala_Vaikunthapurramuloo.jpeg
Telugu,Thriller,HIT: The First Case,7.7,2020,https://upload.wikimedia.org/wikipedia/en/3/3c/HIT_The_First_Case.jpg
Telugu,Comedy,F2: Fun and Frustration,6.1,2019,https://upload.wikimedia.org/wikipedia/en/5/5f/F2_Fun_and_Frustration.jpg
Telugu,Action,Sarileru Neekevvaru,6.0,2020,https://upload.wikimedia.org/wikipedia/en/5/5d/Sarileru_Neekevvaru.jpg
Telugu,Action,Bharat Ane Nenu,7.5,2018,https://upload.wikimedia.org/wikipedia/en/2/2d/Bharat_Ane_Nenu.jpg
Telugu,Drama,Mahanati,8.4,2018,https://upload.wikimedia.org/wikipedia/en/2/2f/Mahanati.jpg
Telugu,Action,Arjun Reddy,8.1,2017,https://upload.wikimedia.org/wikipedia/en/4/46/Arjun_Reddy.jpg
Telugu,Comedy,Julayi,7.2,2012,https://upload.wikimedia.org/wikipedia/en/6/6c/Julayi.jpg
Telugu,Drama,Leader,8.0,2010,https://upload.wikimedia.org/wikipedia/en/9/9b/Leader_film.jpg
Telugu,Action,Dookudu,7.4,2011,https://upload.wikimedia.org/wikipedia/en/5/5b/Dookudu.jpg
Telugu,Fantasy,Anji,6.3,2004,https://upload.wikimedia.org/wikipedia/en/2/2a/Anji.jpg
Telugu,Thriller,Goodachari,7.9,2018,https://upload.wikimedia.org/wikipedia/en/3/3b/Goodachari.jpg
Hindi,Drama,3 Idiots,8.4,2009,https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg
Hindi,Drama,Dangal,8.3,2016,https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg
Hindi,Comedy,PK,8.1,2014,https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg
Hindi,Action,Pathaan,5.9,2023,https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg
Hindi,Thriller,Andhadhun,8.2,2018,https://upload.wikimedia.org/wikipedia/en/4/47/Andhadhun_poster.jpg
Hindi,Comedy,Hera Pheri,8.1,2000,https://upload.wikimedia.org/wikipedia/en/9/9a/Hera_Pheri_%282000_film%29_poster.jpg
Hindi,Thriller,Drishyam,8.2,2015,https://upload.wikimedia.org/wikipedia/en/8/8c/Drishyam_2015.jpg
Hindi,Romance,Dilwale Dulhania Le Jayenge,8.0,1995,https://upload.wikimedia.org/wikipedia/en/8/80/Dilwale_Dulhania_Le_Jayenge_poster.jpg
Hindi,Romance,Kabir Singh,7.0,2019,https://upload.wikimedia.org/wikipedia/en/d/dc/Kabir_Singh.jpg
Hindi,Drama,Zindagi Na Milegi Dobara,8.2,2011,https://upload.wikimedia.org/wikipedia/en/5/58/Zindagi_Na_Milegi_Dobara.jpg
Hindi,Action,War,6.5,2019,https://upload.wikimedia.org/wikipedia/en/6/6f/War_official_poster.jpg
Hindi,Drama,Gully Boy,7.9,2019,https://upload.wikimedia.org/wikipedia/en/0/07/Gully_Boy_poster.jpg
Hindi,Comedy,Munna Bhai M.B.B.S.,8.1,2003,https://upload.wikimedia.org/wikipedia/en/5/5b/Munnabhai_M.B.B.S.jpg
Hindi,Drama,Taare Zameen Par,8.4,2007,https://upload.wikimedia.org/wikipedia/en/b/b4/Taare_Zameen_Par_poster.jpg
Hindi,Thriller,Kahaani,8.1,2012,https://upload.wikimedia.org/wikipedia/en/6/6c/Kahaani_poster.jpg
Hindi,Action,Don,7.1,2006,https://upload.wikimedia.org/wikipedia/en/9/9c/Don_The_Chase_Begins_Again.jpg
Hindi,Comedy,Chup Chup Ke,6.9,2006,https://upload.wikimedia.org/wikipedia/en/3/3f/Chup_Chup_Ke.jpg
Hindi,Drama,Swades,8.2,2004,https://upload.wikimedia.org/wikipedia/en/1/1e/Swades_poster.jpg
Hindi,Romance,Veer-Zaara,7.8,2004,https://upload.wikimedia.org/wikipedia/en/5/5c/Veer-Zaara_poster.jpg
Hindi,Action,Sholay,8.1,1975,https://upload.wikimedia.org/wikipedia/en/5/52/Sholay-poster.jpg
English,Action,Avengers: Endgame,8.4,2019,https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg
English,Action,Avengers: Infinity War,8.4,2018,https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg
English,Romance,Titanic,7.9,1997,https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg
English,Thriller,Inception,8.8,2010,https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg
English,Sci-Fi,Interstellar,8.6,2014,https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg
English,Action,The Dark Knight,9.0,2008,https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg
English,Drama,The Shawshank Redemption,9.3,1994,https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg
English,Drama,Forrest Gump,8.8,1994,https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg
English,Action,Gladiator,8.5,2000,https://upload.wikimedia.org/wikipedia/en/8/8d/Gladiator_ver1.jpg
English,Drama,Joker,8.4,2019,https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg
English,Sci-Fi,The Matrix,8.7,1999,https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg
English,Adventure,Jurassic Park,8.1,1993,https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg
English,Animation,The Lion King,8.5,1994,https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg
English,Animation,Frozen,7.4,2013,https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg
English,Action,Spider-Man: No Way Home,8.2,2021,https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg
English,Fantasy,Harry Potter and the Sorcerer's Stone,7.6,2001,https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Sorcerer%27s_Stone.jpg
English,Crime,The Godfather,9.2,1972,https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg
English,Drama,Fight Club,8.8,1999,https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg
English,Crime,Pulp Fiction,8.9,1994,https://upload.wikimedia.org/wikipedia/en/8/82/Pulp_Fiction_cover.jpg
English,Horror,The Conjuring,7.5,2013,https://upload.wikimedia.org/wikipedia/en/1/1f/Conjuring_poster.jpg
Telugu,Action,Khaleja,7.6,2010,https://upload.wikimedia.org/wikipedia/en/4/4f/Khaleja_poster.jpg
Telugu,Drama,Rangasthalam,8.2,2018,https://upload.wikimedia.org/wikipedia/en/5/5f/Rangasthalam.jpg
Telugu,Action,Temper,7.4,2015,https://upload.wikimedia.org/wikipedia/en/8/8f/Temper_film.jpg
Telugu,Thriller,Kshanam,8.2,2016,https://upload.wikimedia.org/wikipedia/en/0/0c/Kshanam_poster.jpg
Telugu,Drama,C/o Kancharapalem,8.8,2018,https://upload.wikimedia.org/wikipedia/en/9/9c/C_o_Kancharapalem.jpg
Telugu,Romance,Pelli Choopulu,8.2,2016,https://upload.wikimedia.org/wikipedia/en/3/3b/Pelli_Choopulu.jpg
Telugu,Action,Sye,7.9,2004,https://upload.wikimedia.org/wikipedia/en/7/7e/Sye.jpg
Telugu,Comedy,Ready,7.3,2008,https://upload.wikimedia.org/wikipedia/en/5/59/Ready_film.jpg
Telugu,Drama,Oopiri,8.0,2016,https://upload.wikimedia.org/wikipedia/en/4/4d/Oopiri_poster.jpg
Telugu,Thriller,Agent Sai Srinivasa Athreya,8.4,2019,https://upload.wikimedia.org/wikipedia/en/0/0d/Agent_Sai_Srinivasa_Athreya.jpg
Telugu,Action,Simhadri,7.3,2003,https://upload.wikimedia.org/wikipedia/en/4/4b/Simhadri.jpg
Telugu,Drama,Nuvvu Naaku Nachav,8.7,2001,https://upload.wikimedia.org/wikipedia/en/0/0e/Nuvvu_Naaku_Nachav.jpg
Telugu,Romance,Tholi Prema,8.2,1998,https://upload.wikimedia.org/wikipedia/en/5/5c/Tholi_Prema.jpg
Telugu,Action,Indra,7.5,2002,https://upload.wikimedia.org/wikipedia/en/3/3f/Indra_film.jpg
Telugu,Comedy,King,7.2,2008,https://upload.wikimedia.org/wikipedia/en/7/7b/King_film.jpg
Telugu,Drama,Bommarillu,8.2,2006,https://upload.wikimedia.org/wikipedia/en/5/5f/Bommarillu.jpg
Telugu,Action,Chatrapathi,7.6,2005,https://upload.wikimedia.org/wikipedia/en/6/6e/Chatrapathi.jpg
Telugu,Thriller,Anukokunda Oka Roju,8.0,2005,https://upload.wikimedia.org/wikipedia/en/0/0d/Anukokunda_Oka_Roju.jpg
Telugu,Fantasy,Jagadeka Veerudu Athiloka Sundari,8.0,1990,https://upload.wikimedia.org/wikipedia/en/6/6a/Jagadeka_Veerudu_Athiloka_Sundari.jpg
Telugu,Drama,Sankarabharanam,8.9,1980,https://upload.wikimedia.org/wikipedia/en/9/9b/Sankarabharanam.jpg
Hindi,Drama,Lagaan,8.1,2001,https://upload.wikimedia.org/wikipedia/en/b/b6/Lagaan.jpg
Hindi,Drama,Barfi!,8.1,2012,https://upload.wikimedia.org/wikipedia/en/7/73/Barfi%21_poster.jpg
Hindi,Comedy,Welcome,7.0,2007,https://upload.wikimedia.org/wikipedia/en/3/3d/Welcome_poster.jpg
Hindi,Action,Ek Tha Tiger,5.7,2012,https://upload.wikimedia.org/wikipedia/en/4/4b/Ek_Tha_Tiger.jpg
Hindi,Thriller,Special 26,8.0,2013,https://upload.wikimedia.org/wikipedia/en/6/6f/Special_26.jpg
Hindi,Drama,Rang De Basanti,8.1,2006,https://upload.wikimedia.org/wikipedia/en/2/2e/Rang_De_Basanti.jpg
Hindi,Comedy,Housefull,5.4,2010,https://upload.wikimedia.org/wikipedia/en/7/7b/Housefull.jpg
Hindi,Drama,My Name Is Khan,7.9,2010,https://upload.wikimedia.org/wikipedia/en/5/5c/My_Name_Is_Khan.jpg
Hindi,Romance,Aashiqui 2,7.0,2013,https://upload.wikimedia.org/wikipedia/en/6/6a/Aashiqui_2.jpg
Hindi,Action,Singham,6.8,2011,https://upload.wikimedia.org/wikipedia/en/1/1e/Singham.jpg
Hindi,Thriller,Talaash,7.2,2012,https://upload.wikimedia.org/wikipedia/en/2/2c/Talaash_poster.jpg
Hindi,Comedy,De Dana Dan,5.6,2009,https://upload.wikimedia.org/wikipedia/en/3/3f/De_Dana_Dan.jpg
Hindi,Drama,Queen,8.2,2013,https://upload.wikimedia.org/wikipedia/en/1/1f/Queen_2014_poster.jpg
Hindi,Romance,Jab We Met,7.9,2007,https://upload.wikimedia.org/wikipedia/en/9/9f/Jab_We_Met.jpg
Hindi,Action,Krrish,6.4,2006,https://upload.wikimedia.org/wikipedia/en/0/0f/Krrish_poster.jpg
Hindi,Comedy,No Entry,6.6,2005,https://upload.wikimedia.org/wikipedia/en/5/5e/No_Entry.jpg
Hindi,Drama,Black,8.2,2005,https://upload.wikimedia.org/wikipedia/en/3/3c/Black_poster.jpg
Hindi,Romance,Hum Dil De Chuke Sanam,7.5,1999,https://upload.wikimedia.org/wikipedia/en/5/5f/Hum_Dil_De_Chuke_Sanam.jpg
Hindi,Action,Ghajini,7.3,2008,https://upload.wikimedia.org/wikipedia/en/9/9c/Ghajini.jpg
Hindi,Thriller,Raazi,7.8,2018,https://upload.wikimedia.org/wikipedia/en/0/0f/Raazi.jpg
English,Action,Iron Man,7.9,2008,https://upload.wikimedia.org/wikipedia/en/7/70/Iron_Man_2008_film.jpg
English,Action,Captain America: Civil War,7.8,2016,https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg
English,Action,Thor: Ragnarok,7.9,2017,https://upload.wikimedia.org/wikipedia/en/7/7d/Thor_Ragnarok_poster.jpg
English,Sci-Fi,Avatar,7.9,2009,https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg
English,Drama,The Green Mile,8.6,1999,https://upload.wikimedia.org/wikipedia/en/e/e2/The_Green_Mile.jpg
English,Crime,Se7en,8.6,1995,https://upload.wikimedia.org/wikipedia/en/6/68/Seven_%28movie%29_poster.jpg
English,Drama,Whiplash,8.5,2014,https://upload.wikimedia.org/wikipedia/en/0/01/Whiplash_poster.jpg
English,Thriller,The Silence of the Lambs,8.6,1991,https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg
English,Fantasy,The Lord of the Rings: The Fellowship of the Ring,8.8,2001,https://upload.wikimedia.org/wikipedia/en/8/87/Ringstrilogyposter.jpg
English,Fantasy,The Lord of the Rings: The Return of the King,9.0,2003,https://upload.wikimedia.org/wikipedia/en/4/48/Lord_Rings_Return_King.jpg
English,Animation,Toy Story,8.3,1995,https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg
English,Animation,Toy Story 3,8.3,2010,https://upload.wikimedia.org/wikipedia/en/1/1c/Toy_Story_3_poster.jpg
English,Adventure,Pirates of the Caribbean: The Curse of the Black Pearl,8.1,2003,https://upload.wikimedia.org/wikipedia/en/3/3e/Pirates_of_the_Caribbean_The_Curse_of_the_Black_Pearl.jpg
English,Action,Mad Max: Fury Road,8.1,2015,https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg
English,Sci-Fi,Blade Runner 2049,8.0,2017,https://upload.wikimedia.org/wikipedia/en/2/27/Blade_Runner_2049_poster.png
English,Drama,The Social Network,7.7,2010,https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.jpg
English,Crime,Django Unchained,8.4,2012,https://upload.wikimedia.org/wikipedia/en/8/8b/Django_Unchained_Poster.jpg
English,Drama,La La Land,8.0,2016,https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png
English,Horror,Get Out,7.7,2017,https://upload.wikimedia.org/wikipedia/en/a/a3/Get_Out_poster.png
English,Thriller,Shutter Island,8.2,2010,https://upload.wikimedia.org/wikipedia/en/7/76/Shutterislandposter.jpg`;

const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const lines = rawCsvData.split('\n').filter(line => line.trim() && !line.startsWith('Language'));

const imageMap = new Map();
lines.forEach(line => {
    // split by comma, image url is the last item
    const parts = line.split(',');
    if (parts.length >= 6) {
        const title = parts[2];
        const imageUrl = parts.slice(5).join(','); // in case url has commas
        imageMap.set(title.trim(), imageUrl.trim());
    }
});

let updatedCount = 0;
const newDb = db.map(movie => {
    if (imageMap.has(movie.title)) {
        movie.image = imageMap.get(movie.title);
        updatedCount++;
    }
    return movie;
});

fs.writeFileSync('./data/movies.json', JSON.stringify(newDb, null, 2));
console.log('Successfully completed mapping. ' + updatedCount + ' images added.');
