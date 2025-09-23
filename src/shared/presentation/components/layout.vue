<script setup>
  import {useI18n} from "vue-i18n";
  import {ref} from "vue";
  import {Drawer as PvDrawer} from "primevue";
  import FooterContent from "./footer-content.vue";

  const { t } = useI18n();

  const drawer = ref(false);
  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };

  const items = [
    { label: 'option.home', to: '/home' },
    { label: 'option.about', to: '/about' }
  ];
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="header">
    <pv-toolbar class="bg-primary">
      <template #start>
        <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
        <h3>ACME Learning Center</h3>
      </template>
      <template #end>
        <div class="flex-column mr-3">
          <pv-button v-for="items in items" :key="item.label" as-child v-slot="slotProps">
            <router-link :to="item.to" :class="slotProps['class']">{{ t(item.label)}}</router-link>
          </pv-button>
        </div>
      </template>
    </pv-toolbar>
    <pv-drawer v-model:visible="drawer"/>
  </div>
  <div class="main-content">
    <router-view/>
  </div>
  <div class="footer">
    <footer-content/>
  </div>
</template>

<style scoped>
.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.main-content {
  margin-top: 60px;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
}
</style>