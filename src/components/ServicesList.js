import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';

const ServicesList = ({ handleMenuClick, services }) => (
  <Menu onClick={handleMenuClick}>
    {services.map((service) => (
      <Menu.Item key={service.id}>
        <Icon>
          <img src={`../images/clouds/${service.id}.svg`} height="16px" width="16px" alt={service.id} title={service.id} />
        </Icon>
        {service.name}
      </Menu.Item>
    ))}
  </Menu>
);
ServicesList.displayName = 'ServicesList';
ServicesList.propTypes = {
  services: PropTypes.array.isRequired,
  handleMenuClick: PropTypes.func.isRequired
};
export default ServicesList;
