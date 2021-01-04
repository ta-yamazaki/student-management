
var login = {
    data: function () {
      return {
      }
    },
    created() {
    },
    computed: {
    },
    methods: {
    },
    template: `
        <v-flex xs12 sm12 md10 lg8 xl8 class="mx-auto">
            <div id="firebaseui-auth-container"></div>
            <div id="loginLoader">
                <img id="logo" src="./images/logo.png" height="180">
                <br>
                <br>
                <div id="loading" style="font-size: 14px;">Loading...</div>
            </div>

            <script type="text/javascript">
                  // FirebaseUI config.
                var uiConfig = {
                    callbacks: {
                        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                            return true;
                        },
                        uiShown: function() {
                            document.getElementById('loginLoader').style.display = 'none';
                        }
                    },
                    signInFlow: 'popup',
                    signInSuccessUrl: '/',
                    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
                };

                  var ui = new firebaseui.auth.AuthUI(firebase.auth());
                  // if (location.hostname === "localhost") {
                  //   ui.useEmulator('http://localhost:9099/');
                  // }
                  setTimeout(function() {
                    ui.start('#firebaseui-auth-container', uiConfig);
                  }, 1000);

            </script>
        </v-flex>
    `
};

export default login;
