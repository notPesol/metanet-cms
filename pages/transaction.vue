<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Transaction</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <Table :headers="tableHeaders" :rows="data">
          <template #type="{ row }" :row>{{
            displayTransactionType(row.type)
          }}</template>
          <template #createdAt="{ row }" :row>{{
            formatDateTime(row.createdAt)
          }}</template>
        </Table>
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
import type { TableHeader, Transaction, TransactionType } from "~/interfaces";

definePageMeta({
  middleware: "auth",
});

const tableHeaders: TableHeader[] = [
  { label: "Id", key: "id" },
  { label: "Type", key: "type" },
  { label: "Amount", key: "amount" },
  { label: "Created at", key: "createdAt" },
];

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

const displayTransactionType = (key: TransactionType) => {
  return mapTransactionType[key];
};

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
