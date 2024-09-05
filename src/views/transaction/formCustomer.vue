<template>
    <BCol cols="12">
      <ImageCropper
        :aspectRatio="1 / 1"
        :uploadText="'Letakkan foto disini atau klik untuk mengunggah'"
        :imageUrl="imageUrl"
        @update:imageUrl="imageUrl = $event"
        @update:croppedImageUrl="
          croppedImageUrl = $event;
          formModel.photo = $event;
        "
      />
    </BCol>
    <BCol cols="12" class="mt-4">
      <BForm class="form-horizontal" role="form">
        <BRow class="mb-3">
          <label class="col-md-2 col-form-label" for="form-name">Name</label>
          <BCol md="10">
            <input
              class="form-control"
              :class="{'is-invalid': !!(errorList && errorList.name)}"
              id="form-name"
              placeholder="Masukkan Nama"
              v-model="formModel.name"
            />
            <template v-if="!!(errorList && errorList.name)">
              <div class="invalid-feedback" v-for="(err, index) in errorList.name" :key="index">
                <span>{{ err }}</span>
              </div>
            </template>
          </BCol>
        </BRow>
        <BRow class="mb-3">
          <label for="form-email" class="col-md-2 col-form-label">Email</label>
          <BCol md="10">
            <input
              class="form-control"
              :class="{'is-invalid': !!(errorList && errorList.email)}"
              id="form-email"
              type="email"
              placeholder="Masukkan email"
              v-model="formModel.email"
            />
            <template v-if="!!(errorList && errorList.email)">
              <div class="invalid-feedback" v-for="(err, index) in errorList.email" :key="index">
                <span>{{ err }}</span>
              </div>
            </template>
          </BCol>
        </BRow>
        <BRow class="mb-3">
          <label for="form-password" class="col-md-2 col-form-label">Password</label>
          <BCol md="10">
            <input
              class="form-control"
              :class="{'is-invalid': !!(errorList && errorList.password)}"
              id="form-password"
              type="password"
              placeholder="Masukkan password"
              v-model="formModel.password"
            />
            <template v-if="!!(errorList && errorList.password)">
              <div class="invalid-feedback" v-for="(err, index) in errorList.password" :key="index">
                <span>{{ err }}</span>
              </div>
            </template>
          </BCol>
        </BRow>
        <BRow>
          <BCol md="10" offset="2">
            <BButton variant="primary" @click="saveCustomer">Save</BButton>
          </BCol>
        </BRow>
      </BForm>
    </BCol>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted, defineProps, defineEmits } from 'vue';
  import { useCustomerStore } from '@/state/pinia'; // Import your Pinia store
  import ImageCropper from '@/components/widgets/cropper';
  import { showSuccessToast, showErrorToast } from '@/helpers/alert.js';
  
  // Define props for component
  const props = defineProps({
    customer: Object
  });
  const emit = defineEmits(['save']);
  
  const customerStore = useCustomerStore();
  
  const imageUrl = ref('');
  const croppedImageUrl = ref('');
  const formModel = reactive({
    id: '',
    name: '',
    email: '',
    password: '',
    photo: ''
  });
  
  const errorList = computed(() => customerStore.response?.list || {});
  
  const saveCustomer = async () => {
    try {
      await customerStore.updateCustomer(formModel);
      if (customerStore.response.status !== 200) {
        showErrorToast('Failed to update customer', customerStore.response.message || '');
      } else {
        showSuccessToast('Customer updated successfully!');
        emit('save', formModel); // Emit the save event with updated customer data
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to update customer', 'An unexpected error occurred.');
    }
  };
  
  // Initialize form data when the component is mounted
  onMounted(() => {
    if (props.customer) {
      formModel.id = props.customer.id;
      formModel.name = props.customer.name;
      formModel.email = props.customer.email;
      formModel.password = ''; // Password should be handled securely
      formModel.photo = props.customer.photo;
      imageUrl.value = props.customer.photo;
    }
  });
  </script>
  
  <style scoped>
  /* Add your scoped styles here */
  </style>
  