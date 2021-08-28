# Truecaller Blog

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Code base overview

### Routes (Refer "/pages" directory)

- "/" - Landing Page of the application where blog posts are listed in card form.
- "/post/\_slug" - Post can be viewed on this page, post is fetched from API using post's slug passed as path parameter.

### Vuex store (Refer "/store" directory)

- posts - State for post(s) entity in the application.

### Styles & assets (Refer "/assets" directory)

- css - Includes scss files for colors (colors.scss) & other styles (main.scss).
- images - Includes asset files like landing page banner image, header svg, etc.

## Brief explanation of solution

Flow of operations in vuex store

Component -> Action -> Mutation -> State

- On "/" page, action is called to fetch first 20 posts & all the categories and save it in vuex store.
- If API call to fetch posts or categories fail, "Something went wrong" error is displayed to the user.
- If API calls are successful, "postsToShow" & "postCategories" from state are used to populate the landing page
- Individual posts are displayed are displayed as a card to the user, when clicking any post card, the user is redirected to "/post/\_slug" page,

- On "/post/\_slug" page, \_slug is passed to action to fetch the relevant post & save it in vuex store.
- If API call to fetch the post fail, "Something went wrong" error is displayed to the user.
- If API call is successful, "currentPost" from state is used to populate the landing page

<!-- ## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store). -->
