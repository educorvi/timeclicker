import { en } from '@/i18n/messages/english';
import { de } from '@/i18n/messages/german';

export default {
    en,
    de,
};

export interface Localization {
    months: string[];
    login_prompt: string;
    developed_by: string;
    libraries_modal_header: string;
    total_time: string;
    add_filter: string;
    no_option_fits_this_search: string;
    new_entry: string;
    overview_for: string;
    no_entries: string;
    delete_entry: string;
    edit_entry: string;
    delete_prompt: string;
    beg_of_entry_bef_end: string;
    please_select_task: string;
    reload_to_activate: string;
    orga_ui: string;
    about: string;
    apidocs: string;
    load_swaggerui: string;
    show_note: string;
    hide_note: string;
    errors: {
        saving_failed: string;
        act_failed: string;
        tasks_failed: string;
        users_failed: string;
        token_refresh: string;
        auth_endpoint: string;
    };
    error: string;
    library: string;
    filter: string;
    task: string;
    user: string;
    total: string;
    date: string;
    note: string;
    private_note: string;
    activity: string;
    duration: string;
    language: string;
    break: string;
    download: string;
    search: string;
    edit: string;
    delete: string;
    cancel: string;
    logout: string;
    settings: string;
    save: string;
    mandatory: string;
    from: string;
    to: string;
    languages: {
        de: string;
        en: string;
    };
    working_hour: string;
}
