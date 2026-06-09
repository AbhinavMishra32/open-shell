if (process.env.OPALINE_SAME_UI_EXACT === "1") {
  require("./exact-upstream-main.cjs");
} else {
  require("./library-main.cjs");
}
