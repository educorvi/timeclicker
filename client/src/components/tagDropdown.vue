<template>
  <b-form-group :label="label" label-for="tags-with-dropdown">
    <b-form-tags id="tags-with-dropdown" v-model="value" no-outer-focus class="mb-2">
        <ul v-if="value.length > 0" class="list-inline d-inline-block mb-2">
          <li v-for="tag in value" :key="tag" class="list-inline-item">
            <b-form-tag
                @remove="removeTag(tag)"
                :title="tag.desc"
                variant="info"
            >{{ tag.desc }}
            </b-form-tag>
          </li>
        </ul>

        <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
          <template #button-content>
            <b-icon icon="tag-fill"></b-icon>
            Filter hinzufügen
          </template>
          <b-dropdown-form @submit.stop.prevent="() => {}">
            <b-form-group
                label="Suchen"
                label-for="tag-search-input"
                label-cols-md="auto"
                class="mb-0"
                label-size="sm"
                :description="searchDesc"
            >
              <b-form-input
                  v-model="search"
                  id="tag-search-input"
                  type="search"
                  size="sm"
                  autocomplete="off"
              ></b-form-input>
            </b-form-group>
          </b-dropdown-form>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item-button
              v-for="option in availableOptions"
              :key="option.id"
              @click="onOptionClick(option)"
          >
            {{ option.desc }}
          </b-dropdown-item-button>
          <b-dropdown-text v-if="availableOptions.length === 0">
            Keine Optionen verfügbar
          </b-dropdown-text>
        </b-dropdown>
    </b-form-tags>
  </b-form-group>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {Ref} from "vue";
import {
  BFormGroup,
  BFormInput,
  BFormTags,
  BFormTag,
  BDropdown,
  BDropdownForm,
  BDropdownItemButton,
  BDropdownText,
  BDropdownDivider
} from "bootstrap-vue";

export type TagOption = { desc: string, id: string };
const props = defineProps<{
  options: Array<TagOption>,
  label: string
}>()

const search = ref("");
const value: Ref<Array<TagOption>> = ref([])

const criteria = computed(() => {
  return search.value.trim().toLowerCase();
});

const availableOptions = computed(() => {
  const options = props.options.filter(opt => value.value.indexOf(opt) === -1)
  if (criteria.value) {
    // Show only options that match criteria
    return options.filter(opt => opt.desc.toLowerCase().indexOf(criteria.value) > -1);
  }
  // Show all options available
  return options
});

const searchDesc = computed(() => {
  if (criteria.value && availableOptions.value.length === 0) {
    return 'Keine Option stimmt mit der Suche überein '
  }
  return ''
});

function onOptionClick(option: TagOption) {
  value.value.push(option);
  search.value = ''
}

function removeTag(option: TagOption) {
  value.value.splice(value.value.indexOf(option), 1);
}

const emit = defineEmits<{ (e: 'change', newValue: Ref<Array<TagOption>>): void }>()

watch(value, () => {
  emit("change", value)
});
</script>

<style>
button {
  overflow: hidden;
  text-overflow: ellipsis !important;
}
</style>
