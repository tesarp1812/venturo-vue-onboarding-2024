<template>
    <VueDatePicker v-model="date" month-name-format="long" :range="{ maxRange: maxRange }" :enable-time-picker="enableTimePicker" />
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { format } from 'date-fns';

const props = defineProps({
    modelValue: {
        type: Array,
        default: null
    },
    enableTimePicker: {
        type: Boolean,
        default: false
    },
    dateFormat: {
        type: String,
        default: 'yyyy-MM-dd', 
    },
    timeFormat: {
        type: String,
        default: 'HH:mm',
    },
    maxRange: {
        type: Number,
        default: 10
    },
    defaultStartDate:{
        type: Number,
        default: 1
    }
});

const date = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

const formatDate = (dateObj, withTime = false) => {
    if (!(dateObj instanceof Date)) return '';
    const dateFormatted = format(dateObj, props.dateFormat);
    if (withTime) {
        const timeFormatted = format(dateObj, props.timeFormat);
        return `${dateFormatted} ${timeFormatted}`;
    }
    return dateFormatted;
};
const setStartOfMonth = () => {
    const now = new Date();
    const startDate = props.defaultStartDate
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), startDate);
    date.value = [startOfMonth, now]; 
}
onMounted(() => {
    setStartOfMonth();
})
watch(date, (val) => {
    if (val.length === 2 && val.every(date => date instanceof Date)) {
        const formattedDates = val.map(date => formatDate(date, props.enableTimePicker));
        emit('update:modelValue', formattedDates);
    }
});
</script>