import PropTypes from 'prop-types';
import React from 'react';
import { Statistic, Card } from 'semantic-ui-react';
import capitalize from 'lodash/fp/capitalize';
import { Link } from 'react-router-dom';
import prettySize from 'prettysize';
import { formatDate } from '../../Utils/index';

const UserCard = ({ user, statistics }) => (
  <Card centered fluid>
    <Card.Content>
      <Card.Header>
        <Link to="/me">
          {capitalize(user.first_name)} {capitalize(user.last_name)}
        </Link>
      </Card.Header>
      <Card.Meta>
        <span className="date">
          Joined in {formatDate(user.created_at, 'YYYY')}
        </span>
      </Card.Meta>
    </Card.Content>
    <Card.Content className="center aligned">
      <Statistic size="mini">
        <Statistic.Value>
          {statistics.uploads ? statistics.uploads.count : 0}
        </Statistic.Value>
        <Statistic.Label>File Uploaded</Statistic.Label>
      </Statistic>
    </Card.Content>
    <Card.Content className="center aligned">
      <Statistic size="mini">
        <Statistic.Value>
          {statistics.uploads ? prettySize(statistics.uploads.size) : 0}
        </Statistic.Value>
        <Statistic.Label>Uploads</Statistic.Label>
      </Statistic>
    </Card.Content>
  </Card>
);

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  statistics: PropTypes.object.isRequired,
};

export default UserCard;
