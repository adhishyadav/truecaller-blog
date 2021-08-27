<template>
  <div class="post-page">
    <div v-if="isPostLoading" class="post-page-loading-icon">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-if="!isPostLoading">
      <div class="app-banner">
        <img :src="currentPost.featured_image" :alt="currentPost.slug" />
      </div>
      <div class="container post-container py-4">
        <div class="post-title">{{ currentPost.title }}</div>
        <div class="post-author-details">
          <img
            class="author-avatar"
            :src="currentPost.author ? currentPost.author.avatar_URL : ''"
            :alt="currentPost.author ? currentPost.author.nice_name : ''"
          />
          <div class="author-details">
            <a :href="currentPost.author ? currentPost.author.profile_URL : ''">
              <p>
                {{ getAuthorName(currentPost.author) }}
              </p>
            </a>
            <p>
              <small class="text-muted">{{ getDate(currentPost.date) }}</small>
            </p>
          </div>
        </div>
        <div v-html="currentPost.content" class="post-content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      isPostLoading: true,
    };
  },
  head() {
    return {
      title: this.currentPost.title,
    };
  },
  async beforeMount() {
    await this.getPostBySlug(this.$route.path.split("/")[2]);
    this.isPostLoading = false;
  },
  async destroyed() {
    this.resetPostToDefault();
  },
  methods: {
    ...mapActions("posts", {
      getPostBySlug: "GET_POST_BY_SLUG",
      resetPostToDefault: "RESET_POST_TO_DEFAULT",
    }),
    getDate(postDate) {
      let dateString = new Date(postDate).toDateString();
      let [, month, date, year] = dateString.split(" ");
      return `${month} ${date}, ${year}`;
    },
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
    ...mapState("posts", ["currentPost"]),
  },
};
</script>

<style lang="scss">
@import "./_slug.scss";
</style>
