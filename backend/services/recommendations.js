import Item from '../models/Item.js';

const MAJOR_COURSES = {
  'Computer Science': ['CS101', 'CS201', 'CS301', 'CS401', 'MA101', 'PH101'],
  'Information Technology': ['IT101', 'IT201', 'IT301', 'CN201', 'DB201'],
  'Electronics': ['EC101', 'EC201', 'EC301', 'EE101'],
  'Mechanical': ['ME101', 'ME201', 'ME301', 'TH101'],
  'Civil': ['CE101', 'CE201', 'CE301', 'SM101'],
};

const SEMESTER_BOOST = {
  1: ['101'],
  2: ['102', '201'],
  3: ['201', '301'],
  4: ['301', '401'],
  5: ['401', '501'],
  6: ['501', '601'],
  7: ['601', '701'],
  8: ['701', '801'],
};

export async function getRecommendations(user) {
  const courses = MAJOR_COURSES[user.major] || [];
  const boosts = SEMESTER_BOOST[user.semester] || [];

  const query = {
    status: 'available',
    type: { $in: ['book', 'note', 'question_paper'] },
  };

  if (courses.length) {
    query.$or = [
      { courseCode: { $in: courses } },
      { tags: { $in: courses } },
    ];
  }

  const items = await Item.find(query)
    .populate('seller', 'name rating isVerified')
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return items
    .map((item) => {
      let score = 0;
      if (courses.includes(item.courseCode)) score += 3;
      if (boosts.some((b) => item.courseCode?.includes(b))) score += 2;
      if (item.type === 'book') score += 1;
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
