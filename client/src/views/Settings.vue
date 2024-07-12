<template>
    <div id="settings">
        <div id="settings-content">
            <h1 class="mb-3">{{ t('settings') }}</h1>
            <b-input-group :prepend="t('language')">
                <b-form-select
                    :options="
                        Object.keys(messages).map((l) => {
                            return { value: l, text: t('languages.' + l) };
                        })
                    "
                    v-model="lang"
                ></b-form-select>
            </b-input-group>
            <b-form-valid-feedback :state="langChanged"
                >{{ t('reload_to_activate') }}
            </b-form-valid-feedback>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
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
#settings-content {
    width: 500px;
    max-width: 100%;
}

#settings {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>
