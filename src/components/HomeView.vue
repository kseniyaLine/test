<template>
  <div>
    <NButton type="primary" @click="showModal">Добавить</NButton>

    <NModal v-model:show="isModalOpen" title="Добавить профиль" :closable="false">
      <n-card style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <NForm :model="formData" label-placement="top" :rules="rules">
          <NFormItem label="Имя" prop="firstName">
            <NInput v-model:value="formData.firstName" />
          </NFormItem>
          <NFormItem label="Фамилия" prop="lastName">
            <NInput v-model:value="formData.lastName" />
          </NFormItem>
          <NFormItem label="Возраст" prop="age">
            <NInputNumber v-model:value="formData.age" />
          </NFormItem>
        </NForm>
        <template #footer>
          <NButton type="primary" @click="submitForm">Добавить</NButton>
          <NButton @click="closeModal">Отмена</NButton>
          <NFormItem :show-message="false">
            <!--div v-if="errors.length > 0" :status="'error'">{{ errors[0] }}</div-->
          </NFormItem>
        </template>
      </n-card>
    </NModal>

    <NDataTable v-if="!loading" :columns="columns" :data="profiles" />
    <NSpin v-if="loading" size="large" />
  </div>
</template>

<script lang="ts">
import { defineComponent, h, onMounted, ref } from "vue";
import { loadProfiles } from "@/database";
import {
  NDataTable,
  NSpin,
  NButton,
  DataTableColumns,
  NModal,
  FormInst,
  NForm,
  NInput,
  NFormItem,
  NInputNumber,
  NCard,
} from "naive-ui";
import { ColumnType, Profile } from "@/types";

export default defineComponent({
  name: "HomeView",
  components: {
    NDataTable,
    NSpin,
    NButton,
    NModal,
    NCard,
    NForm,
    NInput,
    NInputNumber,
    NFormItem,
  },
  setup() {
    const profiles = ref<Profile[]>([]);
    const loading = ref<boolean>(true);
    const isModalOpen = ref<boolean>(false);
    const formRef = ref<FormInst | null>(null);

    const getData = async () => {
      try {
        profiles.value = await loadProfiles();
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const deleteProfile = (uid: string) => {
      profiles.value = profiles.value.filter((el) => el.uid !== uid);
    };

    onMounted(() => {
      getData();
    });

    const createColumns = (): DataTableColumns<ColumnType> => {
      return [
        {
          title: "UID",
          key: "uid",
        },
        {
          title: "Имя",
          key: "firstName",
        },
        {
          title: "Фамилия",
          key: "lastName",
        },
        {
          title: "Возраст",
          key: "age",
        },
        {
          title: "Удалить",
          key: "delete",
          render(row) {
            return h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: "small",
                onClick: () => deleteProfile(row.uid),
              },
              { default: () => "Удалить" }
            );
          },
        },
      ];
    };

    const showModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const formData = ref<Partial<Profile>>({ firstName: "", lastName: "", age: undefined });
    const rules = {
      firstName: [{ required: true, message: "Введите имя", trigger: "blur" }],
      lastName: [{ required: true, message: "Введите фамилию", trigger: "blur" }],
      age: [{ required: true, message: "Введите возраст", trigger: "blur" }],
    };

    const submitForm = () => {
      const isValid = formData.value.firstName && formData.value.lastName && formData.value.age;
      if (!isValid) return;

      const newProfile: Profile = {
        uid: Math.random().toString(36),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        firstName: formData.value.firstName!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        lastName: formData.value.lastName!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        age: formData.value.age!,
      };
      profiles.value.push(newProfile);
      closeModal();

      formData.value = { firstName: "", lastName: "", age: undefined };
    };

    return {
      profiles,
      loading,
      isModalOpen,
      formData,
      rules,
      deleteProfile,
      columns: createColumns(),
      showModal,
      closeModal,
      submitForm,
      formRef,
    };
  },
});
</script>

<style scoped></style>
