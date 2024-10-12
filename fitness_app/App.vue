<script>
import { mapActions, mapGetters } from "vuex";
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    this.getShopInfoAsync();
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },

  methods: {
    ...mapActions("systemModel", ["getShopInfoAsync"]),
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-ui/index.scss";
</style>
