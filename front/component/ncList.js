
var ncList = {
    data: function () {
      return {
        pageTitle: 'NC一覧',
        search: '',
        item: -1, //デフォルトでアクティブにするアイテム（index）
        items: [],
        disabled: false,
        dense: false,
        twoLine: true,
        threeLine: false,
        shaped: false,
        flat: false,
        subheader: false,
        inactive: false,
        subGroup: false,
        nav: false,
        avatar: true,
        rounded: false,
      }
    },
    created() {
        axios.get("/api/nc/list").then(response => {
            this.items = response.data;
        });
    },
    methods: {
    },
    template: `
        <v-container>
            <v-row align="center">
                <v-card class="mx-auto" tile>
                    <v-toolbar dense elevation="1">
                      <!--  <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
                        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                         <v-text-field
                             v-model="search"
                             label="search"
                             type="text"
                             clearable dense
                             hide-details single-line
                             prepend-inner-icon="mdi-account-search-outline"
                           ></v-text-field>
                    </v-toolbar>

                    <v-list :two-line="twoLine" :avatar="avatar">
                        <v-list-item-group v-model="item" color="primary">
                            <template v-for="(item, i) in items">
                                <v-divider v-if="i!=0" inset></v-divider>
                                <v-list-item
                                    :key="i"
                                    :inactive="inactive"
                                    :to="{ path: '/nc/detail/' + item.id }"
                                >
                                    <v-list-item-avatar v-if="avatar">
                                        <v-img :src="item.avatar"></v-img>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title v-html="item.name + '<small>（' + item.belongs + '）</small>'"></v-list-item-title>
                                        <v-list-item-subtitle v-if="twoLine || threeLine" v-html="item.memo"></v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-row>
        </v-container>
    `
};

export default ncList;


