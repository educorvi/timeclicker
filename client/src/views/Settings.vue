<template>
    <div id="settings">
        <h1 class="mb-3">{{ t('settings') }}</h1>
        <b-input-group :prepend="t('language')">
            <b-form-select
                :options="Object.keys(messages)"
                v-model="lang"
            ></b-form-select>
        </b-input-group>
        <b-form-valid-feedback :state="langChanged">{{
            t('reload_to_activate')
        }}</b-form-valid-feedback>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { BInputGroup, BFormSelect, BFormValidFeedback } from 'bootstrap-vue';
import messages from '@/i18n/messages';
import { ref, watch } from 'vue';

const { t } = useI18n();

const lang = ref(localStorage.getItem('language'));

const langChanged = ref(false);

watch(lang, (v) => {
    localStorage.setItem('language', v);
    langChanged.value = true;
});
</script>

<style scoped>
#settings {
    width: 100%;
    max-width: 600px;
}
</style>
