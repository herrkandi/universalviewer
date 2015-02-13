import baseExtension = require("../uv-shared-module/baseExtension");
import extension = require("../../extensions/uv-seadragon-extension/extension");
import shell = require("../uv-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../uv-shared-module/dialogue");
import version = require("../../_Version");

export class SettingsDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $scroll: JQuery;
    $version: JQuery;
    $locale: JQuery;
    $localeLabel: JQuery;
    $localeDropDown: JQuery;

    static SHOW_SETTINGS_DIALOGUE: string = 'onShowSettingsDialogue';
    static HIDE_SETTINGS_DIALOGUE: string = 'onHideSettingsDialogue';
    static UPDATE_SETTINGS: string = 'onUpdateSettings';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('settingsDialogue');

        super.create();

        $.subscribe(SettingsDialogue.SHOW_SETTINGS_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(SettingsDialogue.HIDE_SETTINGS_DIALOGUE, (e) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$version = $('<div class="version"></div>');
        this.$content.append(this.$version);

        this.$locale = $('<div class="setting locale"></div>');
        this.$scroll.append(this.$locale);

            this.$localeLabel = $('<label for="locale">' + this.content.locale + '</label>');
            this.$locale.append(this.$localeLabel);

            this.$localeDropDown = $('<select id="locale"></select>');
            this.$locale.append(this.$localeDropDown);

        // initialise ui.
        this.$title.text(this.content.title);

        this.$version.text("v" + version.Version);

        var locales = this.provider.getLocales();

        for (var i = 0; i < locales.length; i++){
            var locale = locales[i];
            this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
        }

        this.$localeDropDown.val(this.provider.locale);

        this.$localeDropDown.change(() => {
            var settings: ISettings = this.getSettings();
            settings.locale = this.$localeDropDown.val();
            this.updateSettings(settings);
        });

        this.$element.hide();
    }

    getSettings(): ISettings {
        return this.provider.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.provider.updateSettings(settings);

        $.publish(SettingsDialogue.UPDATE_SETTINGS, [settings]);
    }

    resize(): void {
        super.resize();

    }
}