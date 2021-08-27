<template>
  <div class="home-page">
    <div class="home-page-banner">
      <p class="banner-title">The Truecaller Blog</p>
    </div>
    <div class="container home-container py-4">
      <div class="page-title">Latest articles</div>
      <select
        class="post-category-selector mt-1 mb-4 mb-sm-3 px-4 py-3"
        name="categories"
        id="post-categories"
        v-model="currentCategory"
      >
        <option value="all-categories">All categories</option>
        <option
          v-for="category in postCategories"
          :key="category.ID"
          :value="category.slug"
        >
          {{ category.name }}
        </option>
      </select>
      <div class="row">
        <div
          class="blog-post col-sm-12 col-xs-12 col-md-4 col-lg-3 col-xl-3"
          v-for="post in postsToShow"
          :key="post.ID"
        >
          <div class="post-card" @click="redirectToPost(post.slug)">
            <div class="post-card-header">
              <span class="category-bullet"></span>
              {{ getPostCategory(post) }}
            </div>
            <img
              class="post-card-img"
              :src="
                post.post_thumbnail
                  ? post.post_thumbnail.URL
                  : '~/assets/images/truecaller.svg'
              "
              alt="post.post_thumbnail.ID"
              loading="eager"
            />
            <h5 class="post-card-title">{{ post.title }}</h5>
            <p class="post-card-age m-0">
              <small class="text-muted">{{
                getPostPublishedAt(post.date)
              }}</small>
            </p>
          </div>
        </div>
      </div>
      <div class="post-pagination">
        <div class="mt-3">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalNumberOfPosts"
            :per-page="postsPerPage"
            first-number
            last-number
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      totalPages: 300,
      postsPerPage: 20,
      currentPage: 1,
      currentCategory: "all-categories",
    };
  },
  async beforeMount() {
    await this.getCategories();
    await this.getPosts({
      pageNumber: 1,
    });
  },
  methods: {
    ...mapActions("posts", {
      getPosts: "GET_POSTS",
      getCategories: "GET_CATEGORIES",
      getPostBySlug: "GET_POST_BY_SLUG",
    }),
    getPostCategory(post) {
      let currentCategoryObj = {
        isCurrentCategory: null,
        categoryName: "",
      };

      for (const category in post.categories) {
        if (post.categories[category].slug === this.currentCategory) {
          currentCategoryObj = {
            isCurrentCategory: true,
            categoryName: post.categories[category].name,
          };
        }
      }

      if (
        this.currentCategory &&
        this.currentCategory !== "all-categories" &&
        currentCategoryObj.isCurrentCategory
      ) {
        return currentCategoryObj.categoryName;
      } else if (this.currentCategory) {
        return Object.keys(post.categories)[0];
      }
    },
    getPostPublishedAt(timestamp) {
      let currentTimestamp = new Date();
      let postTimestamp = new Date(timestamp);

      if (currentTimestamp.getFullYear() === postTimestamp.getFullYear()) {
        if (currentTimestamp.getMonth() === postTimestamp.getMonth()) {
          if (currentTimestamp.getDate() === postTimestamp.getDate()) {
            if (currentTimestamp.getHours() === postTimestamp.getHours()) {
              let minutesDiff =
                currentTimestamp.getMinutes() - postTimestamp.getMinutes();
              return `${minutesDiff} ${
                minutesDiff <= 1 ? "minute" : "minutes"
              } ago`;
            } else {
              let hoursDiff =
                currentTimestamp.getHours() - postTimestamp.getHours();
              return `${hoursDiff} ${hoursDiff <= 1 ? "hour" : "hours"} ago`;
            }
          } else {
            let daysDiff = currentTimestamp.getDate() - postTimestamp.getDate();
            if (daysDiff >= 7 && daysDiff < 14) return "1 week ago";
            else if (daysDiff >= 14 && daysDiff < 21) return "2 weeks ago";
            else if (daysDiff >= 21) return "3 weeks ago";
            else return `${daysDiff} ${daysDiff <= 1 ? "day" : "days"} ago`;
          }
        } else {
          let monthsDiff =
            currentTimestamp.getMonth() - postTimestamp.getMonth();
          return `${monthsDiff} ${monthsDiff <= 1 ? "month" : "months"} ago`;
        }
      } else {
        let yearsDiff =
          currentTimestamp.getFullYear() - postTimestamp.getFullYear();
        return `${yearsDiff} ${yearsDiff <= 1 ? "year" : "years"} ago`;
      }
    },
    redirectToPost(slug) {
      this.$router.push(`/post/${slug}`);
    },
  },
  computed: {
    ...mapState("posts", [
      "totalNumberOfPosts",
      "postsToShow",
      "postCategories",
      "currentPost",
    ]),
  },
  watch: {
    currentPage: {
      async handler(pageNumber) {
        let category = null;

        if (this.currentCategory && this.currentCategory !== "all-categories") {
          category = this.currentCategory;
        }

        await this.getPosts({
          pageNumber,
          category,
        });
      },
    },
    currentCategory: {
      async handler(category) {
        if (this.currentPage === 1) {
          await this.getPosts({
            pageNumber: 1,
            category,
          });
        }

        this.currentPage = 1;
      },
    },
  },
};
</script>

<style lang="scss">
.home-page {
  background-color: #f4f7f9;
  min-height: calc(100vh - 60px - 0.5rem);
  .home-page-banner {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("~/assets/images/header.jpg");
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;

    @media only screen and (max-width: 992px) {
      height: 70vh;
      background-position-y: 80px;
    }

    @media only screen and (max-width: 576px) {
      height: 60vh;
      background-position-y: 80px;
    }

    .banner-title {
      font-size: 4rem;
      font-family: sans-serif;
      font-weight: bold;
      color: #ffffff;
      position: relative;
      top: 40px;
      text-align: center;
      padding: 0 1rem;

      @media only screen and (max-width: 576px) {
        font-size: 2rem;
      }
    }
  }
  .home-container {
    .page-title {
      font-size: 5rem;
      font-weight: bold;

      @media only screen and (max-width: 576px) {
        font-size: 2.5rem;
      }
    }
    .post-category-selector {
      width: 300px;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      border: none;
      @media only screen and (max-width: 576px) {
        width: 100%;
      }
    }
    .blog-post {
      padding-top: 15px;
      padding-bottom: 15px;
      .post-card {
        background-color: #ffffff;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        cursor: pointer;
        .post-card-header {
          padding: 1.5rem;
          font-weight: bold;
          .category-bullet {
            display: inline-block;
            height: 10px;
            width: 10px;
            border-radius: 10px;
            background-color: #45a896;
            margin-right: 0.4rem;
          }
        }
        .post-card-img {
          width: 100%;
          height: 150px;
          @media only screen and (max-width: 576px) {
            height: 200px;
          }
        }
        .post-card-title {
          margin: 1.5rem 1.5rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-word;
          font-weight: bold;
          line-height: 1.5rem;
          height: 3rem;
        }
        .post-card-age {
          padding: 0.5rem 1.5rem 1.5rem;
        }
      }
    }
    .post-pagination {
      display: flex;
      justify-content: center;
      .pagination {
        .page-item {
          background-color: none;
          .page-link {
            border-radius: 20px;
            margin: 0 20px;
            background: none;
            border: none;
            @media only screen and (max-width: 576px) {
              margin: 0 2px;
            }
          }
        }
        .active {
          background-color: #007bff;
          border: #007bff;
          border-radius: 30px;
        }
      }
    }
  }
}
</style>