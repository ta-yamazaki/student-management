
var ncDetail = {
    data: function () {
        return {
            profile: {},
            bsStatus: {}
       }
    },
    created() {
        const ncId = this.$route.params.id;
        axios.get("/api/nc/detail/" + ncId).then(response => {
            this.profile = response.data;
        });
    },
    methods: {
    },
    template: `<div>
                <div>{{ profile.name }}</div>
                <div>{{ profile.belongs }}</div>
                <div>{{ profile.memo }}</div>
               </div>`
};

export default ncDetail;


