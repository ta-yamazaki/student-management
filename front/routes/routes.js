
import ncList from "../component/ncList.js";
import ncDetail from "../component/ncDetail.js";

var router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/", component: ncList },
        { path: "/nc/list", component: ncList },
        { path: "/nc/detail/:id", component: ncDetail }
    ]
});
// routerをマウント
new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    router: router
});

