import PropTypes from 'prop-types';
import React from 'react';
import { Card, Image, Icon, List } from 'semantic-ui-react';
import { popupOpener } from '../../Utils';

const handleConnectService = function handleConnectService(service) {
  return () => {
    popupOpener(service.service, service.url);
  };
};

const DrivesLists = ({ clouds }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        Cloud Services
      </Card.Header>
    </Card.Content>
    <Card.Content extra>
      <List divided verticalAlign="middle">
        {clouds.map(cloud => (
          <List.Item key={cloud.service}>
            <List.Content floated="right">
              <Icon
                onClick={handleConnectService(cloud)}
                name="plug"
                size="small"
                link
                circular
                title="Connect to service"
              />
              <Icon
                size="small"
                name="circle"
                color={cloud.status ? 'green' : 'red'}
                title={cloud.status ? `Connected as ${cloud.user.name}` : 'Not Connected'}
              />
            </List.Content>
            <List.Content>
              <Image avatar src={cloud.user.img || `/images/clouds/${cloud.service}.png`} />
              {cloud.label}
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Card.Content>
  </Card>
);

DrivesLists.propTypes = {
  clouds: PropTypes.array.isRequired,
};

export default DrivesLists;
