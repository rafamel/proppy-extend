import React from 'react';
import viewCompose from './view-compose';
import { symbol } from '../../instance-extend';

export default function getAttach(Component) {
  return class ProppyExtendAttach extends React.Component {
    render() {
      const { [symbol]: ppe, ...other } = this.props;

      if (!this.Component) {
        const views = ppe.views;
        this.Component =
          views && views.length ? viewCompose(...views)(Component) : Component;
      }
      const AnsComponent = this.Component;
      return <AnsComponent {...other} />;
    }
  };
}
