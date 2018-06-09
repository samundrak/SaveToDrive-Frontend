import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Card } from 'antd';
import startCase from 'lodash/fp/startCase';

const Plan = ({ plan }) => (
  <Card title={startCase(plan.name)} bordered={false}>
    Description:
    <ul>{plan.description.map((description) => <li>{description}</li>)}</ul>
    <Button type="primary">Subscribe ({plan.price}$)</Button>
  </Card>
);

Plan.propTypes = {
  plan: PropTypes.object.isRequired
};
export default Plan;
