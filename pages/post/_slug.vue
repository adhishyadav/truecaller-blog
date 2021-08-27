<template>
  <div class="post-page">
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
          <p>
            {{ getAuthorName(currentPost.author) }}
          </p>
          <p>
            <small class="text-muted">{{
              getPostPublishedAt(currentPost.date, "absolute")
            }}</small>
          </p>
        </div>
      </div>
      <div v-html="currentPost.content" class="post-content"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {};
  },
  async beforeMount() {
    await this.getPostBySlug(this.$route.path.split("/")[2]);
    console.log({ currentPost: this.currentPost });
  },
  methods: {
    ...mapActions("posts", {
      getPostBySlug: "GET_POST_BY_SLUG",
    }),
    getPostPublishedAt(postDate, type) {
      if (type === "absolute") {
        let dateString = new Date(postDate).toDateString();
        let [, month, date, year] = dateString.split(" ");
        return `${month} ${date}, ${year}`;
      }
    },
    getAuthorName(author) {
      let name = "";

      if (author) {
        let { first_name, last_name } = author;
        if (first_name) name = name + first_name + " ";
        if (last_name) name = name + last_name;
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
.post-page {
  background-color: #f4f7f9;
  min-height: calc(100vh - 60px);
  max-width: 100vw;
  .app-banner {
    padding-top: 80px;
    img {
      height: 90vh;
      width: 100%;
      object-fit: cover;
      object-position: 0 0;

      @media only screen and (max-width: 992px) {
        height: 70vh;
      }

      @media only screen and (max-width: 576px) {
        height: 50vh;
      }
    }
  }

  .post-container {
    .post-title {
      font-size: 4rem;
      font-weight: bold;

      @media only screen and (max-width: 576px) {
        font-size: 2.5rem;
      }
    }
    .post-author-details {
      margin: 2rem 0;
      display: flex;
      align-items: center;
      .author-avatar {
        height: 4rem;
        width: 4rem;
        background-color: #000000;
        border-radius: 40px;
      }
      .author-details {
        margin-left: 1rem;
        p {
          margin: 0;
        }
      }
    }
    .post-content {
      * {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
