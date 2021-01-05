
//const app = firebase.initializeApp();
//const functions = firebase.functions().useFunctionsEmulator('http://localhost:5000');
//const functions = firebase.app().functions('us-central1');

import ncList from "../component/ncList.js";
import ncDetail from "../component/ncDetail.js";

var router = new VueRouter({
    mode: "history",
    routes: [
        { path: "", component: ncList },
        { path: "/", component: ncList },
        { path: "/nc/list", component: ncList },
        { path: "/nc/detail", component: ncDetail },
        { path: "/**", component: ncList }
    ]
});

var params = (new URL(document.location)).searchParams;
var routerLink = params.get('routerLink');
if (routerLink != null) router.push(routerLink);


// routerをマウント
new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    router: router
});

