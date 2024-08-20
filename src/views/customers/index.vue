<template>
    <Layout>
        <PageHeader title="Customers List" pageTitle="Customers" />


        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom">
                        <div class="d-flex align-items-center">
                            <BCardTitle class="mb-0 flex-grow-1">Customers List</BCardTitle>
                            <div class="flex-shrink-0">
                                <BButton class="btn btn-primary me-1" @click="openFormModal('add', null)">Add Customers
                                </BButton>
                                <BModal v-model="isOpenForm" size="lg" id="modal-standard" :title="modalTitle"
                                    title-class="font-18" ok-title="Simpan" @ok="saveCustomer" @hide.prevent
                                    @cancel="isOpenForm = false" @close="isOpenForm = false">
                                    <BRow>
                                        <BCol cols="12">
                                            <ImageCropper :aspectRatio="1 / 1"
                                                :uploadText="'Letakkan foto disini atau klik untuk mengunggah'"
                                                @update:imageUrl="imageUrl = $event" @update:croppedImageUrl="
                                                    croppedImageUrl = $event;
                                                formModel.photo = $event;
                                                " />
                                        </BCol>
                                        <BCol cols="12" class="mt-4">
                                            <BForm class="form-horizontal" role="form">
                                                <BRow class="mb-3">
                                                    <label class="col-md-2 col-form-label" for="form-name">Name</label>
                                                    <BCol md="10">
                                                        <input class="form-control" :class="{
                                                            'is-invalid': !!(errorList && errorList.name),
                                                        }" id="form-name" placeholder="Masukkan Nama"
                                                            v-model="formModel.name" />
                                                        <template v-if="!!(errorList && errorList.name)">
                                                            <div class="invalid-feedback"
                                                                v-for="(err, index) in errorList.name" :key="index">
                                                                <span>{{ err }}</span>
                                                            </div>
                                                        </template>
                                                    </BCol>
                                                </BRow>
                                                <BRow class="mb-3">
                                                    <label for="form-email"
                                                        class="col-md-2 col-form-label">Email</label>
                                                    <BCol md="10">
                                                        <input class="form-control" :class="{
                                                            'is-invalid': !!(errorList && errorList.email),
                                                        }" id="form-email" type="email" placeholder="Masukkan email"
                                                            v-model="formModel.email" />


                                                        <template v-if="!!(errorList && errorList.email)">
                                                            <div class="invalid-feedback"
                                                                v-for="(err, index) in errorList.email" :key="index">
                                                                <span>{{ err }}</span>
                                                            </div>
                                                        </template>
                                                    </BCol>
                                                </BRow>
                                                <BRow class="mb-3">
                                                    <label for="form-password"
                                                        class="col-md-2 col-form-label">Password</label>
                                                    <BCol md="10">
                                                        <input class="form-control" :class="{
                                                            'is-invalid': !!(
                                                                errorList && errorList.password
                                                            ),
                                                        }" id="form-password" type="password"
                                                            placeholder="Masukkan password"
                                                            v-model="formModel.password" />


                                                        <template v-if="!!(errorList && errorList.password)">
                                                            <div class="invalid-feedback"
                                                                v-for="(err, index) in errorList.password" :key="index">
                                                                <span>{{ err }}</span>
                                                            </div>
                                                        </template>
                                                    </BCol>
                                                </BRow>
                                            </BForm>
                                        </BCol>
                                    </BRow>
                                </BModal>
                                <BLink href="#!" class="btn btn-light me-1" @click="getCustomers"><i
                                        class="mdi mdi-refresh"></i></BLink>
                            </div>
                        </div>
                    </BCardBody>


                    <BCardBody class="border-bottom">
                        <BRow class="g-3">
                            <BCol xxl="10" lg="8">
                                <BFormInput type="text" class="form-control search" placeholder="Search for ..."
                                    v-model="customerStore.searchQuery" />
                            </BCol>


                            <BCol xxl="2" lg="4">
                                <BButton variant="soft-secondary" @click="searchData" class="w-100">
                                    <i class="mdi mdi-magnify align-middle"></i>
                                    Cari
                                </BButton>
                            </BCol>
                        </BRow>
                    </BCardBody>


                    <BCardBody>
                        <div class="table-responsive">
                            <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="customer-list">
                                <BThead>
                                    <BTr>
                                        <BTh scope="col">Name</BTh>
                                        <BTh scope="col">Email</BTh>
                                        <BTh scope="col"></BTh>
                                    </BTr>
                                </BThead>


                                <BTbody>
                                    <BTr v-for="customer in rows" :key="customer.id">
                                        <BTd> {{ customer.name }} </BTd>
                                        <BTd> {{ customer.email }} </BTd>
                                        <BTd>
                                            <ul class="list-unstyled hstack gap-1 mb-0 justify-content-end">
                                                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit"
                                                    @click="openFormModal('edit', customer.id)">
                                                    <BButton class="btn btn-sm btn-soft-info"><i
                                                            class="mdi mdi-pencil-outline"></i>
                                                    </BButton>
                                                </li>
                                                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete"
                                                    @click="deleteCustomer(customer.id)">
                                                    <BButton data-bs-toggle="modal" class="btn btn-sm btn-soft-danger">
                                                        <i class="mdi mdi-delete-outline"></i>
                                                    </BButton>
                                                </li>
                                            </ul>
                                        </BTd>
                                    </BTr>
                                </BTbody>
                            </BTableSimple>
                        </div>

                        <Pagination :currentPage="customerStore.current" :totalRows="customerStore.totalData"
                            :perPage="customerStore.perpage" @update:currentPage="updatePage" />

                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>


<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// import Pagination from "@/components/widgets/pagination";
import { useCustomerStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress"; // Import custom progress function


const { startProgress, finishProgress, failProgress } = useProgress();
import ImageCropper from "@/components/widgets/cropper";
import {
    showSuccessToast,
    showErrorToast,
    showDeleteConfirmationDialog,
} from "@/helpers/alert.js";


// import useVuelidate from "@vuelidate/core";


var rows = ref([]);
var isOpenForm = ref(false);
var modalTitle = ref(false);
const customerStore = useCustomerStore();
const getCustomers = async () => {
    startProgress();
    await customerStore.getCustomers();
    if (customerStore.customers) {
        finishProgress();
        rows.value = customerStore.customers || [];
    } else {
        failProgress();
        rows.value = [];
    }
};
const updatePage = async (page) => {
    await customerStore.changePage(page);
    await getCustomers();
};


const searchData = async () => {
    await customerStore.changePage(1);
    await getCustomers();
};


const imageUrl = ref("");
const croppedImageUrl = ref("");
const formModel = reactive({
    id: "",
    name: "",
    email: "",
    password: "",
    photo: "",
});


const openFormModal = (mode, id = null) => {
    isOpenForm.value = true;
    if (mode === "edit" && id) {
        const customer = rows.value.find((customer) => customer.id === id);
        if (customer) {
            formModel.id = customer.id;
            formModel.name = customer.name;
            formModel.email = customer.email;
            formModel.password = ""; // Password should be handled securely
            formModel.photo = customer.photo;
            modalTitle.value = "Ubah Customer";
            imageUrl.value = customer.photo;
        }
    } else {
        formModel.id = "";
        formModel.name = "";
        formModel.email = "";
        formModel.password = "";
        formModel.photo = "";
        modalTitle.value = "Tambah Customer";
    }
};


const statusCode = computed(() => customerStore.response.status);
const errorList = computed(() => customerStore.response?.list || {});
const errorMessage = computed(() => customerStore.response?.message || "");
const saveCustomer = async () => {
    try {
        if (formModel.id) {
            await customerStore.updateCustomer(formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to add customer", errorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCustomers(); // Refresh the customer list after deletion
                showSuccessToast("Customer Edited successfully!");
            }
        } else {
            await customerStore.addCustomers(formModel);


            if (statusCode.value != 200) {
                showErrorToast("Failed to add customer", errorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCustomers(); // Refresh the customer list after deletion
                showSuccessToast("Customer added successfully!");
            }
        }
    } catch (error) {
        console.error(error);
        showErrorToast("Failed to add customer", errorMessage.value);
    }
};
const deleteCustomer = async (id) => {
    // Tampilkan dialog konfirmasi
    const confirmed = await showDeleteConfirmationDialog();


    // Jika konfirmasi
    if (confirmed) {
        try {
            await customerStore.deleteCustomer(id);
            showSuccessToast("Customer berhasil dihapus");
            await getCustomers(); // Refresh the customer list after deletion
        } catch (error) {
            showErrorToast("Terjadi kesalahan saat menghapus customer");
        }
    }
};


onMounted(async () => {
    await getCustomers();
});
</script>