
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
        },
        methods: {
            register() {
                var isValid = this.$refs.form.validate();
                if (!isValid) return;

                this.loading = true;
                if (this.profile.grade == null) this.profile.grade = "";
                axios.post("/api/nc/register/profile", { profile: this.profile })
                .then( res => {
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
            :loading="loading" :disabled="loading"
        >
            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                  <v-footer fixed color="transparent" class="px-3 py-3">
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
                      rows="3"
                      counter="1000"
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
        ncListLoading: true,
        search: '',
        item: -1, //デフォルトでアクティブにするアイテム（index）
        items: [],
        twoLine: true,
        avatar: true,
        snackbar: {
            display: false,
            text: "",
            color: "",
        },
        archiveTargetId: "",
        deleteDialog: false,
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
            return this.items.length == 0 && !this.ncListLoading;
        },
    },
    methods: {
        getNcList() {
//            var functions = firebase.functions();
//            functions.useFunctionsEmulator("http://localhost:5001");
//            var getNcList = functions.httpsCallable("app/api/nc/list");
//            getNcList().then(function(res) {
//                this.items = res.data;
//            });
            this.ncListLoading = true
            axios.get("/api/nc/list").then(res => {
                this.items = res.data;
                setTimeout(() => (this.ncListLoading = false), 700);
            });
        },
        iconText(name) {
            return name.charAt(0);
        },
        archiveShow(ncId) {
            this.archiveTargetId = ncId;
        },
        archiveHide() {
            this.archiveTargetId = "";
        },
        archive() {
            axios.post("/api/nc/archive", { ncId: this.archiveTargetId })
            .then(res => {
                this.deleteDialog = false;
                this.archiveHide();
                this.getNcList();
            });
        },
        isArchiveTarget(ncId) {
            return this.archiveTargetId == ncId;
        },
        success() {
            this.snackbar.text = "登録しました。";
            this.snackbar.color = "success";
            this.snackbar.display = true;
            this.getNcList();
        },
        logout() {
            firebase.auth().signOut().then(()=>{
              console.log("ログアウトしました");
            })
            .catch( (error)=>{
              console.log(`ログアウト時にエラーが発生しました (${error})`);
            });
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
                    <v-col cols="6">
                     <v-text-field
                         v-model="search"
                         label="search"
                         width="45%"
                         clearable dense
                         hide-details single-line
                         prepend-inner-icon="mdi-magnify"
                       ></v-text-field>
                    </v-col>

                   <v-menu left bottom>
                       <template v-slot:activator="{ on, attrs }">
                         <v-btn
                           icon
                           v-bind="attrs"
                           v-on="on"
                         >
                           <v-icon>mdi-account</v-icon>
                         </v-btn>
                       </template>

                       <v-list>
                         <v-list-item @click="logout">
                           <v-list-item-title>ログアウト</v-list-item-title>
                         </v-list-item>
                       </v-list>
                     </v-menu>

                </v-app-bar>
            </v-list>

            <v-snackbar
                v-model="snackbar.display"
                :color="snackbar.color"
                top
                timeout="1800"
            >
                {{ snackbar.text }}
            </v-snackbar>

                <v-skeleton-loader v-for="i in 5" :key="i"
                    v-show="ncListLoading"
                    type="list-item-avatar-two-line"
                ></v-skeleton-loader>

            <v-list twoLine avatar v-show="!ncListLoading">
                <v-list-item-group v-model="item">
                    <template v-for="(item, i) in filteredNcList">
                        <v-divider v-if="i!=0" inset></v-divider>
                        <v-expand-x-transition>
                            <v-card
                                flat
                                v-show="isArchiveTarget(item.id)"
                                class="red lighten-1 center"
                                  height="72"
                                  width="80"
                                  style="margin: 0 ; text-align: center; float:right;"
                                  @click="deleteDialog = true"
                            >
                               <v-icon color="white" style="height:100%;">mdi-trash-can-outline</v-icon>
                            </v-card>
                        </v-expand-x-transition>
                        <v-list-item
                            :key="item.id"
                            :id="item.id"
                            :to="{ path: '/nc/detail', query: {ncId: item.id} }"
                            v-touch="{ left: () => archiveShow(item.id), right: () => archiveHide() }"
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

            <v-fade-transition>
            <v-list v-show="ncEmpty">
                <v-sheet width="100%" height="100vh" align="center">
                      命情報が登録されていません。
                  </v-sheet>
            </v-list>
            </v-fade-transition>

            <register-nc @registerNcSuccess="success"></register-nc>

            <v-dialog
              v-model="deleteDialog"
              persistent
            >
              <v-card>
                <v-card-title>一覧から削除します。</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="archive()"
                  >
                    OK
                  </v-btn>
                  <v-btn
                    color=""
                    text
                    @click="deleteDialog = false; archiveTargetId = '';"
                  >
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-flex>
    `
};

export default ncList;


