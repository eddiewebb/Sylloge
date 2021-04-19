import app from 'flarum/app';
import {extend} from 'flarum/extend';
import Button from 'flarum/components/Button'
import Dropdown from 'flarum/components/Dropdown'
import SignUpModal from 'flarum/components/SignUpModal';
import SettingsPage from 'flarum/components/SettingsPage';
import FieldSet from 'flarum/components/FieldSet';
import ItemList from 'flarum/utils/ItemList';
import Stream from 'flarum/utils/Stream'

import User from 'flarum/models/User';
import Model from 'flarum/Model';

app.initializers.add('kyrne-sylloge', () => {
  User.prototype.digestEnabled = Model.attribute('digestEnabled');

  extend(SignUpModal.prototype, 'init', function () {
    this.getDigest = Stream(false);
  });

  extend(SignUpModal.prototype, 'fields', function (items) {
    items.add('kyrne-sylloge', m('.Form-group', m('.sylloge-checkbox', m('label.checkbox', [
      m('input', {
        type: 'checkbox',
        bidi: this.getDigest,
        disabled: this.loading,
      }),
      app.translator.trans('kyrne-sylloge.forum.signup.want_digest'),
    ]))));
  });

  extend(SignUpModal.prototype, 'submitData', function (data) {
    data.digestEnabled = this.getDigest();
  });

  extend(SettingsPage.prototype, 'settingsItems', items => {

    const digestItems = () => {
        const items = new ItemList();

        const options = [
          app.translator.trans('kyrne-sylloge.forum.settings.none'),
          app.translator.trans('kyrne-sylloge.forum.settings.daily'),
          app.translator.trans('kyrne-sylloge.forum.settings.weekly')
        ];

        items.add(
          'Digest',
          Dropdown.component({
            buttonClassName: 'Button',
            label: options[app.session.user.digestEnabled()],
            
          },options.map((value, i) => {
              const active = app.session.user.digestEnabled() === i;

              return Button.component({
                text: value,
                title:value,
                label: value,
                icon: active ? 'fas fa-check' : true,
                onclick: () => {
                  app.session.user.save({
                    digestEnabled: i
                  })
                },
                active,
              },value);
            })),
          -10
        );

        return items;
      };

      items.add(
        'digest',
        FieldSet.component({
          label: app.translator.trans('kyrne-sylloge.forum.settings.label'),
          className: 'Settings-account',
        },digestItems().toArray()), 1
      );
  });
});
