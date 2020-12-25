// 登録する （グローバルコンポーネント）
Vue.component('my-component', {
    data: function () {
        return {
          message: 'A custom component!',
          count: 1
        }
    },
    template: `<div>
                <div>{{ message }}</div>
                <div>{{ count }}</div>
               </div>`
});

// root インスタンスを作成する
new Vue({
    el: '#example',
    vuetify: new Vuetify()
});


// ローカルコンポーネントは
var ncListPage = {
    data: function () {
        return {
          message: 'local component ncListPage',
          count: 2
        }
    },
    template: `<div>
                <div>{{ message }}</div>
                <div>{{ count }}</div>
               </div>`
};

export default { ncListPage };


