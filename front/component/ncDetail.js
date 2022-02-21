
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

const testimonyList = ["B証", "祈り", "賛美", "R証"];

Vue.component('bs-status', {
  data: function () {
    return {
        ncId: "",
        bsList: [],
        progress: [],
        testimonyList: [],
        testimonyDone: [],
        updatedAt: "",
        loading: true,
    }
  },
    created() {
        this.bsList = bsList;
        this.testimonyList = testimonyList;

        const ncId = this.$route.query.ncId;
        this.ncId = ncId;
        axios.get("/api/bs/status?ncId=" + ncId).then(res => {
            var progress = res.data.progress;
            this.progress = Array.isArray(progress) ? progress : [];

            var testimonyDone = res.data.testimony;
            this.testimonyDone = Array.isArray(testimonyDone) ? testimonyDone : [];
            this.loading = false;

            var updatedAt = res.data.updatedAt;
            if (updatedAt == null) return;
            var milliseconds = updatedAt._seconds * 1000;
            this.updatedAt = moment(new Date(milliseconds)).format('YYYY年MM月DD日 HH:mm');
        });
    },
    methods: {
        updateBs() {
            this.loading = true;

            axios.post("/api/bs/status", { ncId: this.ncId, progress: this.progress, testimony: this.testimonyDone })
                .then(res => {
                    this.updatedAt = moment(new Date()).format('YYYY年MM月DD日 HH:mm');
                    this.$emit('updateSuccess');
                })
                .catch( error => { console.log(error); })
                .finally( () => { this.loading = false; });
        }
    },
    filters: {
    },
    watch: {
    },
    template: `
      <v-card-text>
            <v-row
                dense no-gutters
                class="text-no-wrap"
            >
                <v-col
                    :cols="12 / testimonyList.length"
                    v-for="testimony in testimonyList"
                    :key="testimony"
                    class="my-0 py-0"
                >
                  <v-checkbox
                   v-model="testimonyDone"
                   :label="testimony" :value="testimony"
                   class="my-0 py-0"
                   :disabled="loading"
                  ></v-checkbox>
                </v-col>
            </v-row>

            <v-divider class="mt-0 mb-6 mx-10"></v-divider>

            <v-row
                dense no-gutters
                class="text-no-wrap"
            >
                <v-col
                    cols="4"
                    v-for="bs in bsList"
                    :key="bs"
                    class="my-0 py-0"
                >
                  <v-checkbox
                  loading
                   v-model="progress"
                   :label="bs" :value="bs"
                   class="my-0 py-0"
                   :disabled="loading"
                  ></v-checkbox>
                </v-col>
            </v-row>

            <v-btn
              block
              :loading="loading"
              :disabled="loading"
              color="info"
              @click="updateBs"
            >
            更新
            </v-btn>
            <div class="grey--text mt-2">
              最終更新: {{ updatedAt }}
            </div>
        </v-card-text>
        `
});

Vue.component('nc-detail', {
    data: function () {
        return {
            valid: false,
            ncId: "",
            relation: {
                firstContact: "",
                nurturer: "",
                relationship: "",
                createdAt: "",
                updatedAt: "",
            },
            loading: true,
            gradeList: ["1年", "2年", "3年", "4年", "M1", "M2", "社会人"],
            nameRules: [
                v => !!v || '必須入力です。',
                v => v.length <= 20 || '20文字以下で入力してください。',
            ],
        }
    },
    props: ['profile'],
    created() {
        const ncId = this.$route.query.ncId;
        this.ncId = ncId;

        axios.get("/api/nc/relation?ncId=" + ncId).then(res => {
            this.relation = res.data;
            this.loading = false;

            var updatedAt = res.data.updatedAt;
            if (updatedAt == null) return;
            var milliseconds = updatedAt._seconds * 1000;
            this.relation.updatedAt = moment(new Date(milliseconds)).format('YYYY年MM月DD日 HH:mm');
        });
    },
    methods: {
        update() {
            var isValid = this.$refs.form.validate();
            if (!isValid) return;

            this.loading = true;
            axios.post("/api/nc/update/profile", { ncId: this.ncId, profile: this.profile })
                .then( res => {

                    axios.post("/api/nc/update/relation", { ncId: this.ncId, relation: this.relation })
                        .then( res => {
                            this.relation.updatedAt = moment(new Date()).format('YYYY年MM月DD日 HH:mm');
                            this.$emit('updateSuccess');
                            this.formReset();
                        });

                })
                .catch( error => { console.log(error); })
                .finally( () => { this.loading = false; });
        },
        formReset() {
            this.$refs.form.resetValidation();
        },
    },
    filters: {
    },
    watch: {
    },
    template: `
      <v-card-text class="mt-2">

        <v-form ref="form" v-model="valid"
             lazy-validation
            :loading="loading"
            :disabled="loading"
        >

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="profile.name"
                  :rules="nameRules"
                  :counter="20"
                  label="名前（必須）"
                  class="mt-0 pt-0"
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
                  class="mt-0 pt-0"
                  clearable
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-select
                  v-model="profile.grade"
                  :items="gradeList"
                  label="学年"
                  class="mt-0 pt-0"
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

             <v-divider class="mt-4 mb-6 mx-10"></v-divider>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="relation.nurturer"
                  :counter="20"
                  label="管理者"
                  class="mt-0 pt-0"
                  clearable
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="relation.relationship"
                  :counter="60"
                  label="繋がっている人"
                  class="mt-0 pt-0"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="relation.firstContact"
                  :counter="100"
                  label="繋がったきっかけ"
                  class="mt-0 pt-0"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>


          <v-btn
            block
            :loading="loading"
            :disabled="!valid || loading"
            color="info"
            @click="update"
            class="mt-5"
          >
          更新
          </v-btn>
            <div class="grey--text mt-2">
              最終更新: {{ relation.updatedAt }}
            </div>
        </v-form>
      </v-card-text>
      `
});

Vue.component('nc-activities', {
    data: function () {
        return {
            ncId: "",
            activities: [
                {
                    newcomerId: "newcomerId",
                    date: "2021-01-03",
                    type: "講義",
                    event: "器名",
                    lecture: "lecturelecture",
                    lecturerId: "lecturerId",
                    attendees: "迎え",
                    comment: "comment\ncomments2",
                    next: "次回のよてい",
                    createdBy: { name: "", uid: "" },
                    createdAt: "登録日時",
                    updatedAt: "更新日時",
                },
            ],
            userList: [],
            activityTypeLabel: {
                "器": "&ensp;器&ensp;",
                "対話": "対話",
                "BS": "&nbsp;BS&nbsp;",
                "BS以外の講義": "講義",
            },
            activityTypeColor: {
                "器": "orange lighten-1",
                "対話": "green lighten-1",
                "BS": "blue darken-2",
                "BS以外の講義": "blue lighten-1",
            },
            loading: true,
            limitToGet: 20,
            moreActivityExists: true,
            addActivitiesLoading: false,
        }
    },
    created() {
        axios.get("/api/user/list").then(res => {
            this.userList = res.data;
        });

        const ncId = this.$route.query.ncId;
        this.ncId = ncId;

        axios.get("/api/activity/list?ncId=" + ncId).then(res => {
            this.activities = res.data;
            this.loading = false;
            if (res.data.length < this.limitToGet) this.moreActivityExists = false;
        });
    },
    computed: {
    },
    methods: {
        lecturerWithLabel(activity) {
            return "講師：" + activity.lecturer;
        },
        attendeesWithLabel(activity) {
            return "迎え：" + activity.attendees;
        },
        activitySubtitle(activity) {
            if (activity.type == "器") return "";
            return this.lecturerWithLabel(activity) + "　" + this.attendeesWithLabel(activity);
        },
        activityTitle(activity) {
            if(activity.type == "器") return activity.event;
            return activity.lecture;
        },
        getLecturerName(targetId) {
            this.userList.forEach(user => {
                if (user.uid == targetId) {
                    return user.name;
                }
            });
        },
        activityDate(date) {
            var targetDate = moment(new Date(date));
            var today = moment(new Date());
            if (targetDate.isSame(today, 'day')) return "今日";

            var yesterday = moment(new Date()).subtract(1, 'day');
            if (targetDate.isSame(yesterday, 'day')) return "昨日";

            if (!targetDate.isSame(today, 'year')) return targetDate.format('yyyy.M.D(ddd)');

            return targetDate.format('M.D(ddd)');
        },
        moreActivities() {
            this.addActivitiesLoading = true;
            var activities = [...this.activities];
            var sorted = activities.sort((a, b) => new Date(a.date) - new Date(b.date));
            var minDate = sorted[0].date;
            axios.get("/api/activity/list?ncId=" + this.ncId + "&oldestDate=" + minDate).then(res => {
                var additional = res.data;
                if (additional.length < this.limitToGet) {
                    this.moreActivityExists = false;
                    return;
                }
                this.activities = this.activities.concat(additional);
                this.addActivitiesLoading = false;
            });
        },
    },
    filters: {
    },
    watch: {
        activities (activities) {
            activities.forEach(activity => {
                if (!activity.lecturer == null && !activity.lecturer == "") return;
                var targetId = activity.lecturerId;
                this.userList.forEach(user => {
                    if (user.uid == targetId)
                        activity.lecturer = user.name;
                });
            });
        }
    },
    template: `
        <v-list>
            <v-skeleton-loader
                v-show="loading"
                type="list-item-two-line@10"
                dense
            ></v-skeleton-loader>

            <v-list-group
                v-show="!loading"
                v-for="(activity, i) in activities"
                :key="i"
                v-model="activity.active"
                :color="activityTypeColor[activity.type]"
                :style="activity.active ? 'background-color: whitesmoke; font-weight:bold' : ''"
            >

                <template v-slot:activator three-line>
                  <v-list-item-content>
                    <v-list-item-title class="whiteSpaceForList">
                        <v-chip outlined tag="span"
                            :color="activityTypeColor[activity.type]"
                            style="vertical-align: middle; height: 21px; font-size: 11px;"
                            v-html="activityTypeLabel[activity.type]"
                            class="px-2"
                        ></v-chip>
                        <span style="vertical-align: middle;font-size: 14px;"
                        >{{ activityTitle(activity) }}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle v-text="activitySubtitle(activity)" style="font-size: 10px;" class="whiteSpaceForList"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                      <v-list-item-action-text v-text="activityDate(activity.date)" style="font-size: 9px;"></v-list-item-action-text>
                      <v-icon></v-icon>
                  </v-list-item-action>
                </template>

                    <v-divider class="mx-5"></v-divider>
                <v-list-item class="px-5" dense :color="activityTypeColor[activity.type]">
                    <v-list-item-content>
                        <v-list-item-title>■コメント</v-list-item-title>
                        <v-list-item-title class="whiteSpaceForList">{{ activity.comment }}</v-list-item-title>
                        <v-list-item-title class="mt-2">■Next Action</v-list-item-title>
                        <v-list-item-title class="whiteSpaceForList">{{ activity.next }}</v-list-item-title>
                        <v-list-item-subtitle v-text="'記入者：' + activity.createdBy.name" style="font-size: 10px;" class="mt-2"></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

            </v-list-group>

              <v-btn
                v-show="moreActivityExists"
                :loading="addActivitiesLoading"
                small text block plain
                color="primary"
                :ripple="false"
                class="mt-2 mb-4"
                @click="moreActivities"
              >もっと見る</v-btn>
              <v-btn
                v-show="!moreActivityExists"
                small text block plain disabled
                :ripple="false"
                class="mt-2 mb-4"
                @click="moreActivities"
              >これ以上データがありません。</v-btn>
        </v-list>
    `
});




var ncDetail = {
    data: function () {
        return {
            ncId: "",
            pageTitle: '',
            tab: null,
            profile: {
                name: "",
                belongs: "",
                grade: "",
                interest: "",
                family: "",
                avatar: { color: "" },
            },
            updateNcSuccess: false,
        }
    },
    created() {
        const ncId = this.$route.query.ncId;
        this.ncId = ncId;

        axios.get("/api/nc/detail?ncId=" + ncId).then(res => {
            this.profile = res.data;
            this.pageTitle = this.profile.name + " - " + this.profile.belongs + this.profile.grade;
        });
    },
    methods: {
        updateSuccess() {
            this.updateNcSuccess = true;
        },
    },
    watch: {
        loader () {
            const l = this.loader
            this[l] = !this[l]
            setTimeout(() => (this[l] = false), 3000)
            this.loader = null
        },
    },
    template: `
        <v-flex xs12 sm12 md10 lg8 xl8 class="mx-auto mb-12">

            <v-list>
                <v-app-bar dense fixed dark color="info">
                    <v-btn
                      icon
                      v-show="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
                      :to="{ path: '/' }"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
                </v-app-bar>
            </v-list>

            <v-snackbar
                v-model="updateNcSuccess"
                color="success"
                top
                timeout="1800"
            >
                更新しました。
            </v-snackbar>

            <v-tabs-items v-model="tab" class="mt-3">
              <v-tab-item>
                <v-card flat>
                      <bs-status @updateSuccess="updateSuccess"></bs-status>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                      <nc-detail :profile="profile" @updateSuccess="updateSuccess"></nc-detail>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                      <nc-activities></nc-activities>
              </v-tab-item>
            </v-tabs-items>

            <v-bottom-navigation grow fixed height="48">
                <v-tabs
                  v-model="tab"
                  background-color="grey lighten-5"
                  color="primary"
                  grow
                >
                    <v-tab>BS状況</v-tab>
                    <v-tab>プロフィール</v-tab>
                    <v-tab>対話・講義</v-tab>
                </v-tabs>
            </v-bottom-navigation>
        </v-flex>
   `
};

export default ncDetail;





