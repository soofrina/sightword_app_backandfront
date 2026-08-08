import { DifficultyLevel } from "@base/type/wordBank";

type DummyData = {
  id: number;
  wordFilter: string;
  difficulty: DifficultyLevel;
  sentence: string;
  lastEditedFilter: Date;
  lastReviewedFilter: Date;
  imagePath: string;
  audioPath: string;
};

export const dummyApiData: DummyData[] = [
  {
    id: 1,
    wordFilter: "Cats",
    difficulty: DifficultyLevel.Basic,
    sentence: "There are lots of cats in Instanbul 1",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.humanesociety.org/sites/default/files/2022-08/hl-yp-cats-579652.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    wordFilter: "Cats",
    difficulty: DifficultyLevel.Basic,
    sentence: "There are lots of cats in Instanbul 2",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_2x1.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    wordFilter: "Dogs",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 1",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    wordFilter: "Dogs",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 2",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://paradepets.com/.image/t_share/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    wordFilter: "Dogs",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 3",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-border-collie-play-mn-1100-82d2f1.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: 6,
    wordFilter: "Coffee",
    difficulty: DifficultyLevel.Basic,
    sentence: "Don't drink too much coffee",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://media.gq-magazine.co.uk/photos/5e8352568714920008e10d5b/master/pass/20200331-coffee-05.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: 7,
    wordFilter: "Lizard",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Lizards eat insects",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://post.healthline.com/wp-content/uploads/2021/06/lizard-iguana-1200x628-facebook.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: 8,
    wordFilter: "Elephant",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Elephants are afraid of mice",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://i.natgeofe.com/k/78b20329-9758-42c3-baa4-10c613dd2820/baby-african-elephant_3x2.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: 9,
    wordFilter: "Happy",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Don't be sad, be happy",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath: "https://bradaronson.com/wp-content/uploads/2013/10/happy.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    id: 10,
    wordFilter: "Squirrel",
    sentence: "Stop chasing squirrels 1",
    difficulty: DifficultyLevel.Advanced,
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.woodlandtrust.org.uk/media/1291/grey-squirrel-eating-nuts-alamykp50jm-sandra-standbridge.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
  {
    id: 11,
    wordFilter: "Squirrel",
    sentence: "Stop chasing squirrels 2",
    difficulty: DifficultyLevel.Advanced,
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.wildlifetrusts.org/sites/default/files/styles/spotlight_default/public/2017-12/Red%20Squirrel%20%28c%29%20Mark%20Hamblin%202020VISION.jpg?h=95d3fb78&itok=j_KTd5Xf",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  },
  {
    id: 12,
    wordFilter: "Cats2",
    difficulty: DifficultyLevel.Basic,
    sentence: "There are lots of cats in Instanbul 1",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.humanesociety.org/sites/default/files/2022-08/hl-yp-cats-579652.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
  {
    id: 13,
    wordFilter: "Cats2",
    difficulty: DifficultyLevel.Basic,
    sentence: "There are lots of cats in Instanbul 2",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_2x1.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },
  {
    id: 14,
    wordFilter: "Dogs2",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 1",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  },
  {
    id: 15,
    wordFilter: "Dogs2",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 2",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://paradepets.com/.image/t_share/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  },
  {
    id: 16,
    wordFilter: "Dogs2",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 3",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-border-collie-play-mn-1100-82d2f1.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 17,
    wordFilter: "Coffee2",
    difficulty: DifficultyLevel.Basic,
    sentence: "Don't drink too much coffee",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://media.gq-magazine.co.uk/photos/5e8352568714920008e10d5b/master/pass/20200331-coffee-05.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 18,
    wordFilter: "Lizard2",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Lizards eat insects",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://post.healthline.com/wp-content/uploads/2021/06/lizard-iguana-1200x628-facebook.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 19,
    wordFilter: "Elephant2",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Elephants are afraid of mice",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://i.natgeofe.com/k/78b20329-9758-42c3-baa4-10c613dd2820/baby-african-elephant_3x2.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 20,
    wordFilter: "Happy2",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Don't be sad, be happy",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath: "https://bradaronson.com/wp-content/uploads/2013/10/happy.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 21,
    wordFilter: "Squirrel2",
    sentence: "Stop chasing squirrels 1",
    difficulty: DifficultyLevel.Advanced,
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.woodlandtrust.org.uk/media/1291/grey-squirrel-eating-nuts-alamykp50jm-sandra-standbridge.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 22,
    wordFilter: "Squirrel2",
    sentence: "Stop chasing squirrels 2",
    difficulty: DifficultyLevel.Advanced,
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.wildlifetrusts.org/sites/default/files/styles/spotlight_default/public/2017-12/Red%20Squirrel%20%28c%29%20Mark%20Hamblin%202020VISION.jpg?h=95d3fb78&itok=j_KTd5Xf",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 23,
    wordFilter: "Cats3",
    difficulty: DifficultyLevel.Basic,
    sentence: "There are lots of cats in Instanbul 1",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.humanesociety.org/sites/default/files/2022-08/hl-yp-cats-579652.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 24,
    wordFilter: "Cats3",
    difficulty: DifficultyLevel.Basic,
    sentence: "There are lots of cats in Instanbul 2",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_2x1.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 25,
    wordFilter: "Dogs3",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 1",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 26,
    wordFilter: "Dogs3",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 2",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://paradepets.com/.image/t_share/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 27,
    wordFilter: "Dogs3",
    difficulty: DifficultyLevel.Basic,
    sentence: "Dogs hate cats 3",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-border-collie-play-mn-1100-82d2f1.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 28,
    wordFilter: "Coffee3",
    difficulty: DifficultyLevel.Basic,
    sentence: "Don't drink too much coffee",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://media.gq-magazine.co.uk/photos/5e8352568714920008e10d5b/master/pass/20200331-coffee-05.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 29,
    wordFilter: "Lizard3",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Lizards eat insects",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://post.healthline.com/wp-content/uploads/2021/06/lizard-iguana-1200x628-facebook.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 30,
    wordFilter: "Elephant3",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Elephants are afraid of mice",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://i.natgeofe.com/k/78b20329-9758-42c3-baa4-10c613dd2820/baby-african-elephant_3x2.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 31,
    wordFilter: "Happy3",
    difficulty: DifficultyLevel.Intermediate,
    sentence: "Don't be sad, be happy",
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath: "https://bradaronson.com/wp-content/uploads/2013/10/happy.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 32,
    wordFilter: "Squirrel3",
    sentence: "Stop chasing squirrels 1",
    difficulty: DifficultyLevel.Advanced,
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.woodlandtrust.org.uk/media/1291/grey-squirrel-eating-nuts-alamykp50jm-sandra-standbridge.jpg",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 33,
    wordFilter: "Squirrel3",
    sentence: "Stop chasing squirrels 2",
    difficulty: DifficultyLevel.Advanced,
    lastEditedFilter: new Date(),
    lastReviewedFilter: new Date(),
    imagePath:
      "https://www.wildlifetrusts.org/sites/default/files/styles/spotlight_default/public/2017-12/Red%20Squirrel%20%28c%29%20Mark%20Hamblin%202020VISION.jpg?h=95d3fb78&itok=j_KTd5Xf",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
];
