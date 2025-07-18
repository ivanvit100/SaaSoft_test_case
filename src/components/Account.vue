<script setup lang="ts">
import { AccountType, type Account, type Mark } from '@/types';
import { Delete } from '@element-plus/icons-vue';
import { ref, watch, reactive } from 'vue';
import { useAccountStore } from '~/stores/accountStore';

const props = defineProps<{
    account: Account;
}>();

const marks = ref(
    Array.isArray(props.account.mark)
        ? props.account.mark.map((m: Mark) => m.text).join('; ')
        : ''
);

/**
 * Состояние ошибок для валидации полей.
 * login: ошибка логина
 * password: ошибка пароля
 * mark: ошибка длины метки
 */
const error = ref({
    login: false,
    password: false,
    mark: false
});

const accountData = reactive({
    mark: props.account.mark,
    type: props.account.type,
    login: props.account.login,
    password: props.account.password
});

const accountStore = useAccountStore();

function deleteAccount(): void {
    accountStore.removeAccount(props.account.id);
}

/**
 * Валидация массива меток.
 * @param marks - массив объектов Mark
 * @returns true, если есть хотя бы одна метка длиной > 50 символов
 */
function hasLongMark(marks: Mark[]): boolean {
    return marks.some(m => m.text.length > 50);
}

/**
 * Синхронизирует локальные изменения с глобальным объектом аккаунта и стором.
 * Выполняет валидацию данных.
 * @param newData - новые данные аккаунта
 */
function syncData(newData: typeof accountData): void {
    error.value = {
        login: false,
        password: false,
        mark: false
    };

    if (!props.account) return;

    if (!newData.login || newData.login.trim().length === 0 || newData.login.length > 100)
        error.value.login = true;

    if (newData.type === AccountType.Local) {
        if (!newData.password || newData.password.trim().length === 0 || newData.password.length > 100)
            error.value.password = true;
    }

    if (hasLongMark(newData.mark))
        error.value.mark = true;

    if (error.value.login || error.value.password || error.value.mark) return;

    props.account.type = newData.type;
    props.account.login = newData.login.trim();
    props.account.password = newData.type === AccountType.LDAP ? null : newData.password?.trim() ?? '';
    props.account.mark = newData.mark;

    accountStore.setAccount(props.account.id, { ...props.account });
}

watch(accountData, (newData) => {
    syncData(newData);
});

watch(marks, (newMarks) => {
    const parsedMarks = newMarks
        .split(';')
        .map(m => m.trim())
        .filter(m => m.length > 0)
        .map(text => ({ text } as Mark));
    accountData.mark = parsedMarks;
    error.value.mark = hasLongMark(parsedMarks);
});

watch(() => accountData.type, (newType) => {
    props.account.type = newType;
    if (newType === AccountType.LDAP) {
        accountData.password = '';
        props.account.password = null;
    }
    syncData(accountData);
});
</script>

<template>
<div class="account">
    <el-input
        v-model="marks"
        style="width: 240px"
        placeholder="Метка1; Метка2; ..."
        autosize
        type="textarea"
        :class="{ 'error-input': error.mark }"
    />
    <el-select
        v-model="accountData.type"
        style="width: 240px"
        placeholder="Тип записи"
    >
        <el-option
            key="0"
            label="Локальная"
            :value="AccountType.Local"
        />
        <el-option
            key="1"
            label="LDAP"
            :value="AccountType.LDAP"
        />
    </el-select>
    <el-input
        v-model="accountData.login"
        style="width: 240px"
        :class="{'ldap-input': accountData.type === AccountType.LDAP, 'error-input' : error.login}"
        placeholder="Логин"
    />
    <el-input
        v-if="accountData.type === AccountType.Local"
        v-model="accountData.password"
        :class="{'error-input' : error.password}"
        style="width: 240px"
        placeholder="Пароль"
        type="password"
        show-password
    />
    <el-button type="primary" @click="deleteAccount">
      Удалить <el-icon class="el-icon--right"><Delete /></el-icon>
    </el-button>
</div>
</template>

<style>
.ldap-input {
    width: calc(480px + 1rem) !important;
}

.error-input .el-input__wrapper, .error-input .el-textarea__inner {
    box-shadow: 0 0 0 1px #ff4154 inset;
}
</style>