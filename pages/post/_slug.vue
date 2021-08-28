<template>
  <div class="post-page">
    <div v-if="error" class="error-container">
      <p>Something went wrong!</p>
    </div>
    <div v-if="!error">
      <!-- Loading spinner when blog post is being requested from the API -->
      <div v-if="isPostLoading" class="post-page-loading-icon">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-if="!isPostLoading">
        <!-- Blog post's banner -->
        <div class="post-banner">
          <div v-if="!currentPost.featured_image">Post banner not found!</div>
          <img v-else :src="currentPost.featured_image" :alt="currentPost.slug" />
        </div>
        <!-- Blog post's content -->
        <div class="container post-container py-4">
          <div class="post-title">{{ currentPost.title }}</div>
          <div class="post-author-details">
            <img
              class="author-avatar"
              :src="currentPost.author ? currentPost.author.avatar_URL : ''"
              :alt="currentPost.author ? currentPost.author.nice_name : ''"
            />
            <div class="author-details">
              <a
                :href="currentPost.author ? currentPost.author.profile_URL : ''"
              >
                <p>
                  {{ getAuthorName(currentPost.author) }}
                </p>
              </a>
              <p>
                <small class="text-muted">{{
                  getDate(currentPost.date)
                }}</small>
              </p>
            </div>
          </div>
          <!-- Blog post's content body -->
          <div v-html="currentPost.content" class="post-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    /**
     * error: error flag to be used when API calls fail
     * isPostLoading: Flag to toggle loading spinner as per state of API call
     */
    return {
      error: null,
      isPostLoading: true,
    };
  },
  head() {
    /**
     * title: Title for the current page of the application
     */
    return {
      title: this.currentPost.title,
    };
  },
  async beforeMount() {
    try {
      /** Fetch blog post using post slug passed as path param before mounting the UI */
      await this.getPostBySlug(this.$route.path.split("/")[2]);

      /** Toggle loading flag off after completion of API call(s) */
      this.isPostLoading = false;
    } catch (err) {
      this.error = err;
    }
  },
  async destroyed() {
    /**
     * Resets store value of currentPost too initial state
     */
    this.resetPostToDefault();
  },
  methods: {
    /**
     * Vuex Actions:
     * getPostBySlug or "GET_POST_BY_SLUG" - action to fetch a blog post from API using post slug & save it in store
     * resetPostToDefault or "RESET_POST_TO_DEFAULT" - action to reset currentPost to initial state in store
     */
    ...mapActions("posts", {
      getPostBySlug: "GET_POST_BY_SLUG",
      resetPostToDefault: "RESET_POST_TO_DEFAULT",
    }),
    /**
     * Util funution to get date string for blog post
     * Output examples: "May 11, 2021", "Jan 24, 1998"
     */
    getDate(postDate) {
      let dateString = new Date(postDate).toDateString();
      let [, month, date, year] = dateString.split(" ");
      return `${month} ${date}, ${year}`;
    },

    /**
     * Util function to get and return author's full name using post's author object
     */
    getAuthorName(author) {
      let name = "";

      if (author) {
        let { first_name, last_name } = author;
        if (first_name) name = name + first_name + " ";
        if (last_name) name = name + last_name;
        if (!first_name && !last_name) name = "Unnamed author";
      } else {
        name = "Unnamed author";
      }

      return name;
    },
  },
  computed: {
    /**
     * Vuex Store Values:
     * currentPost: Current blog post selected
     */
    ...mapState("posts", ["currentPost"]),
  },
};
</script>

<style lang="scss">
@import "./_slug.scss";
</style>
