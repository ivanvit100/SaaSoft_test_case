import type { ViteSSGContext } from 'vite-ssg';

export type UserModule = (ctx: ViteSSGContext) => void;

/**
 * Интерфейс учётной записи.
 */
export interface Account {
    /** Уникальный идентификатор аккаунта */
    id: string;
    /** Массив меток (объектов с текстом) */
    mark: Mark[];
    /** Тип аккаунта (локальный или LDAP) */
    type: AccountType;
    /** Логин пользователя */
    login: string;
    /** Пароль пользователя (null для LDAP) */
    password: string | null;
}

/**
 * Перечисление типов учётных записей.
 */
export enum AccountType {
    Local, // Локальная учётная запись
    LDAP   // LDAP учётная запись
}

/**
 * Интерфейс метки для аккаунта.
 */
export interface Mark {
    /** Текст метки */
    text: string;
}