<template>
  <div>
    <h1>Home</h1>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

// ไม่ใช้
navigateTo("/profile", { replace: true });
</script>
