
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


const bsList = [
    "B導入", "ペテロ", "ヨシュア",
    "エリヤ", "人間", "七段階",
    "時代性", "比喩", "火と終末",
    "洪水", "三位一体", "無知",
    "予定", "中心人物", "サタン",
    "啓示", "再臨･引上", "カイン",
    "異端", "創造目的", "堕落",
    "霊界", "復活", "罪･悔改",
    "御子", "ひと時", "オリブ",
    "千年王国", "再臨実相", "二人の証人"
];

Vue.component('activity-report-form', {
    data: function () {
        return {
            activity: {
                newcomerId: "",
                date: "",
                type: "",
                event: "",
                lecture: "",
                lecturerId: "",
                attendees: "",
                comment: "",
                next: "",
                createdBy: { uid: "", displayName: "" },
            },
            activityTypeList: [ "器", "対話", "BS", "BS以外の講義" ],
            bsList: bsList,
            eventList: [],
            lecturerList: [],
            lectureListExceptBs: [],
            calendar: false,
            valid: false,
            ncRules: [ v => !!v || '必須入力です。' ],
            dateRules: [ v => !!v || '必須入力です。' ],
            typeRules: [ v => !!v || '必須入力です。' ],
            eventRules: [
                v => !!v || '必須入力です。',
            ],
            lectureRules: [
                v => !!v || '必須入力です。',
            ],
            lecturerRules: [
                v => !!v || '必須入力です。',
            ],
            commentRules: [
                v => !!v || '必須入力です。',
                v => v.length <= 1000 || '1000文字以下で入力してください。',
            ],
            nextActionRules: [
                v => !!v || '必須入力です。',
                v => v.length <= 300 || '300文字以下で入力してください。',
            ],
            loading: false,
        }
    },
    props: ["activityReportDialog", "ncList", "loginUser"],
    created() {
            this.getEventList();
            this.getLecturerList();
            this.getLectureListExceptBs();
    },
    computed: {
        activityTypeSelected() {
            return this.activity.type != null && this.activity.type != "";
        },
    },
    methods: {
        getEventList() {
            axios.get("/api/activity/events").then(res => {
                this.eventList = res.data;
            });
        },
        getLecturerList() {
            axios.get("/api/user/list").then(res => {
                this.lecturerList = res.data;
//                axios.get("/api/activity/lecturers").then(res => {
//                    var tempList = this.lecturerList.concat(res.data)
//                    this.lecturerList = Array.from(new Set(tempList));
//                });
            });
        },
        getLectureListExceptBs() {
            axios.get("/api/activity/lectures-except-bs").then(res => {
                this.lectureListExceptBs = res.data;
            });
        },
        submitReport() {
            var isValid = this.$refs.form.validate();
            if (!isValid) return;

            this.loading = true;

            this.activity.createdBy.uid = this.loginUser.uid;
            this.activity.createdBy.displayName = this.loginUser.displayName;

            axios.post("/api/activity/report", { activity: this.activity })
            .then( res => {
                this.$emit('activityReportSuccess');
                this.formReset();
            })
            .catch( error => {
                console.log(error);
            })
            .finally( () => {
                this.loading = false;
                this.getEventList();
                this.getLecturerList();
                this.getLectureListExceptBs();
            });
        },
        cancel() {
            this.$emit('activityReportFormHide');
            this.formReset();
        },
        formReset() {
            this.activity = {
                newcomerId: "",
                date: "",
                type: "",
                event: "",
                lecture: "",
                lecturerId: "",
                attendees: "",
                comment: "",
                next: "",
                createdBy: { uid: "", displayName: "" },
            };
            this.$refs.form.resetValidation();
        },
        activityTypeIs(type) {
            return type == this.activity.type;
        },
        changeNewcomerId(selected) {
            this.activity.newcomerId = selected.value;
        },
        changeLecturerId(selected) {
            this.activity.lecturerId = selected.value;
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
              v-model="activityReportDialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
            <v-list>
                <v-app-bar fixed dark color="primary">
                  <v-btn type="button" icon dark @click="cancel">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>命報告フォーム</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark @click="submitReport"
                      :loading="loading"
                      :disabled="!valid || loading"
                    >
                      送信
                    </v-btn>
                  </v-toolbar-items>
                </v-app-bar>
            </v-list>

              <v-card>
                <v-container>
                  <v-row style="height: 65px;"></v-row>
                  <v-row>
                    <v-col cols="12">

                            <v-autocomplete
                              :items="ncList"
                              :item-text="function(nc) { return nc.name + ' - ' + nc.belongs + nc.grade }"
                              item-value="id"
                              dense
                              label="命 *"
                              class="mt-0 pt-0"
                              :rules="ncRules"
                              @change="changeNewcomerId"
                            ></v-autocomplete>

                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-menu
                        v-model="calendar"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="activity.date"
                            label="日付 *"
                            prepend-icon="mdi-calendar"
                            class="mt-0 pt-0"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="dateRules"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="activity.date"
                          @input="calendar = false"
                          locale="jp-ja"
                          no-title
                          :day-format="date => new Date(date).getDate()"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-col cols="12" class="pa-0" style="color: rgba(0,0,0,.6); font-size: 14px;">
                        アクション *
                      </v-col>
                      <v-radio-group
                          v-model="activity.type"
                          :rules="typeRules"
                          class="mt-0"
                          row
                      >
                        <v-radio
                          v-for="activityType in activityTypeList"
                          :key="activityType"
                          :label="activityType"
                          :value="activityType"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>

                  <v-expand-transition>
                  <v-row v-if="activityTypeIs('器')">
                    <v-col cols="12">
                          <v-combobox
                            v-model="activity.event"
                            :items="eventList"
                            dense
                            hide-no-data
                            label="器名"
                            class="mt-0 pt-0"
                            :rules="eventRules"
                            clearable
                            hint="リストにない場合は直接入力可能"
                          ></v-combobox>
                    </v-col>
                  </v-row>
                  </v-expand-transition>

                  <v-expand-transition>
                <v-row v-if="activityTypeIs('BS')">
                  <v-col cols="12">
                          <v-autocomplete
                            v-model="activity.lecture"
                            :items="bsList"
                            dense
                            hide-no-data
                            label="講義"
                            class="mt-0 pt-0"
                            :rules="lecturerRules"
                            clearable
                          ></v-autocomplete>
                      </v-col>
                  </v-row>
                  </v-expand-transition>

                  <v-expand-transition>
                <v-row v-if="activityTypeIs('BS以外の講義')">
                  <v-col cols="12">
                          <v-combobox
                            v-model="activity.lecture"
                            :items="lectureListExceptBs"
                            dense
                            hide-no-data
                            label="講義内容"
                            class="mt-0 pt-0"
                            :rules="lectureRules"
                            clearable
                            hint="リストにない場合は直接入力可能"
                          ></v-combobox>
                      </v-col>
                  </v-row>
                  </v-expand-transition>

                  <v-expand-transition>

                <v-row v-if="activityTypeIs('対話') || activityTypeIs('BS') || activityTypeIs('BS以外の講義')">
                  <v-col cols="12">
                          <v-combobox
                            :items="lecturerList"
                            item-text="displayName"
                            item-value="id"
                            dense
                            hide-no-data
                            label="講師"
                            class="mt-0 pt-0"
                            :rules="lecturerRules"
                            hint="リストにない場合は講師の方がユーザー登録する必要があります。"
                            @change="changeLecturerId"
                          ></v-combobox>
                  </v-col>
                </v-row>

                  </v-expand-transition>

                  <v-expand-transition>
                  <v-row v-if="activityTypeSelected">
                    <v-col cols="12">
                      <v-text-field
                        v-model="activity.attendees"
                        label="同席者"
                        class="mt-0 pt-0"
                        clearable
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  </v-expand-transition>

                  <v-expand-transition>

                <v-row v-if="activityTypeSelected">
                  <v-col cols="12">
                    <v-textarea
                      v-model="activity.comment"
                      label="コメント"
                      class="mt-0 pt-0"
                      clearable
                      rows="2"
                      counter="1000"
                      :rules="commentRules"
                      auto-grow clearable
                    ></v-textarea>
                  </v-col>
                  </v-row>
                  </v-expand-transition>

                  <v-expand-transition>

                    <v-row v-if="activityTypeSelected">
                        <v-col cols="12">
                            <v-textarea
                                v-model="activity.next"
                                label="次回の予定"
                                class="mt-0 pt-0"
                                clearable
                                rows="2"
                                counter="300"
                                :rules="nextActionRules"
                                auto-grow clearable
                            ></v-textarea>
                        </v-col>
                    </v-row>
                  </v-expand-transition>

                  <v-row style="height: 30px;"></v-row>
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
        nc: -1, //デフォルトでアクティブにするアイテム（index）
        ncList: [],
        twoLine: true,
        avatar: true,
        snackbar: {
            display: false,
            text: "",
            color: "",
        },
        archiveTargetId: "",
        deleteDialog: false,
        activityScheduleDialog: false,
        activityReportDialog: false,
        loginUser: {
            uid: "aaaa",
            displayName: "",
            email: "",
        },
      }
    },
    created() {
        this.getNcList();

        var form = this.$route.query.form;
        if (form == "activitySchedule") this.activityScheduleFormShow();
        if (form == "activityReport") this.activityReportFormShow();

        firebase.auth().onAuthStateChanged((user) => {
            this.loginUser.uid = user.uid;
            this.loginUser.displayName = user.displayName;
            this.loginUser.email = user.email;
        });
    },
    computed: {
        filteredNcList(){
        　return this.ncList.filter(nc => {
            var targetText = nc.name + nc.belongs + nc.memo;
            return targetText.includes(this.search);
        　})
        },
        ncEmpty() {
            return this.ncList.length == 0 && !this.ncListLoading;
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
                this.ncList = res.data;
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
        registerSuccess() {
            this.snackbar.text = "登録しました。";
            this.snackbar.color = "success";
            this.snackbar.display = true;
            this.getNcList();
        },
        activityScheduleFormShow() {
            this.activityScheduleDialog = true;
        },
        activityScheduleFormHide() {
            this.activityScheduleDialog = false;
        },
        activityReportFormShow() {
            this.activityReportDialog = true;
        },
        activityReportFormHide() {
            this.activityReportDialog = false;
        },
        activityReportSuccess() {
            this.snackbar.text = "送信しました。";
            this.snackbar.color = "success";
            this.snackbar.display = true;
            this.activityReportDialog = false;
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
                <!--  <v-app-bar-nav-icon>
                    <v-img
                        src="./images/logo-square.png"
                        width="8"
                        class="mr-2"
                      ></v- img>
                  </v-app-bar-nav-icon> -->

                    <v-toolbar-title class="pl-0">{{ pageTitle }}</v-toolbar-title>
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
                           <v-icon>mdi-dots-vertical</v-icon>
                         </v-btn>
                       </template>

                       <v-list>
                         <v-list-item @click="activityScheduleFormShow">
                           <v-list-item-title>命予定入力フォーム</v-list-item-title>
                         </v-list-item>
                         <v-list-item @click="activityReportFormShow">
                           <v-list-item-title>命報告フォーム</v-list-item-title>
                         </v-list-item>
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

                <v-skeleton-loader
                    v-show="ncListLoading"
                    type="list-item-avatar-two-line@5"
                ></v-skeleton-loader>

            <v-list twoLine avatar v-show="!ncListLoading">
                <v-list-item-group v-model="nc">
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

            <register-nc @registerNcSuccess="registerSuccess"></register-nc>
            <activity-report-form
                :activityReportDialog="activityReportDialog"
                :ncList="ncList"
                :loginUser="loginUser"
                @activityReportFormHide="activityReportFormHide"
                @activityReportSuccess="activityReportSuccess"
            ></activity-report-form>

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


