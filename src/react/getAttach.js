import React from 'react';
import { symbol } from '../instance-extend';

export default function getAttach(Component) {
  return class ProppyExtendAttach extends React.Component {
    render() {
      const { [symbol]: ppe, ...other } = this.props;

      if (!this.Component) {
        this.Component = Component;
        const views = ppe.views;
        if (views && views.length) {
          views.reverse().forEach((view) => {
            this.Component = view(this.Component);
          });
        }
      }
      const AnsComponent = this.Component;
      return <AnsComponent {...other} />;
    }
  };
}
