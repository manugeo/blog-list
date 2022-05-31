const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs = []) => {
  return blogs.reduce((totalLikes, blog) => blog?.likes ? (blog.likes + totalLikes) : totalLikes, 0);
};

const favoriteBlog = (blogs = []) => {
  return blogs.reduce((a, b) => ((a.likes > b.likes) ? a : b));
}

module.exports = { dummy, totalLikes, favoriteBlog };