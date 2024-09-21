package config

import (
	"fmt"
	//"time"

	"github.com/tanapon395/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {

	// AutoMigrate สำหรับทุก entity
	err := db.AutoMigrate(
		&entity.Gender{},
		&entity.Member{},
		&entity.Movie{},
		&entity.Theater{},
		&entity.ShowTimes{},
		&entity.Seat{},     // สร้างหลัง Theater เพราะมี foreign key เชื่อมโยง
		&entity.Booking{},  // สร้างหลังจากที่ Member และ Movie ถูกสร้างแล้ว
		&entity.BookSeat{}, // สร้างหลังจาก Seat และ Booking
		&entity.Payment{},
		&entity.Ticket{}, // สร้างหลังจาก BookSeat และ Booking
		&entity.Reward{},
		&entity.CodeReward{},
		&entity.TicketCheck{},
	)
	if err != nil {
		fmt.Println("Error in AutoMigrate:", err)
	} else {
		fmt.Println("AutoMigrate completed successfully.")
	}

	// สร้างข้อมูลเพศ
	GenderMale := entity.Gender{Name: "Male"}
	GenderFemale := entity.Gender{Name: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Name: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Name: "Female"})


	// สร้างข้อมูลสตาฟ 
	hashedPasswordStaff, _ := HashPassword("123456")
	Member4 := &entity.Member{
		UserName:   "sastaff",
		FirstName:  "Softwarestaff",
		LastName:   "Analysisstaff",
		Email:      "sastaff@gmail.com",
		Password:   hashedPasswordStaff,
		GenderID:   GenderMale.ID,
		TotalPoint: 10,
		Role:       "staff",
	}
	db.FirstOrCreate(Member4, &entity.Member{
		Email: "sastaff@gmail.com",
	})
	
	// สร้างข้อมูลสมาชิกคนที่หนึ่ง (saadmin@gmail.com)
	hashedPassword, _ := HashPassword("123456")
	Member1 := &entity.Member{
		UserName:   "saadmin",
		FirstName:  "Software1",
		LastName:   "Analysis1",
		Email:      "saadmin@gmail.com",
		Password:   hashedPassword,
		GenderID:   GenderMale.ID,
		TotalPoint: 10000,
		Role:       "admin",
	}
	db.FirstOrCreate(Member1, &entity.Member{
		Email: "saadmin@gmail.com",
	})

	// สร้างข้อมูลสมาชิกคนที่สอง (sa2@gmail.com)
	hashedPassword2, _ := HashPassword("123456")
	Member2 := &entity.Member{
		UserName:   "sa2",
		FirstName:  "Software2",
		LastName:   "Analysis2",
		Email:      "sa2@gmail.com",
		Password:   hashedPassword2,
		GenderID:   GenderMale.ID,
		TotalPoint: 1000,
		Role:       "user",
	}
	db.FirstOrCreate(Member2, &entity.Member{
		Email: "sa2@gmail.com",
	})

	hashedPassword3, _ := HashPassword("123456") // แฮชรหัสผ่านใหม่ที่ต้องการ
	Member3 := &entity.Member{
		UserName:   "sa3",
		FirstName:  "Software3",
		LastName:   "Analysis3",
		Email:      "sa3@gmail.com",
		Password:   hashedPassword3, // บันทึกรหัสผ่านที่แฮชแล้ว
		GenderID:   GenderMale.ID,
		TotalPoint: 8,
		Role:       "user",
	}
	db.FirstOrCreate(Member3, &entity.Member{
		Email: "sa3@gmail.com",
	})

	// สร้างข้อมูลภาพยนตร์ 3 เรื่อง
	// Populate movies data
	movies := []entity.Movie{
		{MovieName: "Avengers: Endgame", MovieType: "Action", MovieDuration: 181, Director: "Anthony Russo, Joe Russo", Actor: "Robert Downey Jr., Chris Evans, Mark Ruffalo", Synopsis: "...", },
		{MovieName: "Avatar", MovieType: "Action", MovieDuration: 162, Director: "James Cameron", Actor: "Sam Worthington, Zoe Saldana", Synopsis: `In the distant future, paraplegic Marine Jake Sully is sent to the lush moon Pandora, home to the indigenous Na'vi people. Sully becomes part of the Avatar Program, which allows him to control a genetically engineered Na'vi body. As he infiltrates the Na'vi to gather intelligence for the human colonists, he develops deep connections with the tribe and falls in love with Neytiri. Torn between his human allegiance and his new Na'vi family, Jake must decide where his true loyalty lies. The movie is a visually stunning journey into a world of nature and spirituality.
`, },
		{MovieName: "Dead Night", MovieType: "Horror", MovieDuration: 86, Director: "Brad Baruh", Actor: "Brea Grant, AJ Bowen", Synopsis: `A family on a peaceful weekend getaway finds their retreat quickly turning into a nightmare when they encounter a mysterious woman in the woods. What begins as a night of strange occurrences escalates into a terrifying fight for survival as dark supernatural forces are unleashed. The mother, Casey, must uncover the truth behind the evil that surrounds them, and the night turns into a desperate struggle to protect her children. As the body count rises, Casey learns there are darker forces at play that have their sights set on her family.
`, },
		{MovieName: "Inception", MovieType: "Sci-Fi", MovieDuration: 148, Director: "Christopher Nolan", Actor: "Leonardo DiCaprio, Joseph Gordon-Levitt", Synopsis: `Dom Cobb is a highly skilled thief specializing in stealing secrets from deep within the subconscious during dreams. His rare ability has made him valuable in the world of corporate espionage, but it has also cost him everything he loves. Cobb is offered a chance at redemption when he is tasked with planting an idea rather than stealing one — an "inception." As he assembles a team to carry out the mission, they navigate through layers of dreams, each more complex than the last. But Cobb’s own buried memories threaten the success of the operation.
`, },
		{MovieName: "Interstellar", MovieType: "Sci-Fi", MovieDuration: 169, Director: "Christopher Nolan", Actor: "Matthew McConaughey, Anne Hathaway", Synopsis: `In a dystopian future where Earth’s resources are rapidly depleting, former NASA pilot Cooper is recruited for a daring mission to find a new home for humanity. A mysterious wormhole offers a chance to travel to distant galaxies and potentially discover planets suitable for life. As Cooper and his team journey into the unknown, they must face the challenges of time dilation, black holes, and the emotional toll of leaving behind their loved ones. Interstellar explores the boundaries of human endurance, the power of love, and the unknown dimensions of time and space.
`, },
		{MovieName: "Minions", MovieType: "Comedy", MovieDuration: 91, Director: "Pierre Coffin, Kyle Balda", Actor: "Sandra Bullock, Jon Hamm", Synopsis: `The Minions, small yellow creatures who have existed since the dawn of time, seek a master to serve. After numerous failed attempts to follow villainous leaders throughout history, they find themselves aimless and lost. Three brave Minions — Kevin, Stuart, and Bob — set out on a journey to find a new master. Their quest leads them to Scarlet Overkill, the world’s first female supervillain. As they embark on a chaotic adventure, the Minions learn valuable lessons about friendship, loyalty, and what it truly means to serve a leader.
`, },
		{MovieName: "Titanic", MovieType: "Drama", MovieDuration: 195, Director: "James Cameron", Actor: "Leonardo DiCaprio, Kate Winslet", Synopsis: `Titanic tells the tragic love story of Jack Dawson and Rose DeWitt Bukater, who meet aboard the ill-fated RMS Titanic. Jack, a penniless artist, and Rose, a wealthy young woman trapped in an engagement to a controlling fiancé, fall in love despite the class divide. As their romance blossoms, the Titanic strikes an iceberg, leading to one of the deadliest maritime disasters in history. Rose and Jack must fight for survival as the ship sinks, with their love and bravery tested in the face of tragedy.`, },

		{MovieName: "The Matrix", MovieType: "Action", MovieDuration: 136, Director: "Lana Wachowski, Lilly Wachowski", Actor: "Keanu Reeves, Laurence Fishburne", Synopsis: `Thomas Anderson, a computer hacker known by his alias Neo, discovers that the world he lives in is an elaborate simulation created by machines to subdue humanity. As he is awakened to the truth by a mysterious figure named Morpheus, Neo learns that he is "The One," a prophesied savior who must lead a rebellion against the machines. Along with fellow rebels, Neo embarks on a mission to free humanity from their virtual prison. The Matrix is a mind-bending exploration of reality, technology, and human freedom.
`, },
		{MovieName: "Ready Player One", MovieType: "Adventure", MovieDuration: 140, Director: "Steven Spielberg", Actor: "Tye Sheridan", Synopsis: `In a dystopian future where people seek solace in the virtual reality world called the OASIS, a young man named Wade Watts discovers clues to a hidden fortune left by the OASIS's creator. As he embarks on a treasure hunt, he faces powerful adversaries, both inside and outside the OASIS, and must use all his skills and knowledge of 80s pop culture to win the ultimate prize and save the OASIS from falling into the wrong hands.`, },

		{MovieName: "Good Dinosaur", MovieType: "Adventure", MovieDuration: 93, Director: "Peter Sohn", Actor: "Raymond Ochoa (voice)", Synopsis: `In a world where dinosaurs never went extinct, a young Apatosaurus named Arlo forms an unlikely friendship with a human boy named Spot. After a tragic event, Arlo finds himself far from home and must embark on a journey through a treacherous landscape to reunite with his family. Along the way, Arlo learns valuable lessons about courage, friendship, and self-discovery, all while overcoming his fears and embracing his true potential.`, },

		{MovieName: "Fury", MovieType: "War", MovieDuration: 134, Director: "David Ayer", Actor: "Brad Pitt", Synopsis: `Set during the final days of World War II, Fury follows a battle-hardened tank crew led by Sergeant Don "Wardaddy" Collier. As they push deep into Nazi Germany, they face overwhelming odds and must make difficult choices to survive. The film explores the brutality of war and the bonds of brotherhood formed in the heat of battle as the crew navigates the horrors of war from inside their Sherman tank named Fury.`, },

		{MovieName: "The Croods", MovieType: "Adventure", MovieDuration: 98, Director: "Kirk DeMicco, Chris Sanders", Actor: "Nicolas Cage (voice)", Synopsis: `The Croods, a prehistoric family led by the cautious and overprotective Grug, live in a cave and follow strict rules to survive in their dangerous world. However, when their home is destroyed, they are forced to embark on a journey into the unknown. Along the way, they meet a more evolved and inventive human named Guy, who introduces them to new ideas and challenges Grug's way of thinking. Together, they must learn to adapt and work as a team to survive in a rapidly changing world.`, },

		{MovieName: "The Super Mario Bros. Movie", MovieType: "Comedy", MovieDuration: 92, Director: "Aaron Horvath, Michael Jelenic", Actor: "Chris Pratt (voice)", Synopsis: `Based on the popular video game franchise, The Super Mario Bros. Movie follows the adventures of Mario and Luigi, two plumbers who find themselves transported to a magical kingdom under siege by the evil King Bowser. With the help of Princess Peach and their new friends, Mario and Luigi must navigate a series of challenges, battle enemies, and use their unique skills to save the kingdom from Bowser's clutches and bring peace to the land.`, },

		{MovieName: "Spider-Man: No Way Home", MovieType: "Action", MovieDuration: 148, Director: "Jon Watts", Actor: "Tom Holland", Synopsis: `After his secret identity as Spider-Man is revealed to the world, Peter Parker turns to Doctor Strange for help in restoring his anonymity. However, when a spell goes wrong, it opens the multiverse and brings forth dangerous villains from other dimensions who have faced off against different versions of Spider-Man. Peter must join forces with other Spider-Men from alternate realities to stop the villains and protect his loved ones, all while learning what it truly means to be Spider-Man.`, },

		{MovieName: "Doctor Strange in the Multiverse of Madness", MovieType: "Action", MovieDuration: 120, Director: "Sam Raimi", Actor: "Benedict Cumberbatch", Synopsis: `In this mind-bending Marvel adventure, Doctor Stephen Strange explores the multiverse, encountering alternate realities and powerful enemies that threaten to unravel the very fabric of existence. Teaming up with new allies, including the young hero America Chavez, Strange must navigate a dangerous journey through parallel worlds and confront the dark forces that seek to exploit the multiverse's infinite possibilities. As he battles to save reality itself, Strange faces his greatest challenge yet: confronting his own demons and the consequences of his choices.`, },

		{MovieName: "Aquaman", MovieType: "Action", MovieDuration: 143, Director: "James Wan", Actor: "Jason Momoa", Synopsis: `Arthur Curry, a half-human, half-Atlantean, is born to be the rightful ruler of the underwater kingdom of Atlantis. However, he must first prove his worth and overcome his insecurities. As Aquaman, Arthur must prevent a war between the surface world and Atlantis, led by his half-brother Orm. Alongside Mera, his love interest, and Vulko, his mentor, Arthur embarks on a quest to find the legendary Trident of Atlan, the key to uniting the seven seas and reclaiming his throne.`, },

		{MovieName: "Transformers: Rise of the Beasts", MovieType: "War", MovieDuration: 117, Director: "Steven Caple Jr.", Actor: "Anthony Ramos", Synopsis: `Set in the 1990s, Transformers: Rise of the Beasts introduces a new faction of Transformers known as the Maximals, who join the Autobots in their battle against the Decepticons. The story follows Noah, an ex-military electronics expert, and Elena, an artifact researcher, as they become embroiled in the war between the two factions. Together with Optimus Prime and the other Transformers, they must stop the rise of the powerful and malevolent Unicron, who threatens to destroy Earth and all life in the universe.`, },

		{MovieName: "World War Z", MovieType: "War", MovieDuration: 116, Director: "Marc Forster", Actor: "Brad Pitt", Synopsis: `Gerry Lane, a former United Nations investigator, is thrust into a global crisis when a mysterious virus outbreak turns people into fast-moving zombies. As the infection spreads rapidly across the globe, Gerry is tasked with finding the source of the pandemic and uncovering a way to stop it before humanity is wiped out. His journey takes him to various countries, where he encounters both the horrors of the outbreak and the resilience of the human spirit. In a race against time, Gerry must use his skills and resourcefulness to save his family and find a cure.`, },

		{MovieName: "Star Wars: The Last Jedi", MovieType: "War", MovieDuration: 152, Director: "Rian Johnson", Actor: "Mark Hamill", Synopsis: `In the continuing saga of the Skywalker family, Rey seeks out the reclusive Luke Skywalker to train her in the ways of the Force. Meanwhile, the Resistance, led by General Leia Organa, faces off against the First Order, led by Supreme Leader Snoke and his apprentice Kylo Ren. As Rey uncovers the secrets of her past and learns more about the Force, she must decide her destiny and the fate of the galaxy. The film explores themes of legacy, sacrifice, and the balance between light and dark.`, },

		{MovieName: "Greyhound", MovieType: "War", MovieDuration: 104, Director: "Jonh sena", Actor: "Tom Hanks", Synopsis: `Greyhound takes place in 1942, shortly after the United States entered World War II in the Battle of the Atlantic, where a fleet of 37 Allied ships led by Lieutenant Commander Ernest Krause (played by Tom Hanks) sails in the North Atlantic Ocean and is being pursued by German U-boats.

In addition to having to face the enemy of Germany, the Allied fleet also had many problems, such as ineffective communication and a lack of air force protection for more than 5 days. In addition, there was also a fierce enemy, nature, and having to face the madness of the sea.

The Battle of the Atlantic was one of the largest and longest naval battles of World War II. The Atlantic was very important to the Allies because this water was a route for transporting millions of tons of supplies and goods to the British Isles, while the Germans were well aware that England had a pipeline from America and Canada. It was therefore necessary to blockade the island and its waters with the infamous U-boat fleet... Read the original news at: https://www.silpa-mag.com/news/article_46680`, },

		{MovieName: "The Dark Knight", MovieType: "Action", MovieDuration: 152, Director: "Christopher Nolan", Actor: "Christian Bale, Heath Ledger", Synopsis: `When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.`, },
	}


	for i := range movies {
		if err := db.FirstOrCreate(&movies[i], entity.Movie{MovieName: movies[i].MovieName}).Error; err != nil {
			fmt.Printf("Error creating movie: %s\n", err)
		}
	}

	// สร้างข้อมูลโรงหนัง 3 โรง
	theaters := []entity.Theater{
		{TheaterName: "Theater 1"},
		{TheaterName: "Theater 2"},
		{TheaterName: "Theater 3"},
	}

	for i := range theaters {
		if err := db.FirstOrCreate(&theaters[i], entity.Theater{TheaterName: theaters[i].TheaterName}).Error; err != nil {
			fmt.Printf("Error creating theater: %s\n", err)
		}
	}

	// สร้างที่นั่งสำหรับแต่ละโรงหนัง
	seatNumbers := []string{}
	for row := 'A'; row <= 'H'; row++ {
		for num := 1; num <= 20; num++ {
			seatNumber := fmt.Sprintf("%c%d", row, num)
			seatNumbers = append(seatNumbers, seatNumber)
		}
	}

	for _, theater := range theaters {
		for _, seatNo := range seatNumbers {
			seat := entity.Seat{
				SeatNo:    seatNo,
				Status:    "Available",
				TheaterID: &theater.ID,
			}
			if err := db.FirstOrCreate(&seat, &entity.Seat{SeatNo: seatNo, TheaterID: &theater.ID}).Error; err != nil {
				fmt.Printf("Error creating seat: %s\n", err)
				fmt.Println(err)
			}
		}
	}


	

	fmt.Println("Database setup complete")
}
