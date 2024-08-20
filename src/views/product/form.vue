<template>
    <Layout>
        <span v-if="action_button">
            <PageHeader title="Edit product" pageTitle="Edit product" />
        </span>
        <span v-else>
            <PageHeader title="Add product" pageTitle="Add product" />
        </span>
        <BRow>
            <BCol lg="6" md="12">
                <BCard no-body>
                    <ImageCropper :aspectRatio="1 / 1" :uploadText="'Letakkan foto disini atau klik untuk mengunggah'"
                        @update:imageUrl="imageUrl = $event" @update:croppedImageUrl="croppedImageUrl = $event; photo = $event;
                        " />
                </BCard>
            </BCol>
            <BCol lg="6" md="12">
                <BCard>
                    <BForm class="form-horizontal" role="form">
                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-name">Nama</label>
                            <BCol md="10">
                                <input class="form-control" :class="{
                                    'is-invalid': !!(errorList && errorList.name),
                                }" id="form-name" placeholder="Masukkan Nama Product" v-model="formModel.name" />
                                <template v-if="!!(errorList && errorList.name)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.name" :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>
                        <BRow class="mb-3">
                            <BCol md="10">
                                <BRow>
                                    <BCol>
                                        <label class="col-md-12 col-form-label" for="form-name">Kategori</label>
                                        <BFormGroup>
                                            <BFormRadio v-for="cat in category" :key="cat"
                                                v-model="formModel.product_category_id" class="mb-3 me-2"
                                                :value="cat.id" plain @change="updateCategory(cat)">{{ cat.name }}
                                            </BFormRadio>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol>
                                        <label class="col-md-12 col-form-label" for="form-name">Status</label>
                                        <BFormGroup>
                                            <BFormRadio v-model="formModel.is_available" class="mb-3 me-2" value="1"
                                                plain>Available
                                            </BFormRadio>
                                            <BFormRadio v-model="formModel.is_available" class="mb-3 me-2" value="0"
                                                plain>Empty
                                            </BFormRadio>
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                            </BCol>
                        </BRow>
                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-name">Harga</label>
                            <BCol md="10">
                                <input type="number" class="form-control" :class="{
                                    'is-invalid': !!(errorList && errorList.price),
                                }" id="form-name" placeholder="Masukkan Harga Product" v-model="formModel.price" />
                                <template v-if="!!(errorList && errorList.price)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.price" :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>
                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-name">Deskripsi</label>
                            <BCol md="10">
                                <input class="form-control" :class="{
                                    'is-invalid': !!(errorList && errorList.description),
                                }" id="form-name" placeholder="Masukkan Deskripsi Product"
                                    v-model="formModel.description" />
                                <template v-if="!!(errorList && errorList.description)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.description"
                                        :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>
                    </BForm>
                </BCard>
            </BCol>
            <BCol lg="12" md="12">
                <BCard>
                    <div class="table-responsive">
                        <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="user-list">
                            <BThead>
                                <BTr>
                                    <BTh scope="col">
                                        <span class="d-flex justify-content-center">
                                            <BButton class="btn btn-sm btn-soft-info" @click="addDetail"><i
                                                    class="mdi mdi-plus"></i>
                                            </BButton>
                                        </span>
                                    </BTh>
                                    <BTh scope="col">Deskripsi</BTh>
                                    <BTh scope="col">Tipe</BTh>
                                    <BTh scope="col">Harga</BTh>
                                </BTr>
                            </BThead>
                            <BTbody>
                                <BTr v-for="(detail, i) in details" :key="i">
                                    <BTd>
                                        <BButton @click="removeRow(index)"><i class="mdi mdi-minus"></i></BButton>
                                    </BTd>
                                    <BTd>
                                        <input class="form-control" v-model="detail.description" />
                                    </BTd>
                                    <BTd>
                                        <input class="form-control" v-model="detail.type" />
                                    </BTd>
                                    <BTd>
                                        <input class="form-control" v-model="detail.price" />
                                    </BTd>
                                </BTr>
                            </BTbody>
                        </BTableSimple>
                    </div>
                    <div class="d-flex justify-content-center">
                        <span v-if="action_button">
                            <BButton @click="addProduct">Update</BButton>
                        </span>
                        <span v-else>
                            <BButton @click="addProduct">Add</BButton>
                        </span>
                    </div>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>
<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useProductCategoryStore, useProductStore } from "../../state/pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import ImageCropper from "@/components/widgets/cropper";
import { useRouter } from 'vue-router'; // Import route

const categoryStore = useProductCategoryStore()
const productStore = useProductStore()
const details = reactive([])
const imageUrl = ref("");
const croppedImageUrl = ref("");
const photo = ref()
const formModel = reactive({
    name: "",
    product_category_id: '',
    is_available: '1',
    price: '',
    description: '',
    product_category_name: '',
    photo: '',
    details: details
});
const action_button = ref();
const router = useRouter(); // Initialize router

const action = computed(() => productStore.formAction.action);


watch(photo, async (e) => {
    console.log(e);
    const x = base64ToFile(e, 'image.jpeg');
    console.log(x);
    formModel.photo = x
})
function base64ToFile(base64, fileName) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}
const watchAction = () => {
    if (action.value === 'edit') {
        console.log('edit');
        action_button.value = 'Change';
    } else {
        console.log('add');
    }
};
const category = computed(() => categoryStore.categories)
const getSales = async () => {
    await categoryStore.getCategories()
}
const updateCategory = (selectedCategory) => {
    formModel.product_category_id = selectedCategory.id;
    formModel.product_category_name = selectedCategory.name;
};
const addDetail = () => {
    details.push({
        description: '',
        type: '',
        price: '',
        is_added: true
    })
}
// const addProduct = () => {
//     console.log(formModel)
//     productStore.addProduct(formModel)
// }
// Function to handle product addition or update
const addProduct = async () => {
    try {
        if (action_button.value === 'Change') {
            await productStore.updateProduct(formModel); // Update product
            alert('Product updated successfully!'); // Show success message
        } else {
            await productStore.addProduct(formModel); // Add product
            alert('Product added successfully!'); // Show success message
        }
        router.push('/product'); // Redirect to /product page
    } catch (error) {
        console.error(error);
        alert('An error occurred while saving the product.'); // Show error message
    }
};
const removeRow = (index) => {
    details.splice(index, 1);
}
onMounted(async () => {
    await getSales()
    watchAction()
})
</script>