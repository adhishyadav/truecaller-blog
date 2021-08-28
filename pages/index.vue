<template>
  <div class="home-page">
    <div v-if="error" class="error-container">
      <p>Something went wrong!</p>
    </div>
    <div v-if="!error">
      <div class="home-page-banner">
        <p class="banner-title">The Truecaller Blog</p>
      </div>

      <div class="container home-container py-4">
        <div class="page-title">Latest articles</div>

        <!-- Blog post category dropdown -->
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

        <!-- Loading spinner when blog posts are being requested from the API -->
        <div v-if="arePostsLoading" class="home-page-loading-icon">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <!-- List of blog posts in card format when API returns the data successfully -->
        <div v-if="!arePostsLoading" class="row">
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

        <!-- Pagination component to navigate across more pages of blog posts' list -->
        <div class="post-pagination-container">
          <b-pagination
            class="post-pagination mt-3"
            v-model="currentPage"
            :total-rows="totalNumberOfPosts"
            :per-page="postsPerPage"
            first-number
            last-number
          />
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
     * totalPages: Total number of pages calculated as per the total number of blog posts
     * postsPerPage: Number of blog posts cards to display in one page
     * currentPage: Page number for pagination component
     * currentCategory: Current blog post category to show cards for
     * arePostsLoading: Flag to toggle loading spinner as per state of API call
     * error: error flag to be used when API calls fail
     */
    return {
      totalPages: 300,
      postsPerPage: 20,
      currentPage: null,
      currentCategory: "all-categories",
      arePostsLoading: true,
      error: null,
    };
  },
  head() {
    /**
     * title: Title for the current page of the application
     */
    return {
      title: "Truecaller Blog",
    };
  },
  async beforeMount() {
    try {
      this.currentPage = this.currentPageNumber;

      /** Fetch all the available categories of blog posts to populate categories dropdown options */
      await this.getCategories();

      /** Fetch posts for page 1 on first load of the webpage before mounting the UI */
      await this.getPosts({
        pageNumber: this.currentPageNumber,
      });

      /** Toggle loading flag off after completion of API call(s) */
      this.arePostsLoading = false;
    } catch (err) {
      this.error = err;
    }
  },
  methods: {
    /**
     * Vuex Actions:
     * getPosts or "GET_POSTS" - action to fetch posts from API & save it in store
     * getCategories or "GET_CATEGORIES" - action to fetch all the available blog posts' categories & save it in store
     */
    ...mapActions("posts", {
      getPosts: "GET_POSTS",
      getCategories: "GET_CATEGORIES",
      changePageNumber: "CHANGE_PAGE_NUMBER",
    }),

    /** Util function to display relevant category on blog post card based on current category selected */
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

    /**
     * Util function to get 'was published' copy for blog posts' cards
     * Output examples: "2 minutes ago", "1 week ago", "5 months ago"
     */
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
      /**
       * Blog post card click handler
       * Redirects to blog post's page using slug as unique identifier
       */
      this.$router.push(`/post/${slug}`);
    },
  },
  computed: {
    /**
     * Vuex Store Values:
     * totalNumberOfPosts: Total number of blog posts available from the API
     * postsToShow: Array of blog posts to show on current page
     * postCategories: All the available blog posts' categories
     */
    ...mapState("posts", [
      "totalNumberOfPosts",
      "postsToShow",
      "postCategories",
      "currentPageNumber",
    ]),
  },
  watch: {
    currentPage: {
      /**
       * Handler for value change of currentPage (Page number in pagination component)
       */
      async handler(pageNumber) {
        try {
          let category = null;

          this.changePageNumber(pageNumber);

          /**
           * Safety null check of currentCategory
           */
          if (
            this.currentCategory &&
            this.currentCategory !== "all-categories"
          ) {
            category = this.currentCategory;
          }

          /** Toggle loading on before initiating API call to fetch posts for particular page number */
          this.arePostsLoading = true;

          await this.getPosts({
            pageNumber: this.currentPageNumber,
            category,
          });

          /** Toggle loading off after completion of API call to fetch posts for particular page number */
          this.arePostsLoading = false;
        } catch (err) {
          this.error = err;
        }
      },
    },
    currentCategory: {
      /**
       * Handler for value change of currentCategory (Selected cactegory for blog posts in dropdown)
       */
      async handler(category) {
        try {
          if (this.currentPage === 1) {
            /**
             * If already at page 1, fetch posts for particular category for page 1
             */
            this.arePostsLoading = true;

            await this.getPosts({
              pageNumber: this.currentPageNumber,
              category,
            });

            this.arePostsLoading = false;
          } else {
            /**
             * Before fetching posts for new selected category, reset the page number to 1 if not already.
             * currentPage watcher makes the API call to get the posts for particular category
             */
            this.currentPage = 1;
          }
        } catch (err) {
          this.error = err;
        }
      },
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>