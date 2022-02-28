/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
      props: {
        pagetype: "open",
      },
      meta: {
        pageTitle: "Open",
        breadcrumb: [
          {
            text: "Open",
            active: true,
          },
        ],
      },
    },
    {
      path: "/c",
      name: "second-page",
      component: () => import("@/views/Home.vue"),
      meta: {
        pageTitle: "Close",
        props: {
          pagetype: "closed",
        },
        breadcrumb: [
          {
            text: "Close",
            active: true,
          },
        ],
      },
    },
    {
      path: "/order/:id",
      name: "order",
      meta: {
        pageTitle: "ItemList",
        breadcrumb: [
          {
            text: "ItemList",
            active: true,
          },
        ],
      },
      component: () => import("@/views/ItemList.vue"),
    },
    {
      path: "/items-reports/:id",
      name: "items-reports",
      meta: {
        pageTitle: "ItemList",
        breadcrumb: [
          {
            text: "ItemList",
            active: true,
          },
        ],
      },
      component: () => import("@/views/ItemsReports.vue"),
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("@/views/Login.vue"),
    //   meta: {
    //     layout: "full",
    //   },
    // },
    {
      path: "/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
