<template>
  <div class="flex items-center justify-center bg-gray-100 min-h-screen">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">
        {{ isModeLogin ? "LOGIN" : "SIGN UP" }}
      </h2>
      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold">Username</label>
          <input
            ref="usernameRef"
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div v-if="!isModeLogin" class="mb-4">
          <label class="block text-gray-700 font-semibold"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-500 text-white py-2 rounded-lg"
        >
          {{ isModeLogin ? "LOGIN" : "SIGN UP" }}
        </button>
        <div
          class="mt-4 text-center cursor-pointer text-gray-700 underline"
          @click="toggleIsLoginMode"
        >
          {{ isModeLogin ? "SIGN UP" : "LOGIN" }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { login } = authStore;
const { setLoading } = uiStore;

const { fetchData } = useApi();

const isModeLogin = ref(true);

const usernameRef = ref(null);

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

onMounted(() => {
  if (usernameRef.value) {
    usernameRef.value.focus();
  }
});

const clearInputValues = () => {
  username.value = "";
  password.value = "";
  confirmPassword.value = "";
};

const toggleIsLoginMode = () => {
  isModeLogin.value = !isModeLogin.value;
  clearInputValues();
};

const loginHandler = async () => {
  const { response, error } = await fetchData(`authentication/login`, {
    method: "POST",
    body: { username: username.value, password: password.value },
  });
  if (response) {
    await login(response.data.accessToken);
    $toast("Login successfully.", { type: "success" });
    navigateTo("/profile", { replace: true });
  } else {
    $toast(error?.data?.message || "Login failed.", { type: "error" });
  }
};

const registerHandler = async () => {
  if (password.value !== confirmPassword.value) {
    $toast("Passwords don't match.", { type: "error" });
    return;
  }

  const { response, error } = await fetchData(`authentication/register`, {
    method: "POST",
    body: { username: username.value, password: password.value },
  });
  if (response) {
    await login(response.data.accessToken);
    $toast("Registration successfully.", { type: "success" });
    navigateTo("/profile", { replace: true });
  } else {
    $toast(error?.data?.message || "Registration Failed.", { type: "error" });
  }
};

const submit = async () => {
  setLoading(true);
  if (isModeLogin.value) {
    await loginHandler();
  } else {
    await registerHandler();
  }
  setLoading(false);
};
</script>
