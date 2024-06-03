<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Profile</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Username:</span>
          <span class="text-2xl font-bold text-gray-900">{{
            user?.username || "-"
          }}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Created at:</span>
          <span class="text-gray-600">{{
            user?.createdAt ? formatDateTime(user?.createdAt) : "-"
          }}</span>
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-3xl font-bold mb-4">Wallet</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Balance:</span>
          <span class="text-2xl font-bold text-gray-900">{{
            wallet?.balance || "-"
          }}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Last Updated:</span>
          <span class="text-gray-600">{{
            wallet?.updatedAt ? formatDateTime(wallet?.updatedAt) : "-"
          }}</span>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="() => setIsShowModal(true)"
            class="bg-blue-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Make a transaction
          </button>
          <button
            @click="() => getWallet()"
            class="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
    <Modal v-if="isShowModal" @clickOutside="() => clearRefValues()">
      <template #header>
        <h2 class="text-lg leading-6 font-medium text-gray-900">
          Make a transaction
        </h2>
      </template>
      <template #body>
        <div class="flex flex-col gap-2 w-full">
          <div class="mb-4">
            <label
              for="selectedTransactionType"
              class="block text-gray-700 font-semibold"
              >Transaction type</label
            >
            <select
              id="selectedTransactionType"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              v-model="selectedTransactionType"
            >
              <option
                v-for="transactionType of transactionTypeOptions"
                :key="transactionType.value"
                :value="transactionType.value"
              >
                {{ transactionType.label }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="inputAmount" class="block text-gray-700 font-semibold"
              >Amount</label
            >
            <input
              id="inputAmount"
              type="number"
              min="0.01"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              v-model="inputAmount"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <button
            @click="() => makeTransaction()"
            class="bg-blue-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Confirm
          </button>
          <button
            @click="() => clearRefValues()"
            class="bg-red-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import type {
  ICreateWalletTransaction,
  TransactionType,
  IWallet,
  IResponse,
} from "~/interfaces";

definePageMeta({
  middleware: "auth",
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const wallet = ref<IWallet>();
const isShowModal = ref(false);

const selectedTransactionType = ref("deposit");
const inputAmount = ref(0);

const setIsShowModal = (value: boolean) => {
  isShowModal.value = value;
};

const clearRefValues = () => {
  selectedTransactionType.value = "deposit";
  inputAmount.value = 0;
  isShowModal.value = false;
};

const makeTransaction = async () => {
  if (!authStore.accessToken) {
    return;
  }

  if (!selectedTransactionType.value || !inputAmount.value) {
    $toast("Please fill in information.", { type: "warning" });
    return;
  }

  setLoading(true);
  const createWalletTransaction: ICreateWalletTransaction = {
    transactionType: selectedTransactionType.value as TransactionType,
    amount: +inputAmount.value,
  };
  const { response, error } = await fetchData<IResponse<IWallet>>("wallet", {
    method: "POST",
    body: createWalletTransaction,
  });
  if (response) {
    wallet.value = response.data;
    $toast("Make wallet transaction successfully.", { type: "success" });
  }
  if (error) {
    $toast(error?.data?.message || "Make wallet transaction failed.", {
      type: "error",
    });
  }

  clearRefValues();
  setLoading(false);
};

const getWallet = async (isShowToat: boolean = true) => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData<IResponse<IWallet>>("wallet/me");
  if (response) {
    wallet.value = response.data;
    if (isShowToat) {
      $toast("Fetch wallet successfully.", { type: "success" });
    }
  }
  if (error) {
    $toast(error?.data?.message || "Fetch wallet failed.", { type: "error" });
  }

  setLoading(false);
};

await getWallet(false);
</script>
