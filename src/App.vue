<script setup lang="ts">
/**
 * Главный компонент приложения.
 * Отвечает за отображение списка учётных записей и добавление новых.
 */

import { AccountType } from '@/types';
import { Plus, QuestionFilled } from '@element-plus/icons-vue';
import { useAccountStore } from '~/stores/accountStore';
import Account from './components/Account.vue';

const accountStore = useAccountStore();

/**
 * Добавляет новую учётную запись с начальными значениями.
 */
function addNewAccount(): void {
  accountStore.addAccount({
    id: crypto.randomUUID(),
    mark: [],
    type: AccountType.Local,
    login: '',
    password: '',
  });
}
</script>

<template>
  <header>
    <h1>Учётные записи</h1>
    <el-button plain :icon="Plus" size="large" @click="addNewAccount()" />
  </header>
  <main>
    <span class="info"><el-icon><QuestionFilled /></el-icon> Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
    <div class="account">
      <span class="account_title">Метки</span>
      <span class="account_title">Тип записи</span>
      <span class="account_title">Логин</span>
      <span class="account_title">Пароль</span>
    </div>
    <Account v-for="account in accountStore.getAccount()" :key="account.id" :account="account" />
  </main>
</template>

<style>
body {
  margin: .5rem 1.5rem;
}

header {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: last baseline;
  gap: 1.5rem;
}

.el-button--large {
  padding: 12px 14px;
}

.info {
  position: relative;
  display: block;
  width: calc(100% - 30px);
  padding: 5px 15px;
  margin: .5rem 0 2rem;
  color: #444;
  background-color: #2e89ff36;
}

.info .el-icon {
  transform: translate(0, 2px);
}

.info .el-icon svg {
  color: #444;
}

.account {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 1rem;
}

.account_title {
  font-weight: 300;
  font-size: .9rem;
  width: 240px;
  color: #888;
}

</style>
