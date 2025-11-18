import {IamApi} from "../infrastructure/iam-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SignInAssembler} from "../infrastructure/sign-in.assembler.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {SignUpAssembler} from "../infrastructure/sign-up.assembler.js";

const iamApi = new IamApi();

const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    const isSignedIn = ref(false);
    const currentUsername = ref(null);
    const currentUserId = ref(0);
    const currentToken = computed(() => isSignedIn.value
        ? localStorage.getItem('token')
        : null);

    function signIn(signInCommand, router) {
        console.log(signInCommand);
        iamApi.signIn(signInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let currentUser = UserAssembler.toEntityFromResource(signInResource);
                    currentUsername.value = currentUser.username;
                    currentUserId.value = currentUser.id;
                    localStorage.setItem('token', signInResource.token);
                    isSignedIn.value = true;
                    console.log(`User ${currentUsername.value} signed in successfully.`);
                    errors.value = [];
                    router.push({name: 'home'});
                } else {
                    isSignedIn.value = false;
                    console.log(`Sign-in failed: Invalid response.`);
                    errors.value.push(new Error("Invalid response."));
                    router.push({name: 'iam-sign-in'});
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                currentUsername.value = '';
                currentUserId.value = 0;
                console.log(`Sign-in failed: ${error.message}`);
                errors.value.push(error);
                router.push({name: 'iam-sign-in'});
            });
    }

    function signUp(signUpCommand, router) {
        iamApi.signUp(signUpCommand)
            .then(response => {
                let signUpResource = SignUpAssembler.toResourceFromResponse(response);
                if (signUpResource) {
                    console.log(signUpResource.message);
                    errors.value = [];
                    router.push({name: 'iam-sign-in'});
                } else {
                    console.log(`Sign-up failed: Invalid response.`);
                    errors.value.push(new Error("Invalid response."));
                    router.push({name: 'iam-sign-up'});
                }
            })
            .catch(error => {
                console.log(`Sign-up failed: ${error.message}`);
                errors.value.push(error);
                router.push({name: 'iam-sign-up'});
            })
    }

    function signOut(router) {
        currentUsername.value = '';
        currentUserId.value = 0;
        localStorage.removeItem('token');
        isSignedIn.value = false;
        errors.value = [];
        console.log(`User signed out successfully.`);
        router.push({name: 'iam-sign-in'});
    }

    return {
        users,
        errors,
        usersLoaded,
        isSignedIn,
        currentUsername,
        currentUserId,
        currentToken,
        signIn,
        signUp,
        signOut
    };
});

export default useIamStore;