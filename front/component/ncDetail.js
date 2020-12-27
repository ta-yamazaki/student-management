
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


Vue.component('bs-status', {
  data: function () {
    return {
            selectedBs: [],
            bsList: [],
            loader: null,
            loading: false,
    }
  },
    created() {
        this.bsList = bsList;
    },
    methods: {
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
      <v-card-text>
            <v-row
                dense no-gutters
                class="text-no-wrap"
            >
                <v-col
                    cols="4"
                    v-for="bs in bsList"
                    :key="bs"
                >
                  <v-checkbox
                   v-model="selectedBs"
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
              @click="loader = 'loading'"
            >
            更新
            </v-btn>
        </v-card-text>
        `
});

Vue.component('nc-profile', {
  data: function () {
    return {
            loader: null,
            loading: false,
            rules: [v => v.length <= 200 || '最大200文字まで'],
    }
  },
  props: ['profile'],
    created() {
    },
    methods: {
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
      <v-card-text>
          <v-textarea
            v-model="profile.memo"
            auto-grow clearable
            counter filled
            label="メモ"
            counter="200"
            :rules="rules"
            :loading="loading"
          ></v-textarea>

          <v-btn
            block
            :loading="loading"
            :disabled="loading"
            color="info"
            @click="loader = 'loading'"
          >
          更新
          </v-btn>
      </v-card-text>
      `
});

var ncDetail = {
    data: function () {
        return {
            pageTitle: '',
            tab: null,
            profile: {},
       }
    },
    created() {
        const ncId = this.$route.params.id;
        axios.get("/api/nc/detail/" + ncId).then(res => {
            this.profile = res.data;
            this.pageTitle = res.data.name;
        });
    },
    methods: {
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


           <v-card-text>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <v-card flat>
                          <bs-status></bs-status>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                          <nc-profile :profile="profile"></nc-profile>
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





