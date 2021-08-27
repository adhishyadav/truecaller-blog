export const state = () => ({
  totalNumberOfPosts: 0,
  postsToShow: [],
  postCategories: [],
  currentPost: {},
});

export const getters = {

};

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
}
