export const studentRoutes = {
  base: "/",
  words: "/words",
  lessonDetails: "/lesson-details",
  classWords: "/class-words",
  settings: "/settings",
  lessonLearningJourney: "/journey/:lessonId",
  wordLearningJourney: "/journey/word/:wordId/:lessonWordId",
  logout: "/logout",
};

export const staffRoutes = {
  base: "/staff",
  class: "/staff/class",
  organisation: "/staff/organisation",
  wordBank: "/staff/word-bank",
  settings: "/staff/settings",
  logout: "/staff/logout",
  test: "/staff/test",
  viewClass: "/staff/class/view",
};

export const viewClassPageParameters = {
  overview: "page=Overview",
  students: "page=Students",
  teachers: "page=Teachers",
  lessonPlans: "page=Lessons",
};
