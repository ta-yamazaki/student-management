
var ncList = {
    data: function () {
      return {
        pageTitle: 'NC一覧',
        search: '',
        item: -1, //デフォルトでアクティブにするアイテム（index）
        items: [],
        twoLine: true,
        avatar: true,
      }
    },
    created() {
        axios.get("/api/nc/list").then(res => {
            this.items = res.data;
        });
    },
    computed: {
        filteredNcList(){
        　return this.items.filter(nc => {
            var targetText = nc.name + nc.belongs + nc.memo;
            return targetText.includes(this.search);
        　})
        }
    },
    methods: {
        iconText(name) {
            return name.charAt(0);
        }
    },
    template: `
        <v-flex xs12 sm12 md10 lg8 xl8 class="mx-auto">
                <v-app-bar
                    dense fixed
                    elevation="3" elevate-on-scroll
                    color="grey lighten-5" height="38"
                >
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
                         prepend-inner-icon="mdi-magnify "
                       ></v-text-field>
                </v-app-bar>

            <v-list twoLine avatar>
                <v-list-item-group v-model="item" color="primary">
                    <template v-for="(item, i) in filteredNcList">
                        <v-divider v-if="i!=0" inset></v-divider>
                        <v-list-item
                            :key="i"
                            :to="{ path: '/nc/detail/' + item.id }"
                        >
                            <v-list-item-avatar v-if="avatar">
                                <v-avatar :color="item.avatar.color">
                                      <span class="white--text headline">{{ iconText(item.name) }}</span>
                                    </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-html="item.name + '<small>（' + item.belongs + '）</small>'"></v-list-item-title>
                                <v-list-item-subtitle v-if="twoLine || threeLine" v-html="item.memo"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list-item-group>
            </v-list>
        </v-flex>
    `
};

export default ncList;


