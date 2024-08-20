import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { useCustomerStore } from "./pinia/customer";
import { createPinia } from "pinia";
import { useProductCategoryStore } from "./pinia/product-category";
import { useProductStore } from "./pinia/product";

const pinia = createPinia();
export default pinia;

export { useLayoutStore, useAuthStore, useUserStore, useCustomerStore, useProductCategoryStore, useProductStore };
