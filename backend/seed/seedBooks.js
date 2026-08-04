const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Book = require('../models/Book');
const User = require('../models/User');

const generateRandomPrice = () => (Math.floor(Math.random() * 60) + 15) * 10 - 1; 
const generateRandomRating = () => Number((Math.random() * 1.2 + 3.8).toFixed(1));
const generateRandomReviews = () => Math.floor(Math.random() * 800) + 50;
const generateRandomStock = () => Math.floor(Math.random() * 150) + 10;

const imageMap = {
  "1984": "https://covers.openlibrary.org/b/id/9267242-M.jpg",
  "Harry Potter and the Philosopher's Stone": "https://covers.openlibrary.org/b/id/15155833-M.jpg",
  "The Great Gatsby": "https://covers.openlibrary.org/b/id/10590366-M.jpg",
  "To Kill a Mockingbird": "https://covers.openlibrary.org/b/id/14351077-M.jpg",
  "Pride and Prejudice": "https://covers.openlibrary.org/b/id/14348537-M.jpg",
  "The Catcher in the Rye": "https://covers.openlibrary.org/b/id/9273490-M.jpg",
  "The Hobbit": "https://covers.openlibrary.org/b/id/14627509-M.jpg",
  "Fahrenheit 451": "https://covers.openlibrary.org/b/id/12993656-M.jpg",
  "Jane Eyre": "https://covers.openlibrary.org/b/id/8235363-M.jpg",
  "The Lord of the Rings": "https://covers.openlibrary.org/b/id/14625765-M.jpg",
  "Animal Farm": "https://covers.openlibrary.org/b/id/11261770-M.jpg",
  "Brave New World": "https://covers.openlibrary.org/b/id/8231823-M.jpg",
  "The Alchemist": "https://covers.openlibrary.org/b/id/7414780-M.jpg",
  "The Picture of Dorian Gray": "https://covers.openlibrary.org/b/id/14314858-M.jpg",
  "Frankenstein": "https://covers.openlibrary.org/b/id/12356249-M.jpg",
  "Indian Polity for Civil Services": "https://covers.openlibrary.org/b/id/11412890-M.jpg",
  "India's Struggle for Independence": "https://m.media-amazon.com/images/I/71zq8SU7JkS._AC_UF1000,1000_QL80_.jpg",
  "Indian Economy": "https://covers.openlibrary.org/b/id/13234225-M.jpg",
  "Certificate Physical and Human Geography": "https://covers.openlibrary.org/b/id/13295168-M.jpg",
  "A Brief History of Modern India": "https://covers.openlibrary.org/b/id/10880864-M.jpg",
  "Environment for Civil Services": "https://m.media-amazon.com/images/I/91grKRpk1RL._AC_UF1000,1000_QL80_.jpg",
  "Ethics, Integrity & Aptitude": "https://covers.openlibrary.org/b/id/10283022-M.jpg",
  "Lexicon for Ethics, Integrity & Aptitude": "https://covers.openlibrary.org/b/id/10283022-M.jpg",
  "India Since Independence": "https://covers.openlibrary.org/b/id/8456591-M.jpg",
  "Geography of India": "https://m.media-amazon.com/images/I/81FI0jwPjuL.jpg",
  "Challenges to Internal Security": "https://covers.openlibrary.org/b/id/2350008-M.jpg",
  "International Relations": "https://covers.openlibrary.org/b/id/2382993-M.jpg",
  "Indian Art and Culture": "https://covers.openlibrary.org/b/id/10872710-M.jpg",
  "General Science for Civil Services": "https://covers.openlibrary.org/b/id/11248037-M.jpg",
  "Essay Paper for UPSC": "https://placehold.co/400x600/1e293b/f59e0b?text=Essay%20Paper%20for%20UPSC&font=Playfair+Display",
  "A Brief History of Time": "https://covers.openlibrary.org/b/id/10432365-M.jpg",
  "The Elegant Universe": "https://covers.openlibrary.org/b/id/1007630-M.jpg",
  "Six Easy Pieces": "https://covers.openlibrary.org/b/id/134755-M.jpg",
  "Cosmos": "https://covers.openlibrary.org/b/id/8283901-M.jpg",
  "The Feynman Lectures on Physics": "https://covers.openlibrary.org/b/id/582109-M.jpg",
  "Astrophysics for People in a Hurry": "https://covers.openlibrary.org/b/id/7984709-M.jpg",
  "QED: The Strange Theory": "https://covers.openlibrary.org/b/id/442317-M.jpg",
  "The Fabric of the Cosmos": "https://covers.openlibrary.org/b/id/6650337-M.jpg",
  "Relativity: The Special and General Theory": "https://covers.openlibrary.org/b/id/10478466-M.jpg",
  "Hyperspace": "https://covers.openlibrary.org/b/id/240877-M.jpg",
  "Black Holes and Baby Universes": "https://covers.openlibrary.org/b/id/6474185-M.jpg",
  "The First Three Minutes": "https://covers.openlibrary.org/b/id/298540-M.jpg",
  "Quantum: Einstein, Bohr": "https://covers.openlibrary.org/b/id/10987353-M.jpg",
  "Seven Brief Lessons on Physics": "https://covers.openlibrary.org/b/id/7398110-M.jpg",
  "Fundamentals of Physics": "https://covers.openlibrary.org/b/id/1246724-M.jpg",
  "The Joy of x": "https://covers.openlibrary.org/b/id/9266506-M.jpg",
  "Fermat's Enigma": "https://covers.openlibrary.org/b/id/885225-M.jpg",
  "Gödel, Escher, Bach": "https://covers.openlibrary.org/b/id/14368453-M.jpg",
  "How Not to Be Wrong": "https://covers.openlibrary.org/b/id/9930581-M.jpg",
  "The Man Who Knew Infinity": "https://covers.openlibrary.org/b/id/408314-M.jpg",
  "Flatland": "https://covers.openlibrary.org/b/id/10069547-M.jpg",
  "Zero: The Biography of a Dangerous Idea": "https://covers.openlibrary.org/b/id/9321912-M.jpg",
  "Prime Obsession": "https://covers.openlibrary.org/b/id/10667247-M.jpg",
  "Calculus Made Easy": "https://covers.openlibrary.org/b/id/173276-M.jpg",
  "The Signal and the Noise": "https://covers.openlibrary.org/b/id/7256893-M.jpg",
  "Journey Through Genius": "https://covers.openlibrary.org/b/id/95842-M.jpg",
  "A Mathematician's Apology": "https://covers.openlibrary.org/b/id/9753744-M.jpg",
  "Infinity and the Mind": "https://covers.openlibrary.org/b/id/9283906-M.jpg",
  "Mathematics: Its Content, Methods": "https://covers.openlibrary.org/b/id/7391009-M.jpg",
  "The Code Book": "https://covers.openlibrary.org/b/id/8231826-M.jpg",
  "Aesop's Fables": "https://covers.openlibrary.org/b/id/3043711-M.jpg",
  "Grimm's Fairy Tales": "https://covers.openlibrary.org/b/id/8236293-M.jpg",
  "The Arabian Nights": "https://covers.openlibrary.org/b/id/11716374-M.jpg",
  "Alice's Adventures in Wonderland": "https://covers.openlibrary.org/b/id/10527843-M.jpg",
  "Peter Pan": "https://covers.openlibrary.org/b/id/8237052-M.jpg",
  "The Little Prince": "https://covers.openlibrary.org/b/id/10708272-M.jpg",
  "Winnie-the-Pooh": "https://covers.openlibrary.org/b/id/8610816-M.jpg",
  "The Wind in the Willows": "https://covers.openlibrary.org/b/id/13335427-M.jpg",
  "The Jungle Book": "https://covers.openlibrary.org/b/id/3344204-M.jpg",
  "Treasure Island": "https://covers.openlibrary.org/b/id/13859660-M.jpg",
  "The Secret Garden": "https://covers.openlibrary.org/b/id/12622062-M.jpg",
  "Charlotte's Web": "https://m.media-amazon.com/images/I/91B3luFcjwL._AC_UF1000,1000_QL80_.jpg",
  "Matilda": "https://covers.openlibrary.org/b/id/12889769-M.jpg",
  "Charlie and the Chocolate Factory": "https://covers.openlibrary.org/b/id/12459564-M.jpg",
  "Where the Wild Things Are": "https://covers.openlibrary.org/b/id/50842-M.jpg",
  "Dune": "https://covers.openlibrary.org/b/id/6976407-M.jpg",
  "The Hitchhiker's Guide to the Galaxy": "https://covers.openlibrary.org/b/id/12986869-M.jpg",
  "Neuromancer": "https://covers.openlibrary.org/b/id/283860-M.jpg",
  "Foundation": "https://covers.openlibrary.org/b/id/14612610-M.jpg",
  "Snow Crash": "https://covers.openlibrary.org/b/id/392508-M.jpg",
  "The Martian": "https://covers.openlibrary.org/b/id/11447888-M.jpg",
  "Hyperion": "https://covers.openlibrary.org/b/id/380332-M.jpg",
  "Ender's Game": "https://covers.openlibrary.org/b/id/12996033-M.jpg",
  "The Left Hand of Darkness": "https://covers.openlibrary.org/b/id/10618463-M.jpg",
  "Do Androids Dream of Electric Sheep?": "https://covers.openlibrary.org/b/id/207515-M.jpg",
  "The Time Machine": "https://covers.openlibrary.org/b/id/9009316-M.jpg",
  "War of the Worlds": "https://covers.openlibrary.org/b/id/36314-M.jpg",
  "I, Robot": "https://covers.openlibrary.org/b/id/12385229-M.jpg",
  "Stranger in a Strange Land": "https://covers.openlibrary.org/b/id/14630668-M.jpg",
  "The Three-Body Problem": "https://covers.openlibrary.org/b/id/9157544-M.jpg",
  "The Shining": "https://covers.openlibrary.org/b/id/12376585-M.jpg",
  "It": "https://m.media-amazon.com/images/I/714uW6RhR6L.jpg",
  "The Silence of the Lambs": "https://covers.openlibrary.org/b/id/8580475-M.jpg",
  "Gone Girl": "https://covers.openlibrary.org/b/id/8368314-M.jpg",
  "The Girl with the Dragon Tattoo": "https://covers.openlibrary.org/b/id/9274740-M.jpg",
  "Dracula": "https://covers.openlibrary.org/b/id/12216503-M.jpg",
  "The Exorcist": "https://covers.openlibrary.org/b/id/12715730-M.jpg",
  "The Da Vinci Code": "https://covers.openlibrary.org/b/id/9255229-M.jpg",
  "And Then There Were None": "https://covers.openlibrary.org/b/id/11172296-M.jpg",
  "Psycho": "https://covers.openlibrary.org/b/id/8401686-M.jpg",
  "Atomic Habits": "https://m.media-amazon.com/images/I/81bGKUa1e0L.jpg",
  "The Subtle Art of Not Giving a F*ck": "https://m.media-amazon.com/images/I/71t4GuxLCuL.jpg"
};

const bookData = {
  'Fiction': [
    { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", desc: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat." },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", desc: "A novel of the Jazz Age on Long Island." },
    { title: "To Kill a Mockingbird", author: "Harper Lee", desc: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice." },
    { title: "1984", author: "George Orwell", desc: "A dystopian social science fiction novel and cautionary tale." },
    { title: "Pride and Prejudice", author: "Jane Austen", desc: "An 1813 romantic novel of manners." },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", desc: "A classic novel of teenage rebellion and alienation." },
    { title: "The Hobbit", author: "J.R.R. Tolkien", desc: "A children's fantasy novel about Bilbo Baggins." },
    { title: "Fahrenheit 451", author: "Ray Bradbury", desc: "A dystopian novel presenting a future American society where books are outlawed." },
    { title: "Jane Eyre", author: "Charlotte Brontë", desc: "A novel that follows the experiences of its eponymous heroine." },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", desc: "An epic high fantasy novel." },
    { title: "Animal Farm", author: "George Orwell", desc: "A beast fable, in form of satirical allegorical novella." },
    { title: "Brave New World", author: "Aldous Huxley", desc: "A dystopian novel set in a futuristic World State." },
    { title: "The Alchemist", author: "Paulo Coelho", desc: "A novel about an Andalusian shepherd boy." },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", desc: "A philosophical novel about vanity and morality." },
    { title: "Frankenstein", author: "Mary Shelley", desc: "A novel that tells the story of Victor Frankenstein." }
  ],
  'UPSC': [
    { title: "Indian Polity for Civil Services", author: "M. Laxmikanth", desc: "The most recommended book for Indian Polity preparation." },
    { title: "India's Struggle for Independence", author: "Bipan Chandra", desc: "A detailed overview of the Indian independence movement." },
    { title: "Indian Economy", author: "Ramesh Singh", desc: "A comprehensive manual on the Indian Economy." },
    { title: "Certificate Physical and Human Geography", author: "G.C. Leong", desc: "Essential reading for Geography." },
    { title: "A Brief History of Modern India", author: "Rajiv Ahir", desc: "Modern history notes by Spectrum." },
    { title: "Environment for Civil Services", author: "Shankar IAS", desc: "Complete guide on ecology and environment." },
    { title: "Ethics, Integrity & Aptitude", author: "G. Subba Rao", desc: "A detailed book covering GS Paper 4." },
    { title: "Lexicon for Ethics, Integrity & Aptitude", author: "Niraj Kumar", desc: "A concise vocabulary and concept book for Ethics." },
    { title: "India Since Independence", author: "Bipan Chandra", desc: "Post-independence history of India." },
    { title: "Geography of India", author: "Majid Husain", desc: "Detailed Indian geography." },
    { title: "Challenges to Internal Security", author: "Ashok Kumar", desc: "Security challenges in India." },
    { title: "International Relations", author: "Pavneet Singh", desc: "Guide for IR section." },
    { title: "Indian Art and Culture", author: "Nitin Singhania", desc: "Comprehensive guide to Indian culture." },
    { title: "General Science for Civil Services", author: "Tara Chand", desc: "Science and technology guide." },
    { title: "Essay Paper for UPSC", author: "Mrunal Patel", desc: "Techniques for writing effective essays." }
  ],
  'Physics': [
    { title: "A Brief History of Time", author: "Stephen Hawking", desc: "An exploration of cosmology for the general reader." },
    { title: "The Elegant Universe", author: "Brian Greene", desc: "String theory and the quest for the ultimate theory." },
    { title: "Six Easy Pieces", author: "Richard P. Feynman", desc: "Essentials of physics explained by its most brilliant teacher." },
    { title: "Cosmos", author: "Carl Sagan", desc: "A fascinating journey through the universe." },
    { title: "The Feynman Lectures on Physics", author: "Richard P. Feynman", desc: "The definitive physics textbook." },
    { title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", desc: "A quick, accessible guide to the universe." },
    { title: "QED: The Strange Theory", author: "Richard P. Feynman", desc: "Quantum electrodynamics explained." },
    { title: "The Fabric of the Cosmos", author: "Brian Greene", desc: "Space, time, and the texture of reality." },
    { title: "Relativity: The Special and General Theory", author: "Albert Einstein", desc: "Einstein's own explanation of his theories." },
    { title: "Hyperspace", author: "Michio Kaku", desc: "A scientific odyssey through parallel universes." },
    { title: "Black Holes and Baby Universes", author: "Stephen Hawking", desc: "Essays and lectures by the famous physicist." },
    { title: "The First Three Minutes", author: "Steven Weinberg", desc: "A modern view of the origin of the universe." },
    { title: "Quantum: Einstein, Bohr", author: "Manjit Kumar", desc: "The great debate about the nature of reality." },
    { title: "Seven Brief Lessons on Physics", author: "Carlo Rovelli", desc: "A short, joyful introduction to physics." },
    { title: "Fundamentals of Physics", author: "David Halliday", desc: "The classic university textbook." }
  ],
  'Mathematics': [
    { title: "The Joy of x", author: "Steven Strogatz", desc: "A guided tour of math, from one to infinity." },
    { title: "Fermat's Enigma", author: "Simon Singh", desc: "The epic quest to solve the world's greatest mathematical problem." },
    { title: "Gödel, Escher, Bach", author: "Douglas Hofstadter", desc: "An eternal golden braid of mathematics, art, and music." },
    { title: "How Not to Be Wrong", author: "Jordan Ellenberg", desc: "The power of mathematical thinking." },
    { title: "The Man Who Knew Infinity", author: "Robert Kanigel", desc: "A life of the genius Ramanujan." },
    { title: "Flatland", author: "Edwin A. Abbott", desc: "A romance of many dimensions." },
    { title: "Zero: The Biography of a Dangerous Idea", author: "Charles Seife", desc: "The story of the number zero." },
    { title: "Prime Obsession", author: "John Derbyshire", desc: "Bernhard Riemann and the greatest unsolved problem." },
    { title: "Calculus Made Easy", author: "Silvanus P. Thompson", desc: "A very simple introduction to calculus." },
    { title: "The Signal and the Noise", author: "Nate Silver", desc: "Why so many predictions fail." },
    { title: "Journey Through Genius", author: "William Dunham", desc: "The great theorems of mathematics." },
    { title: "A Mathematician's Apology", author: "G.H. Hardy", desc: "A defense of the pursuit of pure mathematics." },
    { title: "Infinity and the Mind", author: "Rudy Rucker", desc: "The science and philosophy of the infinite." },
    { title: "Mathematics: Its Content, Methods", author: "A.D. Aleksandrov", desc: "A comprehensive overview of mathematics." },
    { title: "The Code Book", author: "Simon Singh", desc: "The science of secrecy from ancient Egypt to quantum cryptography." }
  ],
  'Story': [
    { title: "Aesop's Fables", author: "Aesop", desc: "A collection of fables credited to Aesop." },
    { title: "Grimm's Fairy Tales", author: "Brothers Grimm", desc: "Classic folk tales collected by the Brothers Grimm." },
    { title: "The Arabian Nights", author: "Unknown", desc: "One thousand and one nights of storytelling." },
    { title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", desc: "A fantastical tale of a girl who falls down a rabbit hole." },
    { title: "Peter Pan", author: "J.M. Barrie", desc: "The boy who wouldn't grow up." },
    { title: "The Little Prince", author: "Antoine de Saint-Exupéry", desc: "A poetic tale about a young prince." },
    { title: "Winnie-the-Pooh", author: "A.A. Milne", desc: "Stories about a bear named Pooh." },
    { title: "The Wind in the Willows", author: "Kenneth Grahame", desc: "A classic of children's literature." },
    { title: "The Jungle Book", author: "Rudyard Kipling", desc: "Stories of Mowgli and the animals." },
    { title: "Treasure Island", author: "Robert Louis Stevenson", desc: "A tale of buccaneers and buried gold." },
    { title: "The Secret Garden", author: "Frances Hodgson Burnett", desc: "A story of a neglected girl who finds a hidden garden." },
    { title: "Charlotte's Web", author: "E.B. White", desc: "A novel about a pig named Wilbur and his friend Charlotte." },
    { title: "Matilda", author: "Roald Dahl", desc: "A story of a brilliant girl with telekinetic powers." },
    { title: "Charlie and the Chocolate Factory", author: "Roald Dahl", desc: "The adventures of young Charlie Bucket." },
    { title: "Where the Wild Things Are", author: "Maurice Sendak", desc: "A classic children's picture book." }
  ],
  'Novels': [
    { title: "Dune", author: "Frank Herbert", desc: "A science fiction epic set on the desert planet Arrakis." },
    { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", desc: "A comedy science fiction series." },
    { title: "Neuromancer", author: "William Gibson", desc: "The seminal cyberpunk novel." },
    { title: "Foundation", author: "Isaac Asimov", desc: "The classic sci-fi series." },
    { title: "Snow Crash", author: "Neal Stephenson", desc: "A post-cyberpunk classic." },
    { title: "The Martian", author: "Andy Weir", desc: "A story of survival on Mars." },
    { title: "Hyperion", author: "Dan Simmons", desc: "A Hugo Award-winning science fiction novel." },
    { title: "Ender's Game", author: "Orson Scott Card", desc: "A military science fiction novel." },
    { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", desc: "A landmark work of feminist science fiction." },
    { title: "Do Androids Dream of Electric Sheep?", author: "Philip K. Dick", desc: "The basis for Blade Runner." },
    { title: "The Time Machine", author: "H.G. Wells", desc: "The classic time travel novel." },
    { title: "War of the Worlds", author: "H.G. Wells", desc: "The classic alien invasion story." },
    { title: "I, Robot", author: "Isaac Asimov", desc: "A collection of robot short stories." },
    { title: "Stranger in a Strange Land", author: "Robert A. Heinlein", desc: "A story of a human raised on Mars." },
    { title: "The Three-Body Problem", author: "Cixin Liu", desc: "A Chinese science fiction masterpiece." }
  ],
  'Horror & Thriller': [
    { title: "The Shining", author: "Stephen King", desc: "A psychological horror novel set in an isolated hotel." },
    { title: "It", author: "Stephen King", desc: "A terrifying story of a shape-shifting entity." },
    { title: "The Silence of the Lambs", author: "Thomas Harris", desc: "A psychological thriller featuring Dr. Hannibal Lecter." },
    { title: "Gone Girl", author: "Gillian Flynn", desc: "A thriller novel about a marriage gone terribly wrong." },
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", desc: "A gripping mystery thriller." },
    { title: "Dracula", author: "Bram Stoker", desc: "The classic vampire horror novel." },
    { title: "The Exorcist", author: "William Peter Blatty", desc: "A novel about the demonic possession of a young girl." },
    { title: "The Da Vinci Code", author: "Dan Brown", desc: "A mystery thriller that shook the world." },
    { title: "And Then There Were None", author: "Agatha Christie", desc: "The world's best-selling mystery novel." },
    { title: "Psycho", author: "Robert Bloch", desc: "The classic psychological thriller." }
  ],
  'Self-Help': [
    { title: "Atomic Habits", author: "James Clear", desc: "An easy and proven way to build good habits and break bad ones." },
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", desc: "A counterintuitive approach to living a good life." }
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Prevent accidental deletion of user-added books
    // await Book.deleteMany({});
    // console.log('Cleared existing books');

    let generatedBooks = [];

    for (const category of Object.keys(bookData)) {
      for (const book of bookData[category]) {
        const originalUrl = imageMap[book.title] || 'https://covers.openlibrary.org/b/id/14348537-M.jpg';
        const imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`;
        
        generatedBooks.push({
          title: book.title,
          author: book.author,
          description: book.desc,
          category: category,
          price: generateRandomPrice(),
          stock: generateRandomStock(),
          image: imageUrl,
          rating: generateRandomRating(),
          numReviews: generateRandomReviews()
        });
      }
    }

    const books = await Book.insertMany(generatedBooks);
    console.log(`\nInserted ${books.length} sample books with authentic ISBN book cover images!`);

    const adminExists = await User.findOne({ email: 'admin@bookverse.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@bookverse.com',
        password: 'admin1234',
        role: 'admin'
      });
      console.log('Created admin user (admin@bookverse.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
