/**
  * Vuex Store Values:
  * totalNumberOfPosts: Total number of blog posts available from the API ["/"]
  * postsToShow: Array of blog posts to show on current page ["/"]
  * postCategories: All the available blog posts' categories ["/"]
  * currentPost: Current selected blog post ["/post/_slug"]
  */
export const state = () => ({
  totalNumberOfPosts: 0,
  postsToShow: [],
  postCategories: [],
  currentPost: {},
});

/**
 * Vuex store mutations:
 * 
 * SET_CATEGORIES: updates/mutates "postCategories" in state
 * SET_POSTS: updates/mutates "postsToShow" in state
 * SET_TOTAL_NUMBER_OF_POSTS: updates/mutates "totalNumberOfPosts" in state
 * SET_POST: updates/mutates "currentPost" in state
 */
export const mutations = {
  SET_CATEGORIES(state, categories) {
    state.postCategories = [...categories];
  },
  SET_POSTS(state, posts) {
    state.postsToShow = [...posts];
  },
  SET_TOTAL_NUMBER_OF_POSTS(state, totalNumberOfPosts) {
    state.totalNumberOfPosts = totalNumberOfPosts;
  },
  SET_POST(state, post) {
    state.currentPost = post;
  },
};

/**
 * Vuex store actions:
 * 
 * GET_CATEGORIES: Fetches blog posts' categories from API and calls SET_CATEGORIES mutation
 * GET_POSTS: Fetches blog posts from API and calls SET_CATEGORIES mutation
 * GET_POST_BY_SLUG: Fetches a blog post from API using blog post slug and calls SET_CATEGORIES mutation
 * RESET_POST_TO_DEFAULT: Resets "currentPost" to initial state by calling SET_POST mutation
 */
export const actions = {
  async GET_CATEGORIES({ commit }) {
    let res = await this.$axios('/categories');

    let categories = res.data.categories.map((category) => {
      let { ID, name, slug } = category;
      return { ID, name, slug };
    });

    commit("SET_CATEGORIES", categories);
  },
  async GET_POSTS({ commit }, { pageNumber, category }) {
    let endpoint = `/posts/?fields=ID,slug,categories,post_thumbnail,title,date&number=20&page=${pageNumber}`;

    if (category && category !== "all-categories") endpoint = `${endpoint}&category=${category}`;

    let res = await this.$axios(endpoint);

    commit("SET_TOTAL_NUMBER_OF_POSTS", res.data.found);
    commit("SET_POSTS", res.data.posts);
  },
  async GET_POST_BY_SLUG({ commit }, slug) {
    let res = await this.$axios(`/posts/slug:${slug}?fields=featured_image,title,author,content,date,slug`);
    commit("SET_POST", res.data);
  },
  RESET_POST_TO_DEFAULT({ commit }) {
    commit("SET_POST", {});
  }
}
