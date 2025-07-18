import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Account, Mark } from '@/types';

/**
 * Pinia store для управления учётными записями.
 * Хранит список аккаунтов, поддерживает добавление, обновление, удаление и получение записей.
 * Все изменения автоматически сохраняются в localStorage.
 */
export const useAccountStore = defineStore('accountStore', () => {
    /**
     * Реактивный массив учётных записей.
     */
    const accounts = ref<Account[]>([]);

    /**
     * Инициализация аккаунтов из localStorage или создание первого аккаунта по умолчанию.
     */
    const savedAccounts = localStorage.getItem('accounts');
    accounts.value = savedAccounts
        ? JSON.parse(savedAccounts)
        : [{
            id: crypto.randomUUID(),
            mark: [] as Mark[],
            type: 0,
            login: '',
            password: '',
        }];

    /**
     * Добавляет новую учётную запись.
     * @param data - объект Account
     */
    function addAccount(data: Account): void {
        accounts.value.push(data);
    }

    /**
     * Обновляет существующую учётную запись по id.
     * @param id - идентификатор аккаунта
     * @param data - новые данные аккаунта
     */
    function setAccount(id: string, data: Account): void {
        const idx = accounts.value.findIndex(acc => acc.id === id);
        if (idx !== -1)
            accounts.value[idx] = { ...data };
    }

    /**
     * Возвращает массив всех учётных записей.
     */
    function getAccount(): Account[] {
        return accounts.value;
    }

    /**
     * Удаляет учётную запись по id.
     * @param id - идентификатор аккаунта
     */
    function removeAccount(id: string): void {
        const idx = accounts.value.findIndex(acc => acc.id === id);
        if (idx !== -1)
            accounts.value.splice(idx, 1);
    }

    /**
     * Возвращает количество учётных записей.
     */
    function getCount(): number {
        return accounts.value.length;
    }

    /**
     * Автоматически сохраняет изменения аккаунтов в localStorage.
     */
    watch(accounts, (newAccounts) => {
        localStorage.setItem('accounts', JSON.stringify(newAccounts));
    }, { deep: true });

    return {
        accounts,
        addAccount,
        setAccount,
        getAccount,
        removeAccount,
        getCount
    };
});