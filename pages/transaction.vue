<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Transaction</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Id
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Type
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Amount
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Create at
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in data"
              :key="transaction.id"
              class="border-t"
            >
              <td class="p-2">{{ transaction.id }}</td>
              <td class="p-2">{{ transaction.type }}</td>
              <td class="p-2">{{ transaction.amount }}</td>
              <td class="p-2">
                {{ formatDateTime(transaction.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 flex gap-2 items-center justify-end">
          <label for="page" class="block text-gray-700 font-semibold"
            >Page</label
          >
          <select
            id="page"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            v-model="page"
          >
            <option
              v-for="pageOption of pageOptions"
              :key="pageOption.value"
              :value="pageOption.value"
            >
              {{ pageOption.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const page = ref(1);
const totalPage = ref(1);
const data = ref<Transaction[]>([]);

const pageOptions = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPage.value; i++) {
    pages.push({
      label: i,
      value: i,
    });
  }
  return pages;
});

const getTranasctions = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData("transaction/me", {
    query: { page: page.value, limit: 10, count: true },
  });

  if (response) {
    data.value = response.data;
    totalPage.value = Math.ceil(response.totalItem / 10);
  }
  if (error) {
    $toast(error?.data?.message || "Fetch transaction failed.", {
      type: "error",
    });
  }

  setLoading(false);
};

watch(page, async (page) => {
  await getTranasctions();
});

await getTranasctions();
</script>
