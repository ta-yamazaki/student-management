
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
        loading: false,
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
            var milliseconds = res.data.updatedAt._seconds * 1000;
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
                   v-model="progress"
                   :label="bs" :value="bs"
                   class="my-0 py-0"
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
        loading: false,
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
            var milliseconds = this.relation.updatedAt._seconds * 1000;
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
//        moment(value) {
//            if (value == null || value == "") return "";
//            var milliseconds = value._seconds * 1000;
//            return moment(new Date(milliseconds)).format('YYYY年MM月DD日 HH:mm');
//        },
    },
    watch: {
    },
  template: `
      <v-card-text>

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
        <v-flex xs12 sm12 md10 lg8 xl8 class="mx-auto">

            <v-list>
                <v-app-bar
                    dense fixed
                    elevation="3" elevate-on-scroll
                    color="grey lighten-5" height="38"
                >
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

           <v-card-text>
                <v-tabs-items v-model="tab">
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
                </v-tabs-items>
            </v-card-text>

            <v-bottom-navigation grow fixed height="48">
                <v-tabs
                  v-model="tab"
                  background-color="grey lighten-5"
                  color="primary"
                  grow
                >
                    <v-tab>BS状況</v-tab>
                    <v-tab>プロフィール</v-tab>
                </v-tabs>
            </v-bottom-navigation>
        </v-flex>
   `
};

export default ncDetail;





