
Vue.component('register-nc', {
    data: function () {
        return {
            valid: false,
            profile: {
                name: "",
                belongs: "",
                grade: null,
                interest: "",
                family: "",
                memo: "",
                avatar: { color: "" },
            },
            gradeList: ["", "1年", "2年", "3年", "4年", "M1", "M2", "社会人"],
            dialog: false,
            nameRules: [
                v => !!v || '必須入力です。',
                v => v.length <= 20 || '20文字以下で入力してください。',
            ],
            loading: false,
        }
      },
        created() {

//            this.bsList = bsList;
//            const ncId = this.$route.query.ncId;
//            this.ncId = ncId;
//            axios.get("/api/bs/status?ncId=" + ncId).then(res => {
//                var progress = res.data.progress;
//                this.progress = Array.isArray(progress) ? progress : [];
//                var milliseconds = res.data.updatedAt._seconds * 1000;
//                this.updatedAt = moment(new Date(milliseconds)).format('YYYY年MM月DD日 HH:mm');
//            });
        },
        methods: {
            register() {
                var isValid = this.$refs.form.validate();
                if (!isValid) return;

                this.loading = true;
                if (this.profile.grade == null) this.profile.grade = "";
                axios.post("/api/nc/register/profile", { profile: this.profile })
                .then( res => {
                    console.log(res.status);
                    this.$emit('registerNcSuccess');
                    this.dialog = false;
                    this.formReset();
                })
                .catch( error => {
                    console.log(error);
                })
                .finally( () => {
                    this.loading = false;
                });
            },
            cancel() {
                this.dialog = false;
                this.formReset();
            },
            formReset() {
                this.profile = {
                        name: "",
                        belongs: "",
                        grade: null,
                        interest: "",
                        family: "",
                        memo: "",
                };
                this.$refs.form.resetValidation();
            },

        },
        watch: {
        },
      template: `
        <v-row justify="center">
        <v-form ref="form" v-model="valid" lazy-validation
                      :loading="loading"
                      :disabled="loading"
                      >
            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                  <v-footer fixed color="transparent">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="info"
                        fab
                        v-bind="attrs"
                        v-on="on"
                        elevation="3"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                  </v-footer>
              </template>
              <v-card>
                <v-toolbar
                  dark
                  color="primary"
                >
                  <v-btn
                    type="button"
                    icon
                    dark
                    @click="cancel"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>命 新規登録</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark @click="register"
                      :loading="loading"
                      :disabled="!valid || loading"
                    >
                      保存
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>

                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="profile.name"
                        :rules="nameRules"
                        :counter="20"
                        label="名前（必須）"
                        clearable
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="8">
                      <v-text-field
                        v-model="profile.belongs"
                        :counter="20"
                        label="学校/社会人"
                        clearable
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-select
                        v-model="profile.grade"
                        :items="gradeList"
                        label="学年"
                      ></v-select>
                    </v-col>
                  </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="profile.memo"
                      label="メモ"
                      placeholder="興味関心、家族関係 etc."
                      rows="2"
                      counter="1000"
                      class="mt-0 pt-0"
                      auto-grow clearable
                    ></v-textarea>
                  </v-col>
                  </v-row>
                </v-container>

              </v-card>
            </v-dialog>
            </v-form>
          </v-row>
      `
});


var ncList = {
    data: function () {
      return {
        pageTitle: 'NC一覧',
        search: '',
        item: -1, //デフォルトでアクティブにするアイテム（index）
        items: [],
        twoLine: true,
        avatar: true,
        registerNcSuccess: false,
      }
    },
    created() {
        this.getNcList();
    },
    computed: {
        filteredNcList(){
        　return this.items.filter(nc => {
            var targetText = nc.name + nc.belongs + nc.memo;
            return targetText.includes(this.search);
        　})
        },
        ncEmpty() {
            return this.items.length == 0;
        },
    },
    methods: {
        getNcList() {
    //        var getNcList = firebase.functions().httpsCallable('https://localhost/nc/list');
    //        getNcList().then(function(res) {
    //            this.items = res.data;
    //        });
            axios.get("/api/nc/list").then(res => {
                this.items = res.data;
            });
        },
        iconText(name) {
            return name.charAt(0);
        },
        success() {
            this.registerNcSuccess = true;
            this.getNcList();
            setTimeout(() => (this.registerNcSuccess = false), 1100);
        },
    },
    template: `
        <v-flex xs12 sm12 md10 lg8 xl8 class="mx-auto">
            <v-list>
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
                         prepend-inner-icon="mdi-magnify"
                       ></v-text-field>

                </v-app-bar>
            </v-list>
               <v-alert
                    style="position: fixed; z-index: 9999;"
                    type="success"
                    v-show="registerNcSuccess"
                    elevation="5"
                    transition="fade-transition"
                    width="100%"
                >
                  登録しました。
                </v-alert>

            <v-list twoLine avatar>
                <v-list-item-group v-model="item" color="primary">
                    <template v-for="(item, i) in filteredNcList">
                        <v-divider v-if="i!=0" inset></v-divider>
                        <v-list-item
                            :key="i"
                            :to="{ path: '/nc/detail', query: {ncId: item.id} }"
                        >
                            <v-list-item-avatar v-if="item.avatar">
                                <v-avatar :color="item.avatar.color">
                                  <span class="white--text headline">{{ iconText(item.name) }}</span>
                                </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-html="item.name"></v-list-item-title>
                                <v-list-item-subtitle v-if="twoLine || threeLine" v-html="item.belongs + item.grade"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list-item-group>
            </v-list>

            <v-list v-show="ncEmpty">
                <v-sheet
                    width="100%"
                    height="100vh"
                    align="center"
                  >
                      命情報が登録されていません。
                  </v-sheet>
            </v-list>

            <register-nc @registerNcSuccess="success"></register-nc>

        </v-flex>
    `
};

export default ncList;


